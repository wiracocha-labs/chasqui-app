<template>
  <div id="app" class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize the auth store provider on app mount
  authStore.initializeProvider()
})
</script>

<style>
/* Font Awesome icons - must be first */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.app-container {
  min-height: 100vh;
}

/* Animation utilities */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
}

.slide-up {
  animation: slideInUp 0.6s ease-out;
}

.fade-in {
  animation: fadeIn 0.4s ease-in;
}

/* Utility classes */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.hover-slide {
  transition: transform 0.3s ease;
}

.hover-slide:hover {
  transform: translateX(5px);
}

/* Card gradient effect */
.card-gradient {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
