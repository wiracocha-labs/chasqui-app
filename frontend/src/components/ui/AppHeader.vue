<template>
  <div class="text-center text-white my-10 fade-in">
    <h1 class="text-4xl md:text-5xl mb-3 font-bold header-title">
      <i class="fas fa-tasks mr-3"></i>Gestor de Tareas
    </h1>
    <div class="inline-block px-4 py-2 rounded-full network-status-glass">
      <i class="fas fa-network-wired mr-2"></i>
      <!-- {{ networkName || 'No conectado' }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  networkName?: string
}

defineProps<Props>()
</script>


