<template>
  <div class="wallet-connect-card component-card flex flex-col items-center justify-center">
    <i class="fas fa-wallet icon-large mb-2" />
    <h2 class="title mb-2">Conecta tu Wallet</h2>
    <p class="text-secondary mb-4">Para gestionar tareas y pagos, conecta tu wallet de Ethereum.</p>
    <button
      class="btn btn-primary"
      :disabled="connecting"
      @click="$emit('connect')"
    >
      <span v-if="connecting"><i class="fas fa-spinner fa-spin mr-2" />Conectando...</span>
      <span v-else><i class="fas fa-plug mr-2" />Conectar Wallet</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ connecting: boolean }>()
</script>


