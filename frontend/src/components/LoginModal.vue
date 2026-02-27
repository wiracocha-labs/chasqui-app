<template>
  <!-- Modal backdrop with transparent background -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0, 0, 0, 0.5);">
    <!-- Modal content -->
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="rounded-2xl shadow-lg p-8 border border-accent bg-secondary">
        <!-- Modal header with close button -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-textSecondary text-xl font-semibold">Iniciar Sesión</h2>
          <button 
            @click="closeModal"
            class="text-textSecondary hover:text-brand transition-colors p-2 rounded-lg hover:bg-brand-10"
            style="background-color: transparent; border: none; cursor: pointer;"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <!-- Left side - Forms -->
          <div class="w-full lg:w-1/2">
            <div class="text-center mb-8">
              <h2 class="text-textSecondary">Bienvenido</h2>
              <p class="text-textSecondary">Inicia sesión o conecta tu wallet</p>
            </div>
            
            <!-- Email/Password Login Form -->
            <div class="mb-6">
              <div class="flex items-center justify-center mb-4">
                <div class="flex-1 h-px" style="background-color: var(--color-textSecondary)"></div>
                <div class="flex-1 h-px" style="background-color: var(--color-textSecondary)"></div>
              </div>
              
              <form @submit.prevent="handleEmailLogin" class="space-y-4">
                <div class="form-group">
                  <label for="email" class="form-label required">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="form-input"
                    placeholder="tu@email.com"
                    :disabled="isConnecting"
                  />
                </div>
                
                <div class="form-group">
                  <label for="password" class="form-label required">
                    Contraseña
                  </label>
                  <div class="relative">
                    <input
                      id="password"
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      class="form-input pr-10"
                      placeholder="••••••••"
                      :disabled="isConnecting"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      :disabled="isConnecting"
                      style="color: var(--color-textSecondary)"
                    >
                      <span v-if="showPassword" class="text-sm">👁️</span>
                      <span v-else class="text-sm">🔒</span>
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  class="btn-secundary w-full"
                  :class="{ 'btn-disabled': isConnecting || !email || !password }"
                >
                  {{ isConnecting ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                </button>
              </form>
            </div>
            
            <!-- Wallet connection section -->
            <div class="mb-6">
              <div class="flex items-center justify-center mb-4">
                <div class="flex-1 h-px" style="background-color: var(--color-textSecondary)"></div>
                <div class="flex-1 h-px" style="background-color: var(--color-textSecondary)"></div>
              </div>
            </div>
            
            <!-- Error alert -->
            <div v-if="error" class="error-alert mb-6">
              <div class="error-content">
                <span class="error-icon">⚠️</span>
                <p class="error-text">{{ error }}</p>
              </div>
            </div>
            
            <!-- Wallet connection buttons -->
            <div class="flex flex-col gap-4">
              <button
                @click="connectWallet('metamask')"
                :disabled="isConnecting"
                class="btn-secundary"
                :class="{ 'btn-disabled': isConnecting }"
              >
                <span class="btn-icon">🦊</span>
                {{ isConnecting ? 'Conectando...' : 'Conectar con MetaMask' }}
              </button>
              <button
                @click="connectWallet('walletconnect')"
                :disabled="isConnecting"
                class="btn-secundary"
                :class="{ 'btn-disabled': isConnecting }"
              >
                <span class="btn-icon">🔗</span>
                {{ isConnecting ? 'Conectando...' : 'WalletConnect' }}
              </button>
              <button
                @click="connectWallet('coinbase')"
                :disabled="isConnecting"
                class="btn-secundary"
                :class="{ 'btn-disabled': isConnecting }"
              >
                <span class="btn-icon">💰</span>
                {{ isConnecting ? 'Conectando...' : 'Coinbase Wallet' }}
              </button>
            </div>
            
            <!-- Loading state -->
            <div v-if="isConnecting" class="loading-state">
              <div class="loading-spinner" style="border-color: var(--color-brand); border-top-color: var(--color-accent);"></div>
              <span class="loading-text" style="color: var(--color-primary);">Conectando wallet...</span>
            </div>
          </div>
          
          <!-- Right side - Branding -->
          <div class="w-full lg:w-1/2 text-center lg:text-left">
            <div class="mb-6 flex justify-center lg:justify-start">
              <img src="/src/assets/images/logo.webp" alt="Logo Chasqui" class="h-20 w-20" />
            </div>
            <h2 class="brand-title-sm mb-3 text-textSecondary">Chasqui</h2>
            <p class="brand-desc-sm mb-8 text-textSecondary">Privado. Claro. Hecho para tu equipo.</p>
            
            <!-- Features -->
            <div class="flex flex-col gap-6 mb-8">
              <div class="flex items-start gap-4">
                <div class="feature-icon mt-1">✓</div>
                <div>
                  <h3 class="brand-title-sm text-textSecondary">Descentralizado</h3>
                  <p class="brand-desc-sm text-textSecondary">Sin servidores centrales, tus datos son privados</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="feature-icon mt-1">✓</div>
                <div>
                  <h3 class="brand-title-sm text-textSecondary">Seguro</h3>
                  <p class="brand-desc-sm text-textSecondary">Conecta con tu wallet, sin contraseñas</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="feature-icon mt-1">✓</div>
                <div>
                  <h3 class="brand-title-sm text-textSecondary">Tiempo Real</h3>
                  <p class="brand-desc-sm text-textSecondary">Mensajes instantáneos con GunDB</p>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="text-center lg:text-left">
              <p class="text-sm text-textSecondary">© 2024 Chasqui - Sistema descentralizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

type WalletType = 'metamask' | 'walletconnect' | 'coinbase'

const router = useRouter()
const authStore = useAuthStore()

const isConnecting = ref(false)
const error = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

onMounted(() => {
  authStore.initializeProvider()
})

const closeModal = () => {
  emit('close')
}

const handleEmailLogin = async () => {
  try {
    isConnecting.value = true
    error.value = ''
    
    // Here you would implement your email/password authentication logic
    // For now, this is a placeholder that simulates authentication
    console.log('Email login attempt:', { email: email.value, password: '***' })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any email/password
    if (email.value && password.value) {
      // Store login info (in a real app, you'd get a token from your backend)
      localStorage.setItem('userEmail', email.value)
      localStorage.setItem('loginMethod', 'email')
      closeModal()
      router.push('/chat')
    } else {
      error.value = 'Por favor, completa todos los campos'
    }
  } catch (err) {
    console.error('Error en login con email:', err)
    error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
  } finally {
    isConnecting.value = false
  }
}

const connectWallet = async (walletType: WalletType) => {
  try {
    isConnecting.value = true
    error.value = ''
    await authStore.connectWallet()
    if (authStore.address) {
      const isAuthorized = await authStore.checkAuthorization(authStore.address)
      if (isAuthorized) {
        localStorage.setItem('connectedWallet', walletType)
        closeModal()
        router.push('/chat')
      } else {
        error.value = 'Tu dirección no está autorizada para acceder a esta aplicación.'
      }
    }
  } catch (err) {
    console.error(`Error conectando con ${walletType}:`, err)
    error.value = `Error al conectar con ${walletType}. Por favor, inténtalo de nuevo.`
  } finally {
    isConnecting.value = false
  }
}
</script>
