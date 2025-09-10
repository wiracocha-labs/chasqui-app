<template>
  <div class="left-sidebar w-20 min-w-20 p-2 flex flex-col border-r border-brand-20 bg-action h-screen overflow-hidden fixed left-0 top-0 z-50">
    <!-- Botones principales (parte superior) -->
    <div class="flex flex-col flex-shrink-0">
      <div class="cursor-pointer mb-3" @click="handleNavigation('chat')">
        <button class="btn-square" title="Chat">
          C
        </button>
      </div>
      <div class="cursor-pointer mb-3" @click="handleNavigation('tasks')">
        <button class="btn-square" title="Tasks">
          T
        </button>
      </div>
      <div class="cursor-pointer mb-3">
        <button class="btn-square shadow-sm opacity-60" title="Más">
          <svg class="w-4 h-4 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Espaciador para empujar el botón de desconectar hacia abajo -->
    <div class="flex-1"></div>

    <!-- Botón de desconectar (parte inferior) -->
    <div class="flex-shrink-0 mb-2">
      <div class="cursor-pointer" @click="handleDisconnect">
        <button class="btn-square bg-red-600 hover:bg-red-700 text-white" title="Desconectar Wallet">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 11-2 0V4H5v12h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/>
            <path d="M13 10a1 1 0 100-2H9a1 1 0 100 2h4z"/>
            <path d="M15.293 9.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L16.586 12H13a1 1 0 110-2h3.586l-1.293-1.293a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleNavigation = (view: string) => {
  if (view === 'chat') {
    router.push('/chat')
  }
  if (view === 'tasks') {
    router.push('/tasks')
  }
}

const handleDisconnect = () => {
  // Desconectar la wallet
  authStore.disconnect()
  
  // Limpiar localStorage relacionado
  localStorage.removeItem('connectedWallet')
  
  // Redirigir al login
  router.push('/login')
}
</script>
