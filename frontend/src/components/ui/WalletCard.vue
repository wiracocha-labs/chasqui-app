<template>
  <!-- Wallet Connection Card -->
  <div v-if="!account" class="rounded-3xl p-6 mb-6 text-white wallet-card-gradient slide-up">
    <div class="text-2xl font-bold mb-5 flex items-center gap-3">
      <i class="fas fa-wallet"></i> Conectar Wallet
    </div>
    <p class="mb-5 opacity-90">
      Conecta tu wallet para comenzar a usar el sistema de tareas privadas.
    </p>
    <button 
      class="px-6 py-3 rounded-full font-medium transition-all duration-300 hover-lift"
      :class="connecting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'"
      :disabled="connecting"
      @click="handleConnect"
      style="background: var(--gradient-info);"
    >
      <i class="fas fa-plug mr-2"></i>
      {{ connecting ? 'Conectando...' : 'Conectar MetaMask' }}
    </button>
  </div>

  <!-- Connected Wallet Info -->
  <div v-else class="rounded-3xl p-6 mb-6 text-white wallet-card-gradient slide-up">
    <div class="text-2xl font-bold mb-5 flex items-center gap-3">
      <i class="fas fa-user"></i> Wallet Conectada
    </div>
    
    <!-- Info Grid con Tailwind -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div class="bg-black bg-opacity-10 rounded-lg p-3">
        <div class="text-sm opacity-75 mb-1">Dirección</div>
        <div class="font-semibold break-all">
          {{ account.slice(0,6) }}...{{ account.slice(-4) }}
        </div>
      </div>
      <div class="bg-black bg-opacity-10 rounded-lg p-3">
        <div class="text-sm opacity-75 mb-1">Balance ETH</div>
        <div class="font-semibold">{{ avaxBalance }} ETH</div>
      </div>
      <div class="bg-black bg-opacity-10 rounded-lg p-3">
        <div class="text-sm opacity-75 mb-1">Privacidad</div>
        <div class="font-semibold">
          <span 
            class="inline-block px-3 py-1 rounded-full text-xs font-medium"
            :class="isRegisteredForPrivacy ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'"
          >
            {{ isRegisteredForPrivacy ? 'Registrado' : 'No registrado' }}
          </span>
        </div>
      </div>
    </div>
    
    <button 
      v-if="!isRegisteredForPrivacy" 
      class="px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-lift"
      style="background: var(--gradient-warning); color: #374151;"
      @click="handleRegisterPrivacy"
    >
      <i class="fas fa-shield-alt mr-2"></i> Registrar para Privacidad
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  account?: string | null
  avaxBalance?: string
  isRegisteredForPrivacy?: boolean
  connecting?: boolean
}

interface Emits {
  (e: 'connect'): void
  (e: 'register-privacy'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleConnect = () => {
  emit('connect')
}

const handleRegisterPrivacy = () => {
  emit('register-privacy')
}
</script>

<style scoped>
/* Estilos específicos adicionales si necesarios */
</style>
