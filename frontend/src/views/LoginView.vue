
<template>
  <div class="min-h-screen flex">
    <!-- Left side - Info panel -->
    <div class="left-panel hidden lg:flex flex-1 flex-col justify-center p-8 bg-bg-secondary text-primary">
      <div class="max-w-sm mx-auto">
        <!-- Logo and branding -->
        <div class="text-center mb-12">
          <div class="logo-circle mb-6">
            <span class="logo-text">C</span>
          </div>
          <h1 class="brand-title mb-4">Chasqui</h1>
          <p class="brand-desc">Chat descentralizado y gestión de tareas</p>
        </div>
        <!-- Features -->
        <div class="flex flex-col gap-6">
          <div class="flex items-start gap-4">
            <div class="feature-icon mt-1">✓</div>
            <div>
              <h3 class="feature-title">Descentralizado</h3>
              <p class="feature-desc">Sin servidores centrales, tus datos son privados</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="feature-icon mt-1">✓</div>
            <div>
              <h3 class="feature-title">Seguro</h3>
              <p class="feature-desc">Conecta con tu wallet, sin contraseñas</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="feature-icon mt-1">✓</div>
            <div>
              <h3 class="feature-title">Tiempo Real</h3>
              <p class="feature-desc">Mensajes instantáneos con GunDB</p>
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
          <div class="mb-4 flex justify-center">
            <img src="/src/assets/images/logo.webp" alt="Logo Chasqui" class="h-16 w-16" />
          </div>
          <h2 class="brand-title-sm mb-2">Chasqui</h2>
          <p class="brand-desc-sm">Privado. Claro. Hecho para tu equipo.</p>
        </div>
        <!-- Login form -->
  <div class="rounded-2xl shadow-lg p-8 border border-accent bg-[var(--color-bg-secondary)]">
          <div class="text-center mb-8">
            <h2 class="text-textSecondary">Bienvenido</h2>
            <p class="text-textSecondary">Conecta tu wallet para continuar</p>
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
        <!-- Footer -->
        <div class="text-center">
          <p>© 2024 Chasqui - Sistema descentralizado</p>
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
    await authStore.connectWallet()
    if (authStore.address) {
      const isAuthorized = await authStore.checkAuthorization(authStore.address)
      if (isAuthorized) {
        localStorage.setItem('connectedWallet', walletType)
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
