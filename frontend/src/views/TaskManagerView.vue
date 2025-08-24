<template>
  <!-- Task Manager adaptado al nuevo layout -->
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b px-6 py-4 flex-none">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
          <p class="text-sm text-gray-600 mt-1">
            Crea, gestiona y completa tareas usando contratos inteligentes
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Network indicator -->
          <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ networkName }}
          </div>
          <!-- Balance display -->
          <div class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ avaxBalance }} ETH
          </div>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-6xl mx-auto p-6">
        <!-- Wallet connection card -->
        <div v-if="!account" class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-wallet text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Conecta tu Wallet</h3>
          <p class="text-gray-600 mb-6">Para gestionar tareas necesitas conectar tu wallet primero</p>
          <button 
            @click="connectWallet"
            :disabled="connecting"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            <i class="fas fa-plug mr-2"></i>
            {{ connecting ? 'Conectando...' : 'Conectar Wallet' }}
          </button>
        </div>

        <!-- Main interface when wallet is connected -->
        <div v-else class="space-y-6">
          <!-- Alerts -->
          <div v-if="alert.message" 
               class="p-4 rounded-xl font-medium slide-up flex items-center"
               :class="{
                 'bg-green-100 text-green-800 border border-green-200': alert.type === 'success',
                 'bg-red-100 text-red-800 border border-red-200': alert.type === 'error',
                 'bg-yellow-100 text-yellow-800 border border-yellow-200': alert.type === 'warning'
               }"
          >
            <i :class="alertIcon" class="mr-3 text-lg"></i> 
            <span>{{ alert.message }}</span>
          </div>

          <!-- Tab navigation -->
          <div class="bg-white rounded-2xl shadow-lg">
            <div class="flex bg-gray-50 rounded-t-2xl">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="flex-1 px-6 py-4 text-center font-medium transition-all duration-300 first:rounded-tl-2xl last:rounded-tr-2xl"
                :class="activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'"
                @click="activeTab = tab.id"
              >
                <i :class="tab.icon" class="mr-2"></i>{{ tab.label }}
              </button>
            </div>

            <!-- Tab content -->
            <div class="p-6">
              <!-- Create Task Tab -->
              <div v-if="activeTab === 'create'" class="space-y-6">
                <div class="text-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    <i class="fas fa-plus text-indigo-600 mr-3"></i>Crear Nueva Tarea
                  </h2>
                  <p class="text-gray-600">Define una tarea y establece los términos del contrato</p>
                </div>

                <!-- Privacy Toggle -->
                <div class="bg-gray-50 rounded-xl p-6 text-center">
                  <div class="flex items-center justify-center gap-4">
                    <span class="font-medium text-gray-700">Tarea Pública</span>
                    <div 
                      class="relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300"
                      :class="createForm.isPrivate ? 'bg-indigo-600' : 'bg-gray-300'"
                      @click="togglePrivacy"
                    >
                      <div 
                        class="absolute w-6 h-6 bg-white rounded-full top-0.5 transition-transform duration-300 shadow-md"
                        :class="createForm.isPrivate ? 'translate-x-7' : 'translate-x-0.5'"
                      ></div>
                    </div>
                    <span class="font-medium text-gray-700">Tarea Privada</span>
                    <i v-if="createForm.isPrivate" class="fas fa-shield-alt text-indigo-600 text-lg"></i>
                  </div>
                  <div class="mt-3 text-sm text-gray-500">
                    {{ createForm.isPrivate ? 'Los detalles serán encriptados' : 'Los detalles serán públicos' }}
                  </div>
                </div>

                <!-- Form -->
                <div class="grid grid-cols-1 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-user mr-2"></i>Ejecutor de la Tarea
                    </label>
                    <input 
                      type="text" 
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300 font-mono text-sm"
                      v-model="createForm.beneficiary" 
                      placeholder="0x... (dirección de quien realizará la tarea)"
                    />
                  </div>

                  <div v-if="!createForm.isPrivate">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-coins mr-2"></i>Cantidad (ETH)
                    </label>
                    <input 
                      type="number" 
                      step="0.001" 
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                      v-model="createForm.amount" 
                      placeholder="0.000"
                    />
                  </div>

                  <div v-if="createForm.isPrivate">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-lock mr-2"></i>Cantidad Encriptada (Hex)
                    </label>
                    <input 
                      type="text" 
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300 font-mono text-sm"
                      v-model="createForm.encryptedAmount" 
                      placeholder="0x..."
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-clipboard-list mr-2"></i>Descripción de la Tarea
                    </label>
                    <textarea 
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300 min-h-[120px] resize-y"
                      v-model="createForm.taskDescription" 
                      placeholder="Describe detalladamente la tarea que debe completarse..."
                    ></textarea>
                  </div>

                  <div v-if="createForm.isPrivate">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                      <i class="fas fa-key mr-2"></i>Prueba Zero-Knowledge (Hex)
                    </label>
                    <textarea 
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300 min-h-[100px] resize-y font-mono text-sm"
                      v-model="createForm.zkProof" 
                      placeholder="0x..."
                    ></textarea>
                  </div>

                  <button 
                    class="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    :class="creating ? 'opacity-60 cursor-not-allowed' : ''"
                    :disabled="creating"
                    @click="createEscrow"
                  >
                    <i class="fas fa-plus mr-3"></i>
                    {{ creating ? 'Creando...' : (createForm.isPrivate ? 'Crear Tarea Privada' : 'Crear Tarea Pública') }}
                  </button>
                </div>
              </div>

              <!-- Manage Tab -->
              <div v-if="activeTab === 'manage'" class="space-y-6">
                <div class="text-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    <i class="fas fa-tasks text-indigo-600 mr-3"></i>Gestionar Tareas
                  </h2>
                  <p class="text-gray-600">Actualiza el estado de las tareas existentes</p>
                </div>

                <div class="bg-gray-50 rounded-xl p-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-3">
                    <i class="fas fa-hashtag mr-2"></i>ID de la Tarea
                  </label>
                  <input 
                    type="number" 
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                    v-model="manageForm.escrowId" 
                    placeholder="Ingresa el ID de la tarea"
                  />
                </div>

                <!-- Action buttons -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    class="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 transform hover:scale-105"
                    :disabled="managing || !manageForm.escrowId"
                    @click="markCompleted"
                  >
                    <i class="fas fa-check mr-2"></i> Marcar Completada
                  </button>
                  <button 
                    class="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105"
                    :disabled="managing || !manageForm.escrowId"
                    @click="releaseFunds"
                  >
                    <i class="fas fa-coins mr-2"></i> Liberar Pago
                  </button>
                  <button 
                    class="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-red-600 hover:to-red-700 transform hover:scale-105"
                    :disabled="managing || !manageForm.escrowId"
                    @click="cancelEscrow"
                  >
                    <i class="fas fa-times mr-2"></i> Cancelar Tarea
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">
                    <i class="fas fa-shield-alt mr-2"></i>Prueba ZK (opcional para tareas privadas)
                  </label>
                  <textarea 
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300 min-h-[100px] resize-y font-mono text-sm"
                    v-model="manageForm.zkProof" 
                    placeholder="0x... (requerido para tareas privadas)"
                  ></textarea>
                </div>
              </div>

              <!-- List Tab -->
              <div v-if="activeTab === 'list'" class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">
                      <i class="fas fa-list text-indigo-600 mr-3"></i>Mis Tareas
                    </h2>
                    <p class="text-gray-600 mt-1">Todas las tareas que has creado</p>
                  </div>
                  <button 
                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105"
                    :disabled="loading" 
                    @click="loadUserEscrows"
                  >
                    <i class="fas fa-refresh mr-2" :class="{ 'animate-spin': loading }"></i> 
                    {{ loading ? 'Actualizando...' : 'Actualizar Lista' }}
                  </button>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="flex items-center justify-center py-16">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p class="text-gray-600 font-medium">Cargando tareas...</p>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else-if="!loading && userEscrows.length === 0" class="text-center py-16">
                  <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-inbox text-3xl text-gray-400"></i>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-700 mb-2">No hay tareas creadas</h3>
                  <p class="text-gray-500 mb-6">¡Crea tu primera tarea usando la pestaña "Crear Tarea"!</p>
                  <button 
                    @click="activeTab = 'create'"
                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <i class="fas fa-plus mr-2"></i> Crear Primera Tarea
                  </button>
                </div>

                <!-- Tasks list -->
                <div v-else-if="!loading && userEscrows.length > 0" class="grid gap-4">
                  <div 
                    v-for="escrow in userEscrows" 
                    :key="escrow.id"
                    class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <!-- Task header -->
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <div class="text-xl font-bold text-gray-900 mb-1">
                          <i class="fas fa-hashtag text-indigo-600 mr-2"></i>Tarea {{ escrow.id }}
                        </div>
                        <div class="flex items-center gap-2">
                          <span v-if="escrow.isPrivate" 
                                class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                          >
                            <i class="fas fa-shield-alt mr-1"></i> Privada
                          </span>
                          <span 
                            class="px-3 py-1 rounded-full text-xs font-medium"
                            :class="{
                              'bg-green-100 text-green-800 border border-green-200': escrow.isReleased,
                              'bg-blue-100 text-blue-800 border border-blue-200': escrow.isCompleted && !escrow.isReleased,
                              'bg-yellow-100 text-yellow-800 border border-yellow-200': !escrow.isCompleted
                            }"
                          >
                            <i :class="{
                              'fas fa-check-circle': escrow.isReleased,
                              'fas fa-check': escrow.isCompleted && !escrow.isReleased,
                              'fas fa-clock': !escrow.isCompleted
                            }" class="mr-1"></i>
                            {{ escrow.isReleased ? 'Pagada' : escrow.isCompleted ? 'Completada' : 'Pendiente' }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right text-sm text-gray-500">
                        {{ formatDate(escrow.timestamp) }}
                      </div>
                    </div>

                    <!-- Task details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-xs text-gray-600 mb-1 font-medium">EJECUTOR</div>
                        <div class="font-mono text-sm text-gray-900">
                          {{ escrow.beneficiary.slice(0,8) }}...{{ escrow.beneficiary.slice(-6) }}
                        </div>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-xs text-gray-600 mb-1 font-medium">
                          {{ escrow.isPrivate ? 'PAGO ENCRIPTADO' : 'PAGO' }}
                        </div>
                        <div class="font-semibold text-sm text-gray-900">
                          {{ escrow.isPrivate 
                            ? escrow.encryptedAmount.slice(0,12) + '...' 
                            : escrow.publicAmount + ' ETH' 
                          }}
                        </div>
                      </div>
                    </div>

                    <!-- Task description -->
                    <div class="bg-blue-50 rounded-lg p-4">
                      <div class="text-xs text-blue-800 font-medium mb-2">DESCRIPCIÓN DE LA TAREA</div>
                      <div class="text-sm text-blue-900 leading-relaxed">{{ escrow.taskDescription }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy registration card -->
          <div v-if="account && !isRegisteredForPrivacy" class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-1">
                  <i class="fas fa-shield-alt mr-2"></i>Funciones de Privacidad
                </h3>
                <p class="text-purple-100 text-sm">
                  Regístrate para crear tareas privadas con zero-knowledge proofs
                </p>
              </div>
              <button 
                @click="registerForPrivacy"
                class="px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300"
              >
                <i class="fas fa-user-plus mr-2"></i>Registrarse
              </button>
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
