<template>
  <div class="min-h-screen flex bg-chat-primary">
    <!-- Left side - Info panel -->
    <div class="left-panel hidden lg:flex flex-1 flex-col justify-center p-8 bg-chat-primary text-chat-primary">
      <div class="max-w-sm mx-auto">
        <!-- Logo and branding -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-chat-brand-light rounded-full mb-6">
            <span class="text-4xl font-bold text-chat-brand">C</span>
          </div>
          <h1 class="text-4xl font-bold mb-4 text-chat-brand">Chasqui</h1>
          <p class="text-lg text-chat-secondary">Chat descentralizado y gestión de tareas</p>
        </div>

        <!-- Features -->
        <div class="flex flex-col gap-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-6 h-6 bg-chat-brand-light rounded-full flex items-center justify-center mt-1">
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-lg text-chat-primary">Descentralizado</h3>
              <p class="text-chat-secondary">Sin servidores centrales, tus datos son privados</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-6 h-6 bg-chat-brand-light rounded-full flex items-center justify-center mt-1">
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-lg text-chat-primary">Seguro</h3>
              <p class="text-chat-secondary">Conecta con tu wallet, sin contraseñas</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-6 h-6 bg-chat-brand-light rounded-full flex items-center justify-center mt-1">
              ✓
            </div>
            <div>
              <h3 class="font-semibold text-lg text-chat-primary">Tiempo Real</h3>
              <p class="text-chat-secondary">Mensajes instantáneos con GunDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Login form -->
    <div class="flex-1 flex items-center justify-center p-4 pb-12">
      <div class="max-w-md w-full flex flex-col gap-8">
        <!-- Mobile logo -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-chat-brand rounded-full mb-4">
            <span class="text-2xl font-bold text-white">C</span>
          </div>
          <h2 class="text-3xl font-bold text-chat-primary mb-2">Chasqui</h2>
          <p class="text-chat-secondary">Chat descentralizado</p>
        </div>

        <!-- Login form -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-chat-primary mb-2">Bienvenido</h2>
            <p class="mt-2 text-chat-secondary text-sm">Conecta tu wallet para continuar</p>
          </div>

          <!-- Error alert -->
          <div v-if="error" class="mb-6 bg-chat-action-light border border-chat-action rounded-lg p-4">
            <div style="display: flex; align-items: flex-start;">
              <div style="flex-shrink: 0;">
                <span class="h-5 w-5 text-chat-action">⚠️</span>
              </div>
              <div style="margin-left: 0.75rem;">
                <p class="text-sm text-chat-action">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Wallet connection buttons -->
          <div class="flex flex-col gap-4">
            <button
              @click="connectWallet('metamask')"
              :disabled="isConnecting"
              class="w-full flex items-center justify-center px-4 py-3 border-0 rounded-lg shadow-sm bg-chat-brand text-white font-medium transition-all hover:bg-chat-accent"
              :class="{ 'opacity-50 cursor-not-allowed': isConnecting }"
            >
              <span class="w-5 h-5 mr-3">🦊</span>
              {{ isConnecting ? 'Conectando...' : 'Conectar con MetaMask' }}
            </button>

            <button
              @click="connectWallet('walletconnect')"
              :disabled="isConnecting"
              class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium transition-colors hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': isConnecting }"
            >
              <span class="w-5 h-5 mr-3">🔗</span>
              {{ isConnecting ? 'Conectando...' : 'WalletConnect' }}
            </button>

            <button
              @click="connectWallet('coinbase')"
              :disabled="isConnecting"
              class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium transition-colors hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': isConnecting }"
            >
              <span class="w-5 h-5 mr-3">💰</span>
              {{ isConnecting ? 'Conectando...' : 'Coinbase Wallet' }}
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="isConnecting" style="display: flex; align-items: center; justify-content: center; margin-top: 1.5rem; padding: 1rem;">
            <div class="rounded-full h-6 w-6 border-2 border-chat-brand border-t-transparent animate-spin"></div>
            <span class="ml-3 text-chat-secondary">Conectando wallet...</span>
          </div>

          <!-- Info -->
          <div style="margin-top: 2rem; text-align: center;">
            <p class="text-xs text-chat-secondary leading-relaxed">
              Al conectar tu wallet aceptas acceder a la red local Hardhat<br>
              <span style="font-weight: 500;">Chain ID: 31337</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center;">
          <p class="text-sm text-chat-secondary">
            © 2024 Chasqui - Sistema descentralizado
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

type WalletType = 'metamask' | 'walletconnect' | 'coinbase'

const router = useRouter()
const authStore = useAuthStore()

const isConnecting = ref(false)
const error = ref('')

onMounted(() => {
  authStore.initializeProvider()
})

const connectWallet = async (walletType: WalletType) => {
  try {
    isConnecting.value = true
    error.value = ''
    
    // Connect wallet using auth store
    await authStore.connectWallet()
    
    // Check if user is authorized
    if (authStore.address) {
      const isAuthorized = await authStore.checkAuthorization(authStore.address)
      
      if (isAuthorized) {
        // Save wallet type in localStorage
        localStorage.setItem('connectedWallet', walletType)
        // Redirect to chat after connecting
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


