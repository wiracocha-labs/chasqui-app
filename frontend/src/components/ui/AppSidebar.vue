<template>
  <div class="left-sidebar w-20 min-w-20 p-2 flex flex-col border-r border-brand-20 bg-bg-primary">
    <div class="cursor-pointer mb-3" @click="$emit('navigate', 'chat')">
      <div class="icon-container sidebar-svg-wrapper text-lg font-semibold rounded-lg mb-1 overflow-hidden bg-brand text-color-textPrimary flex items-center justify-center w-10 h-10 shadow-md">
        C
      </div>
      <div class="text-center opacity-50 text-xs text-brand-80">⌘1</div>
    </div>
    <div class="cursor-pointer mb-3" @click="$emit('navigate', 'tasks')">
      <div class="icon-container sidebar-svg-wrapper opacity-25 text-lg font-semibold rounded-lg mb-1 overflow-hidden bg-accent text-color-textPrimary flex items-center justify-center w-10 h-10 shadow-md">
        L
      </div>
      <div class="text-center opacity-50 text-xs text-accent-60">⌘2</div>
    </div>
    <div class="cursor-pointer">
      <div class="icon-container sidebar-svg-wrapper opacity-25 rounded-lg mb-1 overflow-hidden bg-brand-10 flex items-center justify-center w-10 h-10 shadow-sm">
        <svg class="w-4 h-4 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente emite un evento 'navigate' con el nombre de la vista seleccionada
</script>
