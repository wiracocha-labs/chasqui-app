<template>
  <div class="home">
    <h1>Bienvenido a Chasqui</h1>
    <p>Tu plataforma de comunicación descentralizada</p>
    <div class="actions">
      <router-link to="/login" class="btn">Iniciar Sesión</router-link>
      <router-link to="/chat" class="btn" v-if="isAuthenticated">Ir al Chat</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #45a049;
}
</style>