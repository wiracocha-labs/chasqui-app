import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { web3Service, type EscrowDetails } from '../services/web3'
import { log } from '../services/logger'
import { TaskError } from '../services/errors'
import { CURRENT_NETWORK, NETWORKS } from '../config/index'

interface TaskMeta {
  timeValue: number
  timeUnit: 'hours' | 'days'
  finishedRequested: boolean
}

export function useTaskManager() {
  // Auth
  const authStore = useAuthStore()
  const account = computed(() => authStore.address)
  const networkName = ref<string>(NETWORKS[CURRENT_NETWORK].name)
  const avaxBalance = ref('0.00')
  const avaxUsdPrice = ref<number | null>(null)
  const amountUsdEquivalent = ref('N/A')
  const usdPriceLoading = ref(false)
  const usdPriceSource = ref<'live' | 'fallback' | 'none'>('none')
  let priceIntervalId: number | null = null

  // UI State
  const connecting = ref(false)
  const loading = ref(false)
  const creating = ref(false)
  const managing = ref(false)
  const activeTab = ref('create')
  const isRegisteredForPrivacy = ref(false)

  // Alerts
  const alert = ref({ type: '', message: '' })
  const showAlert = (type: string, message: string) => {
    alert.value = { type, message }
    setTimeout(() => {
      alert.value = { type: '', message: '' }
    }, 5000)
  }

  // Forms
  const todayIso = () => new Date().toISOString().slice(0, 10)
  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr + 'T12:00:00')
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  }
  const addHours = (dateStr: string, hours: number) => {
    const d = new Date(dateStr + 'T12:00:00')
    d.setHours(d.getHours() + hours)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const createForm = ref({
    beneficiary: '',
    amount: '',
    encryptedAmount: '',
    taskDescription: '',
    startDate: todayIso(),
    endDate: addDays(todayIso(), 1),
    timeValue: 1,
    timeUnit: 'days' as 'hours' | 'days',
    zkProof: '',
    isPrivate: false
  })

  let skipDatesSync = false
  let skipTimeSync = false
  watch(
    () => [createForm.value.startDate, createForm.value.endDate],
    ([start, end]) => {
      if (skipDatesSync || !start || !end) return
      const startD = new Date(String(start) + 'T12:00:00')
      const endD = new Date(String(end) + 'T12:00:00')
      const diffMs = endD.getTime() - startD.getTime()
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      if (diffHours < 0 || diffDays < 0) return
      skipTimeSync = true
      if (diffDays >= 1) {
        createForm.value.timeValue = Math.max(1, diffDays)
        createForm.value.timeUnit = 'days'
      } else {
        createForm.value.timeValue = Math.max(1, diffHours)
        createForm.value.timeUnit = 'hours'
      }
      void nextTick(() => { skipTimeSync = false })
    },
    { deep: true }
  )
  watch(
    () => [createForm.value.timeValue, createForm.value.timeUnit],
    ([val, unit]) => {
      if (skipTimeSync) return
      const v = Number(val)
      const u = String(unit)
      if (!Number.isFinite(v) || v < 1) return
      const today = todayIso()
      skipDatesSync = true
      createForm.value.startDate = today
      createForm.value.endDate = u === 'days' ? addDays(today, v) : addHours(today, v).slice(0, 10)
      void nextTick(() => { skipDatesSync = false })
    },
    { deep: true }
  )
  const manageForm = ref({
    escrowId: '',
    zkProof: ''
  })

  // Data
  const userEscrows = ref<EscrowDetails[]>([])
  const taskMeta = ref<Record<number, TaskMeta>>({})

  const TASK_META_KEY = 'chasqui_task_meta_v1'
  const AVAX_PRICE_CACHE_KEY = 'chasqui_avax_usd_price_v1'
  const FALLBACK_AVAX_USD_PRICE = Number(import.meta.env.VITE_AVAX_USD_FALLBACK || '25')
  const loadTaskMeta = () => {
    try {
      taskMeta.value = JSON.parse(localStorage.getItem(TASK_META_KEY) || '{}')
    } catch {
      taskMeta.value = {}
    }
  }
  const saveTaskMeta = () => {
    localStorage.setItem(TASK_META_KEY, JSON.stringify(taskMeta.value))
  }

  // Tabs
  const tabs = [
    { id: 'create', label: 'Crear Tarea', icon: 'fas fa-plus' },
    { id: 'list', label: 'Mis Tareas', icon: 'fas fa-list' }
  ]

  const normalizeAddress = (value?: string | null) => String(value || '').toLowerCase()

  const GAS_RESERVE_AVAX = 0.001

  const parseAmount = (value: string) => {
    const normalized = String(value || '').trim().replace(',', '.')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : NaN
  }

  const extractErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) {
      return error.message
    }
    if (typeof error === 'object' && error !== null) {
      const maybeMessage = (error as any)?.message
      if (typeof maybeMessage === 'string') {
        return maybeMessage
      }
      const nestedMessage = (error as any)?.originalError?.message
      if (typeof nestedMessage === 'string') {
        return nestedMessage
      }
      const nestedDeepMessage = (error as any)?.originalError?.originalError?.message
      if (typeof nestedDeepMessage === 'string') {
        return nestedDeepMessage
      }
    }
    return ''
  }

  const refreshAvaxUsdPrice = async () => {
    usdPriceLoading.value = true
    const endpoints = [
      'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd',
      'https://min-api.cryptocompare.com/data/price?fsym=AVAX&tsyms=USD',
      'https://api.coinbase.com/v2/prices/AVAX-USD/spot',
      'https://api.binance.com/api/v3/ticker/price?symbol=AVAXUSDT',
      'https://api.coincap.io/v2/assets/avalanche'
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        const price = Number(
          data?.['avalanche-2']?.usd ??
          data?.USD ??
          data?.data?.amount ??
          data?.price ??
          data?.data?.priceUsd
        )
        if (Number.isFinite(price) && price > 0) {
          avaxUsdPrice.value = price
          usdPriceSource.value = 'live'
          localStorage.setItem(AVAX_PRICE_CACHE_KEY, String(price))
          usdPriceLoading.value = false
          return
        }
      } catch (error) {
        log.warn('TaskManager', `Failed AVAX/USD source: ${endpoint}`, error)
      }
    }

    usdPriceLoading.value = false
    if (Number.isFinite(FALLBACK_AVAX_USD_PRICE) && FALLBACK_AVAX_USD_PRICE > 0) {
      avaxUsdPrice.value = FALLBACK_AVAX_USD_PRICE
      usdPriceSource.value = 'fallback'
      return
    }
    avaxUsdPrice.value = null
    usdPriceSource.value = 'none'
  }

  const updateAmountUsdEquivalent = () => {
    const amount = parseAmount(createForm.value.amount)
    const price = avaxUsdPrice.value
    if (!Number.isFinite(amount) || amount <= 0 || !price) {
      amountUsdEquivalent.value = 'N/A'
      return
    }
    const usd = (amount * price).toFixed(2)
    amountUsdEquivalent.value =
      usdPriceSource.value === 'fallback'
        ? `~ $${usd} USD (estimado)`
        : `~ $${usd} USD`
  }

  // Wallet
  const connectWallet = async () => {
    connecting.value = true
    try {
      log.info('TaskManager', 'Connecting wallet')
      await authStore.connectWallet()
      const connection = await web3Service.connect()
      networkName.value = connection.network
      avaxBalance.value = await authStore.getBalance()
      await loadUserEscrows()
      log.info('TaskManager', 'Wallet connected successfully')
      showAlert('success', 'Wallet conectada')
    } catch (error) {
      log.error('TaskManager', 'Failed to connect wallet', error)
      showAlert('error', 'Error al conectar wallet')
    } finally {
      connecting.value = false
    }
  }

  // Privacy
  const registerForPrivacy = async () => {
    if (!web3Service.isConnected()) {
      showAlert('error', 'Conecta tu wallet primero')
      log.warn('TaskManager', 'Wallet not connected before privacy registration')
      return
    }

    try {
      log.info('TaskManager', 'Registering for privacy')
      // Simulated registration process
      await new Promise(resolve => setTimeout(resolve, 2000))
      isRegisteredForPrivacy.value = true
      log.info('TaskManager', 'Successfully registered for privacy')
      showAlert('success', 'Registrado para privacidad exitosamente')
    } catch (error) {
      log.error('TaskManager', 'Privacy registration failed', error)
      showAlert('error', 'Error al registrar para privacidad')
      return
    }
  }

  // Create Task
  const createEscrow = async () => {
    // Validation
    if (!createForm.value.beneficiary || !createForm.value.taskDescription) {
      const error = new TaskError('Missing required fields for task creation', 'VALIDATION_ERROR')
      showAlert('error', 'Complete todos los campos requeridos')
      throw error
    }

    const beneficiaryNorm = normalizeAddress(createForm.value.beneficiary)
    const depositorNorm = normalizeAddress(authStore.address)
    if (beneficiaryNorm && depositorNorm && beneficiaryNorm === depositorNorm) {
      const error = new TaskError('Beneficiary cannot be the same as connected wallet', 'VALIDATION_ERROR')
      showAlert('error', 'No puedes ser tu propio beneficiario. Indica la dirección del ejecutor de la tarea.')
      throw error
    }

    if (!createForm.value.isPrivate && !createForm.value.amount) {
      const error = new TaskError('Amount required for public task', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique la cantidad para tarea pública')
      throw error
    }

    if (!createForm.value.isPrivate) {
      await updateBalance()
      const requestedAmount = parseAmount(createForm.value.amount)
      const availableBalance = parseAmount(avaxBalance.value)
      if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
        const error = new TaskError('Invalid public amount for task creation', 'VALIDATION_ERROR')
        showAlert('error', 'Ingrese un monto AVAX válido')
        throw error
      }

      if (!Number.isFinite(availableBalance) || requestedAmount + GAS_RESERVE_AVAX > availableBalance) {
        const error = new TaskError('Insufficient AVAX balance before creating task', 'INSUFFICIENT_FUNDS')
        showAlert(
          'error',
          `Saldo insuficiente. Necesitas ${requestedAmount.toFixed(4)} AVAX + gas y tienes ${availableBalance.toFixed(4)} AVAX`
        )
        throw error
      }
    }

    if (!createForm.value.timeValue || Number(createForm.value.timeValue) <= 0) {
      const error = new TaskError('Time value must be greater than 0', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique un tiempo válido (horas o días)')
      throw error
    }
    if (!web3Service.isConnected()) {
      const error = new TaskError('Wallet not connected before task creation', 'WALLET_NOT_CONNECTED')
      showAlert('error', 'Primero conecta tu wallet')
      throw error
    }

    creating.value = true

    try {
      const taskType = createForm.value.isPrivate ? 'private' : 'public'
      log.info('TaskManager', `Creating ${taskType} escrow for: ${createForm.value.beneficiary}`)
      let txReceipt: any
      if (createForm.value.isPrivate) {
        txReceipt = await web3Service.createPrivateEscrow(
          createForm.value.beneficiary,
          createForm.value.encryptedAmount || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          createForm.value.zkProof || '0xabcdef1234567890abcdef1234567890',
          createForm.value.taskDescription,
          {
            value: Number(createForm.value.timeValue),
            unit: createForm.value.timeUnit
          }
        )
      } else {
        txReceipt = await web3Service.createPublicEscrow(
          createForm.value.beneficiary,
          createForm.value.taskDescription,
          createForm.value.amount,
          {
            value: Number(createForm.value.timeValue),
            unit: createForm.value.timeUnit
          }
        )
      }

      const createdTaskType = createForm.value.isPrivate ? 'privada' : 'pública'
      const createdTimeValue = Number(createForm.value.timeValue)
      const createdTimeUnit = createForm.value.timeUnit

      const totalEscrowsAfterCreate = await web3Service.getTotalEscrows()
      const createdEscrowId = totalEscrowsAfterCreate - 1
      if (createdEscrowId >= 0) {
        taskMeta.value[createdEscrowId] = {
          timeValue: createdTimeValue,
          timeUnit: createdTimeUnit,
          finishedRequested: false
        }
        saveTaskMeta()
      }
      // Reset form
      createForm.value = {
        beneficiary: '',
        amount: '',
        encryptedAmount: '',
        taskDescription: '',
        startDate: todayIso(),
        endDate: addDays(todayIso(), 1),
        timeValue: 1,
        timeUnit: 'days',
        zkProof: '',
        isPrivate: false
      }

      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `${taskType} escrow created successfully`)
      showAlert('success', `Tarea ${createdTaskType} creada exitosamente`)
      activeTab.value = 'list'
    } catch (error) {
      log.error('TaskManager', 'Failed to create escrow', error)
      const msg = extractErrorMessage(error)
      if (msg.includes('No puedes ser tu propio beneficiario') || msg.includes('tu propio beneficiario')) {
        showAlert('error', 'No puedes ser tu propio beneficiario. Indica la dirección del ejecutor de la tarea.')
      } else {
        showAlert('error', 'Error al crear la tarea')
      }
      return
    } finally {
      creating.value = false
    }
  }

  // Manage Task
  // Manage Task
  const markCompleted = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      const error = new TaskError('Escrow ID is required to mark task completed', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique el ID de la tarea')
      throw error
    }

    if (!web3Service.isConnected()) {
      const error = new TaskError('Wallet not connected before marking task completed', 'WALLET_NOT_CONNECTED')
      showAlert('error', 'Primero conecta tu wallet')
      throw error
    }

    managing.value = true

    try {
      log.info('TaskManager', `Marking task completed: ${escrowId}`)
      await web3Service.markTaskCompleted(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `Task ${escrowId} marked as completed`)
      showAlert('success', `Tarea #${escrowId} marcada como completada`)
    } catch (error) {
      log.error('TaskManager', `Failed to mark task ${escrowId} as completed`, error)
      showAlert('error', 'Error al marcar tarea como completada')
      throw error
    } finally {
      managing.value = false
    }
  }

  const releaseFunds = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      const error = new TaskError('Escrow ID is required to release funds', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique el ID de la tarea')
      throw error
    }

    if (!web3Service.isConnected()) {
      const error = new TaskError('Wallet not connected before releasing funds', 'WALLET_NOT_CONNECTED')
      showAlert('error', 'Primero conecta tu wallet')
      throw error
    }

    managing.value = true

    try {
      const details = await web3Service.getEscrowDetails(Number(escrowId))
      const currentAddress = normalizeAddress(authStore.address)
      const isParticipant =
        currentAddress === normalizeAddress(details.depositor) ||
        currentAddress === normalizeAddress(details.beneficiary)
      const hasAuthorization = authStore.address
        ? await web3Service.isAuthorized(authStore.address)
        : false

      if (!isParticipant && !hasAuthorization) {
        showAlert('error', 'No autorizado para liberar fondos de esta tarea')
        return
      }
      if (details.isPrivate) {
        showAlert('error', 'Esta tarea es privada: usa el flujo de liberación privada')
        return
      }
      if (!details.isCompleted) {
        showAlert('error', 'La tarea aún no está completada en cadena')
        return
      }
      if (details.isReleased) {
        showAlert('info', 'El pago de esta tarea ya fue liberado')
        return
      }

      log.info('TaskManager', `Releasing funds for escrow: ${escrowId}`)
      await web3Service.releaseFunds(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `Funds released for escrow ${escrowId}`)
      showAlert('success', `Pago de la tarea #${escrowId} liberado exitosamente`)
    } catch (error) {
      log.error('TaskManager', `Failed to release funds for escrow ${escrowId}`, error)
      const txMessage = extractErrorMessage(error)
      if (txMessage.includes('Tarea no completada')) {
        showAlert('error', 'No se puede liberar: la tarea no está completada')
      } else if (txMessage.includes('Fondos ya liberados')) {
        showAlert('info', 'Este pago ya fue liberado anteriormente')
      } else if (txMessage.includes('No autorizado')) {
        showAlert('error', 'No tienes permisos para liberar este pago')
      } else {
        showAlert('error', 'Error al liberar el pago')
      }
      throw error
    } finally {
      managing.value = false
    }
  }

  const cancelEscrow = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      const error = new TaskError('Escrow ID is required to cancel escrow', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique el ID de la tarea')
      throw error
    }

    if (!web3Service.isConnected()) {
      const error = new TaskError('Wallet not connected before canceling escrow', 'WALLET_NOT_CONNECTED')
      showAlert('error', 'Primero conecta tu wallet')
      throw error
    }

    managing.value = true

    try {
      log.warn('TaskManager', `Canceling escrow: ${escrowId}`)
      await web3Service.cancelEscrow(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `Escrow ${escrowId} canceled successfully`)
      showAlert('success', `Tarea #${escrowId} cancelada exitosamente`)
    } catch (error) {
      log.error('TaskManager', `Failed to cancel escrow ${escrowId}`, error)
      showAlert('error', 'Error al cancelar la tarea')
      throw error
    } finally {
      managing.value = false
    }
  }

  const requestTaskFinished = async (escrowId: number) => {
    const current = taskMeta.value[escrowId] || { timeValue: 0, timeUnit: 'days' as const, finishedRequested: false }
    taskMeta.value[escrowId] = {
      ...current,
      finishedRequested: true
    }
    saveTaskMeta()
    showAlert('success', `Solicitud enviada: tarea #${escrowId} marcada como terminada`)
  }

  const completeAndRelease = async (escrowId: number) => {
    if (!web3Service.isConnected()) {
      showAlert('error', 'Primero conecta tu wallet')
      return
    }
    managing.value = true
    try {
      await web3Service.markTaskCompleted(escrowId)
      await web3Service.releaseFunds(escrowId)
      if (taskMeta.value[escrowId]) {
        taskMeta.value[escrowId].finishedRequested = false
      }
      saveTaskMeta()
      await updateBalance()
      await loadUserEscrows()
      showAlert('success', `Tarea #${escrowId} completada y pago liberado`)
    } catch (error) {
      log.error('TaskManager', `Failed to complete and release escrow ${escrowId}`, error)
      showAlert('error', 'Error al completar y liberar el pago')
    } finally {
      managing.value = false
    }
  }

  // List Tasks
  const loadUserEscrows = async () => {
    if (!web3Service.isConnected() || !authStore.address) {
      log.debug('TaskManager', 'Skipping escrow loading - wallet not connected or no address')
      return
    }

    loading.value = true

    try {
      log.info('TaskManager', `Loading escrows for address: ${authStore.address}`)
      const currentAddress = normalizeAddress(authStore.address)
      const depositorEscrowIds = await web3Service.getUserEscrows(authStore.address)
      const totalEscrows = await web3Service.getTotalEscrows()
      log.debug(
        'TaskManager',
        `Found ${depositorEscrowIds.length} depositor escrows. Scanning ${totalEscrows} total for beneficiary matches`
      )

      const mergedIds = new Set<number>(depositorEscrowIds)
      const detailsById = new Map<number, EscrowDetails>()

      const tryLoadDetails = async (id: number) => {
        try {
          const details = await web3Service.getEscrowDetails(id)
          detailsById.set(id, details)
          log.debug('TaskManager', `Loaded details for escrow ${id}`)
        } catch (error) {
          log.warn('TaskManager', `Failed to load details for escrow ${id}`, error)
        }
      }

      // Always load escrows where current wallet is depositor (on-chain indexed)
      for (const id of depositorEscrowIds) {
        await tryLoadDetails(id)
      }

      // Also include escrows where current wallet is beneficiary (not indexed on-chain)
      for (let id = 0; id < totalEscrows; id++) {
        if (detailsById.has(id)) {
          continue
        }

        let details: EscrowDetails | null = null
        try {
          details = await web3Service.getEscrowDetails(id)
        } catch (error) {
          log.warn('TaskManager', `Failed to scan escrow ${id} for beneficiary match`, error)
          continue
        }

        const isParticipant =
          normalizeAddress(details.depositor) === currentAddress ||
          normalizeAddress(details.beneficiary) === currentAddress

        if (isParticipant) {
          mergedIds.add(id)
          detailsById.set(id, details)
        }
      }

      const escrowsDetails = Array.from(mergedIds)
        .map((id) => detailsById.get(id))
        .filter((details): details is EscrowDetails => !!details)
        .sort((a, b) => b.id - a.id)

      userEscrows.value = escrowsDetails
      log.info('TaskManager', `Successfully loaded ${escrowsDetails.length} escrows for wallet`)
    } catch (error) {
      log.error('TaskManager', 'Failed to load user escrows', error)
      showAlert('error', 'Error al cargar las tareas')
      userEscrows.value = []
    } finally {
      loading.value = false
    }
  }

  // Balance
  const updateBalance = async () => {
    if (authStore.address) {
      try {
        log.debug('TaskManager', `Updating balance for: ${authStore.address}`)
        avaxBalance.value = await authStore.getBalance()
        log.debug('TaskManager', `Balance updated: ${avaxBalance.value} AVAX`)
      } catch (error) {
        log.error('TaskManager', 'Failed to update balance', error)
      }
    }
  }

  // Privacy toggle
  const togglePrivacy = () => {
    createForm.value.isPrivate = !createForm.value.isPrivate
  }

  // Date formatting
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Mount
  onMounted(async () => {
    log.debug('TaskManager', 'Component mounted, initializing')
    loadTaskMeta()
    if (!authStore.provider) {
      log.debug('TaskManager', 'Initializing provider')
      await authStore.initializeProvider()
    }

    if (authStore.address) {
      try {
        log.info('TaskManager', `Auto-connecting for existing address: ${authStore.address}`)
        const connection = await web3Service.connect()
        networkName.value = connection.network
        avaxBalance.value = await authStore.getBalance()
        await loadUserEscrows()
        log.info('TaskManager', 'Auto-connection successful')
      } catch (error) {
        log.warn('TaskManager', 'Auto-connection failed', error)
      }
    }

    const cachedPrice = Number(localStorage.getItem(AVAX_PRICE_CACHE_KEY) || '')
    if (Number.isFinite(cachedPrice) && cachedPrice > 0) {
      avaxUsdPrice.value = cachedPrice
      usdPriceSource.value = 'live'
      updateAmountUsdEquivalent()
    }

    await refreshAvaxUsdPrice()
    updateAmountUsdEquivalent()

    // Refresca la cotización de fondo para mantener el equivalente al día.
    priceIntervalId = window.setInterval(() => {
      void refreshAvaxUsdPrice()
    }, 60_000)
  })

  watch(() => authStore.address, async (newAddress) => {
    if (newAddress) {
      log.info('TaskManager', `Address changed to: ${newAddress}`)
      await updateBalance()
    } else {
      log.info('TaskManager', 'Address cleared')
      avaxBalance.value = '0.00'
    }
  })

  watch(() => createForm.value.amount, () => {
    if (createForm.value.amount && !avaxUsdPrice.value && !usdPriceLoading.value) {
      void refreshAvaxUsdPrice()
    }
    updateAmountUsdEquivalent()
  })

  watch(avaxUsdPrice, () => {
    updateAmountUsdEquivalent()
  })

  onUnmounted(() => {
    if (priceIntervalId !== null) {
      window.clearInterval(priceIntervalId)
    }
    log.debug('TaskManager', 'Component unmounting, cleaning up listeners')
    web3Service.removeAllListeners()
  })

  return {
    account,
    networkName,
    avaxBalance,
    connecting,
    loading,
    creating,
    managing,
    activeTab,
    isRegisteredForPrivacy,
    alert,
    showAlert,
    tabs,
    createForm,
    manageForm,
    amountUsdEquivalent,
    usdPriceLoading,
    usdPriceSource,
    refreshAvaxUsdPrice,
    userEscrows,
    taskMeta,
    connectWallet,
    registerForPrivacy,
    createEscrow,
    markCompleted,
    releaseFunds,
    cancelEscrow,
    requestTaskFinished,
    completeAndRelease,
    loadUserEscrows,
    updateBalance,
    togglePrivacy,
    formatDate
  }
}
