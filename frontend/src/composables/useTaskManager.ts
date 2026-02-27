import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { web3Service, type EscrowDetails } from '../services/web3'
import { log } from '../services/logger'
import { TaskError } from '../services/errors'

export function useTaskManager() {
  // Auth
  const authStore = useAuthStore()
  const account = computed(() => authStore.address)
  const networkName = ref('Avalanche Mainnet')
  const avaxBalance = ref('12.45')

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
  const createForm = ref({
    beneficiary: '',
    amount: '',
    encryptedAmount: '',
    taskDescription: '',
    zkProof: '',
    isPrivate: false
  })
  const manageForm = ref({
    escrowId: '',
    zkProof: ''
  })

  // Data
  const userEscrows = ref<EscrowDetails[]>([])

  // Tabs
  const tabs = [
    { id: 'create', label: 'Crear Tarea', icon: 'fas fa-plus' },
    { id: 'manage', label: 'Gestionar', icon: 'fas fa-tasks' },
    { id: 'list', label: 'Mis Tareas', icon: 'fas fa-list' }
  ]

  // Wallet
  const connectWallet = async () => {
    connecting.value = true
    try {
      log.info('TaskManager', 'Connecting wallet')
      await authStore.connectWallet()
      await web3Service.connect()
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
      const error = new TaskError('Wallet not connected before privacy registration', 'WALLET_NOT_CONNECTED')
      showAlert('error', 'Conecta tu wallet primero')
      throw error
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
      throw error
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

    if (!createForm.value.isPrivate && !createForm.value.amount) {
      const error = new TaskError('Amount required for public task', 'VALIDATION_ERROR')
      showAlert('error', 'Especifique la cantidad para tarea pública')
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

      if (createForm.value.isPrivate) {
        await web3Service.createPrivateEscrow(
          createForm.value.beneficiary,
          createForm.value.encryptedAmount || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          createForm.value.zkProof || '0xabcdef1234567890abcdef1234567890',
          createForm.value.taskDescription
        )
      } else {
        await web3Service.createPublicEscrow(
          createForm.value.beneficiary,
          createForm.value.taskDescription,
          createForm.value.amount
        )
      }

      // Reset form
      createForm.value = {
        beneficiary: '',
        amount: '',
        encryptedAmount: '',
        taskDescription: '',
        zkProof: '',
        isPrivate: false
      }

      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `${taskType} escrow created successfully`)
      showAlert('success', `Tarea ${createForm.value.isPrivate ? 'privada' : 'pública'} creada exitosamente`)
      activeTab.value = 'list'
    } catch (error) {
      log.error('TaskManager', 'Failed to create escrow', error)
      showAlert('error', 'Error al crear la tarea')
      throw error
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
      log.info('TaskManager', `Releasing funds for escrow: ${escrowId}`)
      await web3Service.releaseFunds(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      log.info('TaskManager', `Funds released for escrow ${escrowId}`)
      showAlert('success', `Pago de la tarea #${escrowId} liberado exitosamente`)
    } catch (error) {
      log.error('TaskManager', `Failed to release funds for escrow ${escrowId}`, error)
      showAlert('error', 'Error al liberar el pago')
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

  // List Tasks
  const loadUserEscrows = async () => {
    if (!web3Service.isConnected() || !authStore.address) {
      log.debug('TaskManager', 'Skipping escrow loading - wallet not connected or no address')
      return
    }

    loading.value = true

    try {
      log.info('TaskManager', `Loading escrows for address: ${authStore.address}`)
      const escrowIds = await web3Service.getUserEscrows(authStore.address)
      log.debug('TaskManager', `Found ${escrowIds.length} escrow IDs`)

      const escrowsDetails: EscrowDetails[] = []
      for (const id of escrowIds) {
        try {
          const details = await web3Service.getEscrowDetails(id)
          escrowsDetails.push(details)
          log.debug('TaskManager', `Loaded details for escrow ${id}`)
        } catch (error) {
          log.warn('TaskManager', `Failed to load details for escrow ${id}`, error)
        }
      }

      userEscrows.value = escrowsDetails
      log.info('TaskManager', `Successfully loaded ${escrowsDetails.length} escrows`)
      showAlert('success', 'Lista de tareas actualizada')
    } catch (error) {
      log.error('TaskManager', 'Failed to load user escrows', error)
      showAlert('error', 'Error al cargar las tareas')
      throw error
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

    if (!authStore.provider) {
      log.debug('TaskManager', 'Initializing provider')
      await authStore.initializeProvider()
    }

    if (authStore.address) {
      try {
        log.info('TaskManager', `Auto-connecting for existing address: ${authStore.address}`)
        await web3Service.connect()
        avaxBalance.value = await authStore.getBalance()
        await loadUserEscrows()
        log.info('TaskManager', 'Auto-connection successful')
      } catch (error) {
        log.warn('TaskManager', 'Auto-connection failed', error)
      }
    }
  })

  watch(() => authStore.address, async (newAddress) => {
    if (newAddress) {
      log.info('TaskManager', `Address changed to: ${newAddress}`)
      await updateBalance()
    } else {
      log.info('TaskManager', 'Address cleared')
      avaxBalance.value = '12.45'
    }
  })

  onUnmounted(() => {
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
    userEscrows,
    connectWallet,
    registerForPrivacy,
    createEscrow,
    markCompleted,
    releaseFunds,
    cancelEscrow,
    loadUserEscrows,
    updateBalance,
    togglePrivacy,
    formatDate
  }
}
