<template>
  <div style="min-height: 100vh; display: flex; background: #edf2f7;">
    <!-- Left side - Info panel -->
    <div class="left-panel" style="display: none; flex: 1; flex-direction: column; justify-content: center; padding: 2rem; background: linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb); color: white;">
      <div style="max-width: 400px; margin: 0 auto;">
        <!-- Logo and branding -->
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 1.5rem;">
            <span style="font-size: 2.5rem; font-weight: bold;">C</span>
          </div>
          <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">Chasqui</h1>
          <p style="font-size: 1.125rem; color: #e0e7ff;">Chat descentralizado y gestión de tareas</p>
        </div>

        <!-- Features -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 0.25rem;">
              ✓
            </div>
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem;">Descentralizado</h3>
              <p style="color: #e0e7ff;">Sin servidores centrales, tus datos son privados</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 0.25rem;">
              ✓
            </div>
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem;">Seguro</h3>
              <p style="color: #e0e7ff;">Conecta con tu wallet, sin contraseñas</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 0.25rem;">
              ✓
            </div>
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem;">Tiempo Real</h3>
              <p style="color: #e0e7ff;">Mensajes instantáneos con GunDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Login form -->
    <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 1rem 1rem 3rem 1rem;">
      <div style="max-width: 400px; width: 100%; display: flex; flex-direction: column; gap: 2rem;">
        <!-- Mobile logo (visible on all screens now) -->
        <div style="text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: #4f46e5; border-radius: 50%; margin-bottom: 1rem;">
            <span style="font-size: 1.5rem; font-weight: bold; color: white;">C</span>
          </div>
          <h2 style="font-size: 1.875rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">Chasqui</h2>
          <p style="color: #6b7280;">Chat descentralizado</p>
        </div>

        <!-- Login form -->
        <div style="background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); padding: 2rem; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">Bienvenido</h2>
            <p style="margin-top: 0.5rem; color: #6b7280; font-size: 0.875rem;">Conecta tu wallet para continuar</p>
          </div>

          <!-- Error alert -->
          <div v-if="error" style="margin-bottom: 1.5rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem;">
            <div style="display: flex; align-items: flex-start;">
              <div style="flex-shrink: 0;">
                <span style="height: 20px; width: 20px; color: #ef4444;">⚠️</span>
              </div>
              <div style="margin-left: 0.75rem;">
                <p style="font-size: 0.875rem; color: #991b1b;">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Wallet connection buttons -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button
              @click="connectWallet('metamask')"
              :disabled="isConnecting"
              style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 0.75rem 1rem; border: none; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background: linear-gradient(to right, #f97316, #ea580c); color: white; font-weight: 500; transition: all 0.2s; cursor: pointer;"
              :style="{ opacity: isConnecting ? 0.5 : 1, cursor: isConnecting ? 'not-allowed' : 'pointer' }"
            >
              <span style="width: 20px; height: 20px; margin-right: 0.75rem;">🦊</span>
              {{ isConnecting ? 'Conectando...' : 'Conectar con MetaMask' }}
            </button>

            <button
              @click="connectWallet('walletconnect')"
              :disabled="isConnecting"
              style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background: white; color: #374151; font-weight: 500; transition: colors 0.2s; cursor: pointer;"
              :style="{ opacity: isConnecting ? 0.5 : 1, cursor: isConnecting ? 'not-allowed' : 'pointer' }"
            >
              <span style="width: 20px; height: 20px; margin-right: 0.75rem;">🔗</span>
              {{ isConnecting ? 'Conectando...' : 'WalletConnect' }}
            </button>

            <button
              @click="connectWallet('coinbase')"
              :disabled="isConnecting"
              style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background: white; color: #374151; font-weight: 500; transition: colors 0.2s; cursor: pointer;"
              :style="{ opacity: isConnecting ? 0.5 : 1, cursor: isConnecting ? 'not-allowed' : 'pointer' }"
            >
              <span style="width: 20px; height: 20px; margin-right: 0.75rem;">💰</span>
              {{ isConnecting ? 'Conectando...' : 'Coinbase Wallet' }}
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="isConnecting" style="display: flex; align-items: center; justify-content: center; margin-top: 1.5rem; padding: 1rem;">
            <div style="border-radius: 50%; height: 24px; width: 24px; border: 2px solid #4f46e5; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
            <span style="margin-left: 0.75rem; color: #6b7280;">Conectando wallet...</span>
          </div>

          <!-- Info -->
          <div style="margin-top: 2rem; text-align: center;">
            <p style="font-size: 0.75rem; color: #9ca3af; line-height: 1.6;">
              Al conectar tu wallet aceptas acceder a la red local Hardhat<br>
              <span style="font-weight: 500;">Chain ID: 31337</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center;">
          <p style="font-size: 0.875rem; color: #9ca3af;">
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

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hover effects for buttons */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Large screen responsive */
@media (min-width: 1024px) {
  .left-panel {
    display: flex !important;
  }
}
</style>
