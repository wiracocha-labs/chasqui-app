<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6">
    <!-- Header Component -->
    <AppHeader :network-name="networkName" />

    <!-- Wallet Component -->
    <WalletCard 
      :account="account"
      :avax-balance="avaxBalance"
      :is-registered-for-privacy="isRegisteredForPrivacy"
      :connecting="connecting"
      @connect="connectWallet"
      @register-privacy="registerForPrivacy"
    />

    <!-- Alerts -->
    <div v-if="alert.message" 
         class="p-4 rounded-lg mb-6 font-medium slide-up"
         :class="{
           'bg-green-100 text-green-800 border-l-4 border-green-500': alert.type === 'success',
           'bg-red-100 text-red-800 border-l-4 border-red-500': alert.type === 'error',
           'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500': alert.type === 'warning'
         }"
    >
      <i :class="alertIcon" class="mr-2"></i> {{ alert.message }}
    </div>

    <!-- Main Interface -->
    <div v-if="account" class="rounded-3xl p-6 mb-6 card-gradient slide-up">
      <!-- Tabs con Tailwind + efectos custom -->
      <div class="flex bg-white bg-opacity-10 rounded-2xl p-1 mb-6">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="flex-1 px-4 py-3 text-center rounded-xl cursor-pointer transition-all duration-300 font-semibold"
          :class="activeTab === tab.id ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600 hover:text-gray-800'"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon" class="mr-2"></i>{{ tab.label }}
        </div>
      </div>

      <!-- Create Task Tab -->
      <div v-if="activeTab === 'create'" class="fade-in">
        <div class="text-2xl font-bold mb-5 text-blue-600 flex items-center gap-3">
          <i class="fas fa-plus"></i> Crear Nueva Tarea
        </div>

        <!-- Privacy Toggle con diseño mejorado -->
        <div class="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <span class="font-medium text-gray-700">Tarea Pública</span>
          <div 
            class="relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300"
            :class="createForm.isPrivate ? 'bg-blue-500' : 'bg-gray-300'"
            @click="togglePrivacy"
          >
            <div 
              class="absolute w-6 h-6 bg-white rounded-full top-0.5 transition-transform duration-300 shadow-md"
              :class="createForm.isPrivate ? 'translate-x-7' : 'translate-x-0.5'"
            ></div>
          </div>
          <span class="font-medium text-gray-700">Tarea Privada</span>
          <i v-if="createForm.isPrivate" class="fas fa-shield-alt text-blue-500"></i>
        </div>

        <!-- Formulario con Tailwind + validación visual -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Ejecutor de la Tarea (Dirección)
            </label>
            <input 
              type="text" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
              v-model="createForm.beneficiary" 
              placeholder="0x... (quien realizará la tarea)"
            />
          </div>

          <div v-if="!createForm.isPrivate">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad (AVAX)
            </label>
            <input 
              type="number" 
              step="0.01" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
              v-model="createForm.amount" 
              placeholder="0.00"
            />
          </div>

          <div v-if="createForm.isPrivate">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad Encriptada (Hex)
            </label>
            <input 
              type="text" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
              v-model="createForm.encryptedAmount" 
              placeholder="0x..."
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Descripción de la Tarea
            </label>
            <textarea 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 min-h-[100px] resize-y"
              v-model="createForm.taskDescription" 
              placeholder="Describe la tarea que debe completarse..."
            ></textarea>
          </div>

          <div v-if="createForm.isPrivate">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Prueba Zero-Knowledge (Hex)
            </label>
            <textarea 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 min-h-[100px] resize-y"
              v-model="createForm.zkProof" 
              placeholder="0x..."
            ></textarea>
          </div>

          <button 
            class="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
            :class="creating ? 'opacity-60 cursor-not-allowed' : ''"
            :disabled="creating"
            @click="createEscrow"
            style="background: var(--gradient-primary); color: white;"
          >
            <i class="fas fa-plus mr-2"></i>
            {{ creating ? 'Creando...' : (createForm.isPrivate ? 'Crear Tarea Privada' : 'Crear Tarea Pública') }}
          </button>
        </div>
      </div>

      <!-- Manage Tab -->
      <div v-if="activeTab === 'manage'" class="fade-in">
        <div class="text-2xl font-bold mb-5 text-blue-600 flex items-center gap-3">
          <i class="fas fa-tasks"></i> Gestionar Tareas
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              ID de la Tarea
            </label>
            <input 
              type="number" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
              v-model="manageForm.escrowId" 
              placeholder="0"
            />
          </div>

          <!-- Botones de acción con diseño mejorado -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              class="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
              :disabled="managing"
              @click="markCompleted"
              style="background: var(--gradient-success); color: white;"
            >
              <i class="fas fa-check mr-2"></i> Marcar Completada
            </button>
            <button 
              class="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
              :disabled="managing"
              @click="releaseFunds"
              style="background: var(--gradient-primary); color: white;"
            >
              <i class="fas fa-coins mr-2"></i> Liberar Pago
            </button>
            <button 
              class="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
              :disabled="managing"
              @click="cancelEscrow"
              style="background: var(--gradient-danger); color: white;"
            >
              <i class="fas fa-times mr-2"></i> Cancelar Tarea
            </button>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Prueba ZK para Liberación/Cancelación (opcional)
            </label>
            <textarea 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300 min-h-[100px] resize-y"
              v-model="manageForm.zkProof" 
              placeholder="0x... (requerido para tareas privadas)"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- List Tab -->
      <div v-if="activeTab === 'list'" class="fade-in">
        <div class="text-2xl font-bold mb-5 text-blue-600 flex items-center gap-3">
          <i class="fas fa-list"></i> Mis Tareas
        </div>

        <button 
          class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift mb-6"
          :disabled="loading" 
          @click="loadUserEscrows"
          style="background: var(--gradient-primary); color: white;"
        >
          <i class="fas fa-refresh mr-2"></i> 
          {{ loading ? 'Cargando...' : 'Actualizar Lista' }}
        </button>

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12 text-gray-600">
          <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-4"></div>
          Cargando tareas...
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading && userEscrows.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-inbox text-6xl mb-4 opacity-30"></i>
          <p class="text-lg">No tienes tareas creadas aún.</p>
        </div>

        <!-- Escrow list -->
        <div v-else-if="!loading && userEscrows.length > 0" class="space-y-4">
          <div 
            v-for="escrow in userEscrows" 
            :key="escrow.id"
            class="bg-white rounded-2xl p-6 border-l-4 border-blue-500 hover-slide transition-all duration-300"
          >
            <!-- Escrow header -->
            <div class="flex justify-between items-center mb-4">
              <div class="text-xl font-bold text-blue-600">Tarea #{{ escrow.id }}</div>
              <div class="flex gap-2">
                <span v-if="escrow.isPrivate" 
                      class="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style="background: var(--gradient-danger);"
                >
                  <i class="fas fa-shield-alt mr-1"></i> Privada
                </span>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-purple-500 text-white': escrow.isReleased,
                    'bg-green-500 text-white': escrow.isCompleted && !escrow.isReleased,
                    'bg-yellow-500 text-gray-900': !escrow.isCompleted
                  }"
                >
                  {{ escrow.isReleased ? 'Pagada' : escrow.isCompleted ? 'Completada' : 'Pendiente' }}
                </span>
              </div>
            </div>

            <!-- Escrow details grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-sm text-gray-600 mb-1">Ejecutor</div>
                <div class="font-semibold break-all">
                  {{ escrow.beneficiary.slice(0,6) }}...{{ escrow.beneficiary.slice(-4) }}
                </div>
              </div>
              <div class="bg-blue-50 rounded-lg p-3" v-if="!escrow.isPrivate">
                <div class="text-sm text-gray-600 mb-1">Pago</div>
                <div class="font-semibold">{{ escrow.publicAmount }} AVAX</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-3" v-if="escrow.isPrivate">
                <div class="text-sm text-gray-600 mb-1">Pago Encriptado</div>
                <div class="font-semibold break-all">{{ escrow.encryptedAmount.slice(0,10) }}...</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-sm text-gray-600 mb-1">Fecha</div>
                <div class="font-semibold">{{ formatDate(escrow.timestamp) }}</div>
              </div>
            </div>

            <!-- Task description -->
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-sm text-gray-600 mb-1">Descripción de la Tarea</div>
              <div class="font-medium text-gray-800">{{ escrow.taskDescription }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AppHeader from '../components/ui/AppHeader.vue'
import WalletCard from '../components/ui/WalletCard.vue'
import { web3Service, type EscrowDetails } from '../services/web3'
import { useAuthStore } from '../stores/auth'

// Tabs configuration
const tabs = [
  { id: 'create', label: 'Crear Tarea', icon: 'fas fa-plus' },
  { id: 'manage', label: 'Gestionar', icon: 'fas fa-tasks' },
  { id: 'list', label: 'Mis Tareas', icon: 'fas fa-list' }
]

// Auth Store
const authStore = useAuthStore()

// Reactive data
const account = computed(() => authStore.address)
const networkName = ref('Hardhat Local')
const avaxBalance = ref('0.00')
const connecting = ref(false)
const isRegisteredForPrivacy = ref(false)

// UI State
const activeTab = ref('create')
const loading = ref(false)
const creating = ref(false)
const managing = ref(false)

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

// Alert
const alert = ref({
  type: '',
  message: ''
})

// Computed
const alertIcon = computed(() => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle'
  }
  return icons[alert.value.type as keyof typeof icons] || 'fas fa-info-circle'
})

// Methods
const showAlert = (type: string, message: string) => {
  alert.value = { type, message }
  setTimeout(() => {
    alert.value = { type: '', message: '' }
  }, 5000)
}

const connectWallet = async () => {
  connecting.value = true

  try {
    // Usar auth store para conectar
    await authStore.connectWallet()
    
    if (authStore.address) {
      // Obtener balance directamente del auth store
      avaxBalance.value = await authStore.getBalance()
      
      // Usar web3Service para operaciones específicas del contrato
      const connectionInfo = await web3Service.connect()
      networkName.value = connectionInfo.network
      
      // Verificar si está registrado para privacidad
      isRegisteredForPrivacy.value = await web3Service.isRegisteredForPrivacy(authStore.address)
      
      // Cargar las tareas del usuario
      await loadUserEscrows()
      
      showAlert('success', 'Wallet conectada exitosamente')
    }
  } catch (error) {
    console.error('Error connecting wallet:', error)
    showAlert('error', 'Error al conectar wallet')
  } finally {
    connecting.value = false
  }
}

const togglePrivacy = () => {
  if (!isRegisteredForPrivacy.value && !createForm.value.isPrivate) {
    showAlert('warning', 'Primero debes registrarte para usar funciones de privacidad')
    return
  }
  createForm.value.isPrivate = !createForm.value.isPrivate
}

const updateBalance = async () => {
  if (authStore.address) {
    try {
      avaxBalance.value = await authStore.getBalance()
    } catch (error) {
      console.error('Error updating balance:', error)
    }
  }
}

const registerForPrivacy = async () => {
  if (!web3Service.isConnected()) {
    showAlert('error', 'Primero conecta tu wallet')
    return
  }

  try {
    // Para demo, usamos datos simulados
    const mockPublicKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const mockProof = "0xabcdef1234567890abcdef1234567890"
    
    showAlert('warning', 'Registrando para funciones de privacidad...')
    // Nota: En un entorno real, aquí se registraría con el contrato real
    // await web3Service.registerForPrivacy(mockPublicKey, mockProof)
    
    // Simular registro exitoso
    await new Promise(resolve => setTimeout(resolve, 2000))
    isRegisteredForPrivacy.value = true
    showAlert('success', 'Registrado para privacidad exitosamente')
  } catch (error) {
    console.error('Error registering for privacy:', error)
    showAlert('error', 'Error al registrar para privacidad: ' + (error as Error).message)
  }
}

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
      // Crear tarea privada
      await web3Service.createPrivateEscrow(
        createForm.value.beneficiary,
        createForm.value.encryptedAmount || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        createForm.value.zkProof || '0xabcdef1234567890abcdef1234567890',
        createForm.value.taskDescription
      )
    } else {
      // Crear tarea pública
      await web3Service.createPublicEscrow(
        createForm.value.beneficiary,
        createForm.value.taskDescription,
        createForm.value.amount
      )
    }
    
    // Limpiar formulario
    createForm.value = {
      beneficiary: '',
      amount: '',
      encryptedAmount: '',
      taskDescription: '',
      zkProof: '',
      isPrivate: false
    }
    
    // Actualizar balance y recargar tareas
    await updateBalance()
    await loadUserEscrows()
    
    showAlert('success', `Tarea ${createForm.value.isPrivate ? 'privada' : 'pública'} creada exitosamente`)
    activeTab.value = 'list'
  } catch (error) {
    console.error('Error creating escrow:', error)
    showAlert('error', 'Error al crear la tarea: ' + (error as Error).message)
  } finally {
    creating.value = false
  }
}

const markCompleted = async () => {
  if (!manageForm.value.escrowId) {
    showAlert('error', 'Especifique el ID de la tarea')
    return
  }

  if (!web3Service.isConnected()) {
    showAlert('error', 'Primero conecta tu wallet')
    return
  }

  managing.value = true
  try {
    await web3Service.markTaskCompleted(Number(manageForm.value.escrowId))
    await updateBalance()
    await loadUserEscrows()
    showAlert('success', `Tarea #${manageForm.value.escrowId} marcada como completada`)
  } catch (error) {
    console.error('Error marking task completed:', error)
    showAlert('error', 'Error al marcar tarea como completada: ' + (error as Error).message)
  } finally {
    managing.value = false
  }
}

const releaseFunds = async () => {
  if (!manageForm.value.escrowId) {
    showAlert('error', 'Especifique el ID de la tarea')
    return
  }

  if (!web3Service.isConnected()) {
    showAlert('error', 'Primero conecta tu wallet')
    return
  }

  managing.value = true
  try {
    await web3Service.releaseFunds(Number(manageForm.value.escrowId))
    await updateBalance()
    await loadUserEscrows()
    showAlert('success', `Pago de la tarea #${manageForm.value.escrowId} liberado exitosamente`)
  } catch (error) {
    console.error('Error releasing funds:', error)
    showAlert('error', 'Error al liberar el pago: ' + (error as Error).message)
  } finally {
    managing.value = false
  }
}

const cancelEscrow = async () => {
  if (!manageForm.value.escrowId) {
    showAlert('error', 'Especifique el ID de la tarea')
    return
  }

  if (!web3Service.isConnected()) {
    showAlert('error', 'Primero conecta tu wallet')
    return
  }

  managing.value = true
  try {
    await web3Service.cancelEscrow(Number(manageForm.value.escrowId))
    await updateBalance()
    await loadUserEscrows()
    showAlert('success', `Tarea #${manageForm.value.escrowId} cancelada exitosamente`)
  } catch (error) {
    console.error('Error canceling escrow:', error)
    showAlert('error', 'Error al cancelar la tarea: ' + (error as Error).message)
  } finally {
    managing.value = false
  }
}

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
        console.error(`Error loading escrow ${id}:`, error)
      }
    }
    
    userEscrows.value = escrowsDetails
    showAlert('success', 'Lista de tareas actualizada')
  } catch (error) {
    console.error('Error loading user escrows:', error)
    showAlert('error', 'Error al cargar las tareas: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize 
onMounted(async () => {
  // Inicializar auth store solo si no hay provider
  if (!authStore.provider) {
    await authStore.initializeProvider()
  }
  
  // Si ya hay una conexión, conectar web3Service también
  if (authStore.address) {
    try {
      await web3Service.connect()
      avaxBalance.value = await authStore.getBalance()
      await loadUserEscrows()
    } catch (error) {
      console.error('Error connecting services on mount:', error)
    }
  }
})

// Watch for address changes to update balance
watch(() => authStore.address, async (newAddress) => {
  if (newAddress) {
    await updateBalance()
  } else {
    avaxBalance.value = '0.00'
  }
})

// Cleanup cuando se desmonta el componente
onUnmounted(() => {
  web3Service.removeAllListeners()
})
</script>

<style scoped>
/* Estilos específicos del componente si necesarios */
</style>
