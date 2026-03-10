<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const MAX_DEADLINE_UPDATES = 2

const props = defineProps<{
  tasks: any[]
  loading: boolean
  account?: string | null
  taskMeta?: Record<number, { timeValue: number; timeUnit: 'hours' | 'days'; finishedRequested: boolean; deadlineUpdates?: number; conversationId?: string }>
}>()

const emit = defineEmits(['refresh', 'create', 'requestFinished', 'completeAndRelease', 'updateDate', 'cancelEscrow'])

const router = useRouter()
const expandedIndex = ref<number | null>(0)

const toggleTask = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const goToChat = async (escrow: any) => {
  const meta = props.taskMeta?.[escrow.id]
  
  if (meta?.conversationId) {
    await router.push(`/chat/${meta.conversationId}`)
  } else if (escrow.beneficiary) {
    await router.push({ path: '/chat', query: { target_wallet: escrow.beneficiary } })
  } else {
    await router.push('/chat')
  }
}

const getTaskTimeLabel = (escrowId: number) => {
  const meta = props.taskMeta?.[escrowId]
  if (!meta || !meta.timeValue) return 'No definido'
  return `${meta.timeValue} ${meta.timeUnit === 'days' ? 'día(s)' : 'hora(s)'}`
}

const isDeliveryAlreadyRequested = (escrowId: number) => {
  return !!props.taskMeta?.[escrowId]?.finishedRequested
}

const showBeneficiaryDeliveryButton = (escrow: any) => {
  if (!props.account) return false
  const sameWallet = props.account.toLowerCase() === String(escrow.beneficiary).toLowerCase()
  return sameWallet && !escrow.isCompleted && !escrow.isReleased
}

const canCompleteAndRelease = (escrow: any) => {
  if (!props.account) return false
  const sameWallet = props.account.toLowerCase() === String(escrow.depositor).toLowerCase()
  const finishedRequested = !!props.taskMeta?.[escrow.id]?.finishedRequested
  return sameWallet && finishedRequested && !escrow.isReleased
}

const getEscrowStatusLabel = (escrow: any) => {
  if (escrow.isReleased) return 'Pagada'
  if (escrow.isCompleted) return 'Completada'
  return 'Pendiente'
}

const getEscrowStatusClasses = (escrow: any) => {
  const status = getEscrowStatusLabel(escrow)
  if (status === 'Pagada') return 'bg-emerald-50 text-emerald-600 border-emerald-200'
  if (status === 'Completada') return 'bg-blue-50 text-blue-600 border-blue-200'
  return 'bg-amber-50 text-amber-600 border-amber-200'
}

const canUpdateDate = (escrow: any) => {
  if (escrow.isReleased || escrow.isCompleted) return false
  const count = props.taskMeta?.[escrow.id]?.deadlineUpdates ?? 0
  return count < MAX_DEADLINE_UPDATES
}

const deadlineUpdatesRemaining = (escrowId: number) => {
  const count = props.taskMeta?.[escrowId]?.deadlineUpdates ?? 0
  return MAX_DEADLINE_UPDATES - count
}

const canCancel = (escrow: any) => {
  return !escrow.isReleased && !escrow.isCompleted
}
</script>

<template>
  <div class="task-list space-y-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">
          <i class="fas fa-tasks mr-2 text-gray-400"></i>Gestión de Proyectos
        </h2>
        <p class="text-sm text-gray-500">Tareas creadas y asignadas para tu wallet</p>
      </div>

      <button
        class="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        :disabled="loading"
        @click="emit('refresh')"
      >
        <i class="fas fa-sync-alt mr-1" :class="{ 'animate-spin': loading }"></i>
        {{ loading ? 'Sincronizando...' : 'Sincronizar' }}
      </button>
    </div>

    <div class="grid gap-4">
      <div
        v-for="(escrow, index) in tasks"
        :key="escrow.id"
        class="bg-white border-4 rounded-2xl overflow-hidden border-brand cursor-default"
        :class="{ 'hover:bg-gray-100 transition-colors': expandedIndex !== index }"
        @click="toggleTask(index)"
      >
        <div class="p-5 flex justify-between items-center transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand transition-colors">
              <i :class="expandedIndex === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Canal / Tarea</span>
              <span class="text-lg font-bold text-gray-800">#{{ escrow.id }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="btn-secundary !py-1 !px-4 !text-[10px] !w-auto !rounded-full !min-h-0 uppercase tracking-wider"
              @click.stop="goToChat(escrow)"
            ><span>Chat</span></button>

            <span
              class="flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border min-w-[100px] text-center"
              :class="getEscrowStatusClasses(escrow)"
            ><span>{{ getEscrowStatusLabel(escrow) }}</span></span>
          </div>
        </div>

        <div
          v-if="expandedIndex === index"
          class="px-5 pb-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="rounded-lg p-3" style="background-color: #D9D9D9">
              <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Ejecutor</div>
              <div class="font-mono text-xs text-gray-600">{{ escrow.beneficiary }}</div>
            </div>
            <div class="rounded-lg p-3" style="background-color: #D9D9D9">
              <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Presupuesto Escrow</div>
              <div class="font-bold text-gray-700">
                {{ escrow.isPrivate ? '—' : `${escrow.publicAmount} AVAX` }}
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-textSecondary mb-1 font-medium">
              {{ escrow.isPrivate ? 'PAGO ENCRIPTADO (eERC20)' : 'PAGO PÚBLICO' }}
            </div>
            <div class="font-semibold text-sm text-textSecondary">
              {{ escrow.isPrivate ? `${String(escrow.encryptedAmount || '').slice(0, 12)}...` : `${escrow.publicAmount} AVAX` }}
            </div>
            <div v-if="escrow.isPrivate" class="flex items-center text-xs text-textSecondary mt-2">
              <i class="fas fa-lock mr-1 text-action"></i>
              <span>Monto encriptado con eERC20</span>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 mt-4">
            <div class="text-xs text-textSecondary font-medium mb-2">DESCRIPCIÓN DE LA TAREA</div>
            <div class="text-sm text-textSecondary leading-relaxed">{{ escrow.taskDescription }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xs text-textSecondary mb-1 font-medium">TIEMPO MÁXIMO</div>
              <div class="font-semibold text-sm text-textSecondary">
                {{ getTaskTimeLabel(escrow.id) }}
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xs text-textSecondary mb-1 font-medium">ESTADO DE ENTREGA</div>
              <div class="font-semibold text-sm text-textSecondary">
                {{ taskMeta?.[escrow.id]?.finishedRequested ? 'B indicó: Terminé tarea' : 'Sin confirmación de entrega' }}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
            <button
              v-if="canUpdateDate(escrow)"
              type="button"
              class="btn-secundary !w-auto !px-5 !py-2.5 !text-sm sm:!text-base !rounded-full"
              :title="`Quedan ${deadlineUpdatesRemaining(escrow.id)} actualización(es)`"
              @click.stop="emit('updateDate', escrow.id)"
            >
              <i class="fas fa-calendar-alt mr-2"></i>Actualizar Fecha
            </button>
            <button
              v-if="showBeneficiaryDeliveryButton(escrow)"
              type="button"
              class="btn-secundary !w-auto !px-5 !py-2.5 !text-sm sm:!text-base !rounded-full"
              :disabled="isDeliveryAlreadyRequested(escrow.id)"
              @click.stop="emit('requestFinished', escrow.id)"
            >
              <i class="fas fa-flag-checkered mr-2"></i>
              {{ isDeliveryAlreadyRequested(escrow.id) ? 'Tarea entregada' : 'Terminé tarea' }}
            </button>
            <button
              v-if="canCancel(escrow)"
              type="button"
              class="btn-secundary !w-auto !px-5 !py-2.5 !text-sm sm:!text-base !rounded-full"
              @click.stop="emit('cancelEscrow', escrow.id)"
            >
              <i class="fas fa-times-circle mr-2"></i>Cancelar Tarea
            </button>
          </div>
          <div class="flex justify-center mt-3">
            <button
              v-if="canCompleteAndRelease(escrow)"
              type="button"
              class="btn-primary !w-auto !px-5 !py-2.5 !text-sm sm:!text-base !rounded-full"
              @click.stop="emit('completeAndRelease', escrow.id)"
            >
              <i class="fas fa-coins mr-2"></i>Completar y liberar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
