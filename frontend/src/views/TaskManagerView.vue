<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/ui/AppHeader.vue'
import AppSidebar from '../components/ui/AppSidebar.vue'
import AlertMessage from '../components/ui/AlertMessage.vue'
import WalletConnectCard from '../components/ui/WalletConnectCard.vue'
import TaskCreateForm from '../components/task/TaskCreateForm.vue'
import TaskManageForm from '../components/task/TaskManageForm.vue'
import TaskList from '../components/task/TaskList.vue'
import { useTaskManager } from '../composables/useTaskManager'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

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
  manageForm,
  amountUsdEquivalent,
  usdPriceLoading,
  usdPriceSource,
  userEscrows,
  taskMeta,
  connectWallet,
  registerForPrivacy,
  createEscrow,
  markCompleted,
  updateTaskDate,
  confirmReleaseOrExecute,
  cancelEscrow,
  getReleaseConfirmations,
  canExecuteRelease,
  getEscrowDetailsForManage,
  requestTaskFinished,
  completeAndRelease,
  loadUserEscrows
} = useTaskManager()

const manageEscrowId = computed(() => {
  const id = manageForm.value.escrowId
  const n = Number(id)
  return Number.isNaN(n) ? null : n
})

const manageDetailsFetched = ref<import('../services/web3').EscrowDetails | null>(null)
watch(
  manageEscrowId,
  async (id) => {
    if (id == null) {
      manageDetailsFetched.value = null
      return
    }
    manageDetailsFetched.value = await getEscrowDetailsForManage(id)
  },
  { immediate: true }
)

const manageEscrowDetails = computed(() => {
  if (manageEscrowId.value == null) return null
  return (
    userEscrows.value.find((e) => e.id === manageEscrowId.value) ?? manageDetailsFetched.value ?? null
  )
})

const manageTaskMeta = computed(() => {
  if (manageEscrowId.value == null) return undefined
  return taskMeta.value[manageEscrowId.value]
})

const manageReleaseConfirmations = computed(() => {
  if (manageEscrowId.value == null) return { depositorConfirmed: false, beneficiaryConfirmed: false }
  return getReleaseConfirmations(manageEscrowId.value)
})

const manageCanExecuteRelease = computed(() => {
  if (manageEscrowId.value == null) return false
  return canExecuteRelease(manageEscrowId.value)
})

const shortAddress = computed(() => {
  const addr = account.value
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})

const handleDisconnect = async () => {
  authStore.disconnect()
  await router.push('/tasks')
}

const handleCreateEscrow = async () => {
  try {
    await createEscrow()
  } catch {
    // Los mensajes de error UX ya se manejan en el composable
  }
}

</script>

<!-- Task Manager adaptado al nuevo layout -->
<template>
  <div class="task-manager-view min-h-screen flex flex-row">
    <AppSidebar />
    <div class="flex-1 flex flex-col ml-20">
      <AppHeader />
      <div class="container mx-auto py-6 flex-1">
        <div v-if="account" class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-secondary">Gestión de Tareas</h1>
          </div>
          <div class="flex items-center flex-wrap gap-3">
            <div class="bg-accent text-primary px-3 py-1.5 rounded-full text-sm font-medium">{{ networkName }}</div>
            <div class="bg-brand text-primary px-3 py-1.5 rounded-full text-sm font-medium">{{ avaxBalance }} AVAX</div>
            <div
              class="px-3 py-1.5 rounded-full text-sm font-medium font-mono border border-brand/40"
              style="background: rgba(212, 175, 55, 0.15); color: var(--color-brand);"
              :title="account"
            >
              {{ shortAddress }}
            </div>
            <button
              type="button"
              class="text-sm text-textSecondary hover:text-brand transition-colors"
              @click="handleDisconnect"
            >
              Desconectar
            </button>
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
              <TaskCreateForm
                v-if="activeTab === 'create'"
                :form="createForm"
                :creating="creating"
                :amount-usd-equivalent="amountUsdEquivalent"
                :usd-price-loading="usdPriceLoading"
                :usd-price-source="usdPriceSource"
                @submit="handleCreateEscrow"
              />
              <TaskManageForm
                v-if="activeTab === 'manage'"
                :form="manageForm"
                :loading="managing"
                :account="account"
                :escrow-details="manageEscrowDetails"
                :task-meta-for-escrow="manageTaskMeta"
                :release-confirmations="manageReleaseConfirmations"
                :can-execute-release="manageCanExecuteRelease"
                @mark-completed="markCompleted"
                @update-date="updateTaskDate"
                @confirm-release-or-execute="confirmReleaseOrExecute"
                @cancel-escrow="cancelEscrow"
              />
              <TaskList
                v-if="activeTab === 'list'"
                :tasks="userEscrows"
                :loading="loading"
                :account="account"
                :taskMeta="taskMeta"
                @refresh="loadUserEscrows"
                @create="() => activeTab = 'create'"
                @requestFinished="requestTaskFinished"
                @completeAndRelease="completeAndRelease"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
