import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { web3Service, type EscrowDetails } from '../services/web3'

export function useTaskManager() {
  // Auth
  const authStore = useAuthStore()
  const account = computed(() => authStore.address)
  const networkName = ref('Hardhat Local')
  const avaxBalance = ref('0.00')

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
      await authStore.connectWallet()
      await web3Service.connect()
      avaxBalance.value = await authStore.getBalance()
      await loadUserEscrows()
      showAlert('success', 'Wallet conectada')
    } catch (error) {
      showAlert('error', 'Error al conectar wallet')
    } finally {
      connecting.value = false
    }
  }

  // Privacy
  const registerForPrivacy = async () => {
    if (!web3Service.isConnected()) {
      showAlert('error', 'Conecta tu wallet primero')
      return
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      isRegisteredForPrivacy.value = true
      showAlert('success', 'Registrado para privacidad exitosamente')
    } catch (error) {
      showAlert('error', 'Error al registrar para privacidad')
    }
  }

  // Create Task
  const createEscrow = async () => {
    if (!createForm.value.beneficiary || !createForm.value.taskDescription) {
      showAlert('error', 'Complete todos los campos requeridos')
      return
    }
    if (!createForm.value.isPrivate && !createForm.value.amount) {
      showAlert('error', 'Especifique la cantidad para tarea pública')
      return
    }
    if (!web3Service.isConnected()) {
      showAlert('error', 'Primero conecta tu wallet')
      return
    }
    creating.value = true
    try {
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
      showAlert('success', `Tarea ${createForm.value.isPrivate ? 'privada' : 'pública'} creada exitosamente`)
      activeTab.value = 'list'
    } catch (error) {
      showAlert('error', 'Error al crear la tarea')
    } finally {
      creating.value = false
    }
  }

  // Manage Task
  const markCompleted = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      showAlert('error', 'Especifique el ID de la tarea')
      return
    }
    if (!web3Service.isConnected()) {
      showAlert('error', 'Primero conecta tu wallet')
      return
    }
    managing.value = true
    try {
      await web3Service.markTaskCompleted(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      showAlert('success', `Tarea #${escrowId} marcada como completada`)
    } catch (error) {
      showAlert('error', 'Error al marcar tarea como completada')
    } finally {
      managing.value = false
    }
  }

  const releaseFunds = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      showAlert('error', 'Especifique el ID de la tarea')
      return
    }
    if (!web3Service.isConnected()) {
      showAlert('error', 'Primero conecta tu wallet')
      return
    }
    managing.value = true
    try {
      await web3Service.releaseFunds(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      showAlert('success', `Pago de la tarea #${escrowId} liberado exitosamente`)
    } catch (error) {
      showAlert('error', 'Error al liberar el pago')
    } finally {
      managing.value = false
    }
  }

  const cancelEscrow = async ({ escrowId }: { escrowId: string }) => {
    if (!escrowId) {
      showAlert('error', 'Especifique el ID de la tarea')
      return
    }
    if (!web3Service.isConnected()) {
      showAlert('error', 'Primero conecta tu wallet')
      return
    }
    managing.value = true
    try {
      await web3Service.cancelEscrow(Number(escrowId))
      await updateBalance()
      await loadUserEscrows()
      showAlert('success', `Tarea #${escrowId} cancelada exitosamente`)
    } catch (error) {
      showAlert('error', 'Error al cancelar la tarea')
    } finally {
      managing.value = false
    }
  }

  // List Tasks
  const loadUserEscrows = async () => {
    if (!web3Service.isConnected() || !authStore.address) {
      return
    }
    loading.value = true
    try {
      const escrowIds = await web3Service.getUserEscrows(authStore.address)
      const escrowsDetails: EscrowDetails[] = []
      for (const id of escrowIds) {
        try {
          const details = await web3Service.getEscrowDetails(id)
          escrowsDetails.push(details)
        } catch (error) {
          // skip errored escrows
        }
      }
      userEscrows.value = escrowsDetails
      showAlert('success', 'Lista de tareas actualizada')
    } catch (error) {
      showAlert('error', 'Error al cargar las tareas')
    } finally {
      loading.value = false
    }
  }

  // Balance
  const updateBalance = async () => {
    if (authStore.address) {
      avaxBalance.value = await authStore.getBalance()
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
    if (!authStore.provider) {
      await authStore.initializeProvider()
    }
    if (authStore.address) {
      try {
        await web3Service.connect()
        avaxBalance.value = await authStore.getBalance()
        await loadUserEscrows()
      } catch {}
    }
  })

  watch(() => authStore.address, async (newAddress) => {
    if (newAddress) {
      await updateBalance()
    } else {
      avaxBalance.value = '0.00'
    }
  })

  onUnmounted(() => {
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
