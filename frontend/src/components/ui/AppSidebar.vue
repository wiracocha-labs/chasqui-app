<template>
  <div class="left-sidebar w-20 min-w-20 p-2 flex flex-col border-r border-brand-20 bg-action">
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
    <div class="cursor-pointer">
      <button class="btn-square shadow-sm opacity-60" title="Más">
        <svg class="w-4 h-4 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente emite un evento 'navigate' con el nombre de la vista seleccionada

const handleNavigation = (view: string) => {
  if (view === 'chat') {
    window.location.href = '/chat'; // Ajusta la ruta si usas Vue Router
  }
  if (view === 'tasks') {
    window.location.href = '/tasks'; // Ajusta la ruta si usas Vue Router
  }
}
</script>
