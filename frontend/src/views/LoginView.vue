<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Conecta tu Wallet
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Para acceder al chat, necesitas conectar tu wallet
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="error" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <button
            @click="connectWallet('metamask')"
            :disabled="isConnecting"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isConnecting ? 'Conectando...' : 'Conectar con MetaMask' }}
          </button>

          <button
            @click="connectWallet('walletconnect')"
            :disabled="isConnecting"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ isConnecting ? 'Conectando...' : 'Conectar con WalletConnect' }}
          </button>

          <button
            @click="connectWallet('coinbase')"
            :disabled="isConnecting"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {{ isConnecting ? 'Conectando...' : 'Conectar con Coinbase Wallet' }}
          </button>
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
