<script setup lang="ts">
import AppHeader from '../components/ui/AppHeader.vue'
import AppSidebar from '../components/ui/AppSidebar.vue'
import AlertMessage from '../components/ui/AlertMessage.vue'
import WalletConnectCard from '../components/ui/WalletConnectCard.vue'
import TaskCreateForm from '../components/task/TaskCreateForm.vue'
import TaskManageForm from '../components/task/TaskManageForm.vue'
import TaskList from '../components/task/TaskList.vue'
import { useTaskManager } from '../composables/useTaskManager'

const {
  account,
  networkName,
  avaxBalance,
  connecting,
  loading,
  creating,
  managing,
  activeTab,
  isRegisteredForPrivacy,
  alert,
  tabs,
  createForm,
  userEscrows,
  connectWallet,
  registerForPrivacy,
  createEscrow,
  markCompleted,
  releaseFunds,
  cancelEscrow,
  loadUserEscrows,
  togglePrivacy
} = useTaskManager()
</script>

<!-- Task Manager adaptado al nuevo layout -->
<template>
  <div class="task-manager-view min-h-screen flex flex-row">
    <AppSidebar />
    <div class="flex-1 flex flex-col">
      <AppHeader />
      <div class="container mx-auto py-6 flex-1">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-secondary">Gestión de Tareas</h1>
            <p class="text-sm text-secondary mt-1">Crea, gestiona y completa tareas usando contratos inteligentes con eERC20</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">{{ networkName }}</div>
            <div class="bg-brand text-primary px-3 py-1 rounded-full text-sm font-medium">{{ avaxBalance }} ETH</div>
          </div>
        </div>
        <AlertMessage v-if="alert.message" :type="alert.type" :message="alert.message" class="mb-4" />
        <WalletConnectCard v-if="!account" :connecting="connecting" @connect="connectWallet" class="mb-8" />
        <div v-else>
          <div class="bg-secondary rounded-2xl shadow-lg mb-6">
            <div class="flex bg-secondary rounded-t-2xl">
              <button v-for="tab in tabs" :key="tab.id"
                  class="flex-1 px-6 py-4 text-center font-medium transition-all duration-300 first:rounded-tl-2xl last:rounded-tr-2xl"
                  :class="activeTab === tab.id
                    ? 'bg-action text-brand shadow-sm border-b-4 border-brand'
                    : 'text-textSecondary hover:bg-action-80 hover:text-brand hover:border-2 hover:border-brand'"
                @click="activeTab = tab.id"
              >
                <i :class="tab.icon" class="mr-2"></i>{{ tab.label }}
              </button>
            </div>
            <div class="p-6">
              <TaskCreateForm v-if="activeTab === 'create'" :form="createForm" :creating="creating" @submit="createEscrow" @togglePrivacy="togglePrivacy" />
              <TaskManageForm v-if="activeTab === 'manage'" :loading="managing" @markCompleted="markCompleted" @releaseFunds="releaseFunds" @cancelEscrow="cancelEscrow" />
              <TaskList v-if="activeTab === 'list'" :tasks="userEscrows" :loading="loading" @refresh="loadUserEscrows" @create="() => activeTab = 'create'" />
            </div>
          </div>
          <div v-if="account && !isRegisteredForPrivacy" class="bg-brand rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-1"><i class="fas fa-shield-alt mr-2"></i>Transacciones Privadas eERC20</h3>
                <p class="text-textSecondary text-sm">Regístrate para crear tareas con pagos encriptados usando eERC20 de Avalanche</p>
              </div>
              <button @click="registerForPrivacy" class="px-6 py-3 bg-white text-brand rounded-xl font-medium hover:bg-secondary transition-all duration-300">
                <i class="fas fa-user-plus mr-2"></i>Registrar para eERC20
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
