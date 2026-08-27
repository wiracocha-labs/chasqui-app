<template>
  <div id="app" class="app-container">
    <RouterView />
    <!-- Modal global de login: se puede forzar desde cualquier ruta, p. ej.
         al detectar un cambio de cuenta de MetaMask (ver stores/auth.ts). -->
    <LoginModal
      :is-open="authStore.showLoginModal"
      :redirect-on-success="false"
      @close="authStore.showLoginModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import LoginModal from './components/LoginModal.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize the auth store provider on app mount
  authStore.initializeProvider()
})
</script>


