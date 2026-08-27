<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Navbar from '../components/ui/Navbar.vue'
import Footer from '../components/ui/Footer.vue'
import AlertMessage from '../components/ui/AlertMessage.vue'
import LoginModal from '../components/LoginModal.vue'
import PublicTaskList from '../components/task/PublicTaskList.vue'
import { usePublicTasks } from '../composables/usePublicTasks'
import { useAuthStore } from '../stores/auth'
import type { PublicTask } from '../composables/useTaskManager'

const authStore = useAuthStore()
const { tasks, loading, applying, alert, loadPublicTasks, applyToTask } = usePublicTasks()

const isLoginModalOpen = ref(false)
const pendingApplication = ref<{ task: PublicTask; message: string } | null>(null)

const handleApply = async (payload: { task: PublicTask; message: string }) => {
  if (!authStore.isAuthenticated || !authStore.token) {
    pendingApplication.value = payload
    isLoginModalOpen.value = true
    return
  }
  await applyToTask(payload.task.uuid, payload.message, authStore.token)
}

const handleLoginSuccess = async () => {
  isLoginModalOpen.value = false
  const pending = pendingApplication.value
  pendingApplication.value = null
  if (pending && authStore.token) {
    await applyToTask(pending.task.uuid, pending.message, authStore.token)
  }
}

onMounted(() => {
  loadPublicTasks()
})
</script>

<template>
  <div class="public-task-board-view">
    <Navbar @open-login="isLoginModalOpen = true" />
    <div class="bento-container marketplace-page-content">
      <div class="text-center my-10 fade-in">
        <h1 class="text-4xl md:text-5xl mb-3 font-bold header-title">
          <i class="fas fa-store mr-3"></i>Marketplace de Tareas
        </h1>
        <p class="text-sm opacity-80">Tareas públicas abiertas a postulaciones. No necesitás cuenta para verlas.</p>
      </div>
      <AlertMessage v-if="alert.message" :type="alert.type" :message="alert.message" class="mb-4" />
      <PublicTaskList
        :tasks="tasks"
        :loading="loading"
        :applying="applying"
        @apply="handleApply"
      />
    </div>
    <LoginModal
      :is-open="isLoginModalOpen"
      :redirect-on-success="false"
      @close="isLoginModalOpen = false"
      @success="handleLoginSuccess"
    />
    <Footer />
  </div>
</template>

<style scoped>
.marketplace-page-content {
  padding-top: 140px;
  padding-bottom: 4rem;
  min-height: 100vh;
}
</style>
