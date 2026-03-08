<template>
  <div class="w-1/2 mx-auto flex flex-col items-center justify-center border-4 border-brand rounded-2xl p-6 bg-white shadow-sm">
    <form class="component-card p-6 space-y-4" @submit.prevent>
      <h2 class="title mb-2">Gestionar Tarea</h2>
      <div class="form-group">
        <label for="escrowId" class="form-label required">ID de la Tarea</label>
        <input
          id="escrowId"
          v-model="form.escrowId"
          type="text"
          class="form-input"
          placeholder="Ej: 0"
        />
      </div>
      <div v-if="escrowDetails" class="form-group">
        <label class="form-label">Nombre de la Tarea</label>
        <p class="form-input bg-secondary/30">{{ escrowDetails.taskDescription || '—' }}</p>
      </div>
      <div class="form-group">
        <label for="zkProof" class="form-label">Prueba Criptográfica (solo para eERC20)</label>
        <textarea
          id="zkProof"
          v-model="form.zkProof"
          class="form-textarea"
          rows="4"
          placeholder="Solo requerido para transacciones privadas con eERC20"
        ></textarea>
      </div>
      <div class="flex justify-start w-full">
        <button type="button" class="btn-secundary !w-40" :disabled="loading" @click="onGoToChat">
          Ir al Chat
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button type="button" class="btn-secundary" :disabled="loading" @click="onMarkCompleted">
          Marcar Completada
        </button>
        <button
          v-if="isDepositor"
          type="button"
          class="btn-secundary"
          :disabled="loading || !canUpdateDate"
          :title="!canUpdateDate ? `Máximo ${maxDeadlineUpdates} actualizaciones por tarea` : undefined"
          @click="onUpdateDate"
        >
          Actualizar Fecha
        </button>
        <button
          type="button"
          class="btn-secundary"
          :disabled="loading || !form.escrowId"
          @click="onConfirmReleaseOrExecute"
        >
          {{ releaseButtonLabel }}
        </button>
        <button type="button" class="btn-secundary" :disabled="loading" @click="onCancelEscrow">
          Cancelar Tarea
        </button>
      </div>
      <p v-if="releaseHint" class="text-sm text-textSecondary mt-2">{{ releaseHint }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { EscrowDetails } from '../../services/web3'

interface TaskMetaForEscrow {
  deadlineUpdates?: number
  depositorReleaseConfirmed?: boolean
  beneficiaryReleaseConfirmed?: boolean
}

const props = withDefaults(
  defineProps<{
    form: { escrowId: string; zkProof: string }
    loading?: boolean
    account: string | null
    escrowDetails: EscrowDetails | null
    taskMetaForEscrow?: TaskMetaForEscrow
    releaseConfirmations: { depositorConfirmed: boolean; beneficiaryConfirmed: boolean }
    canExecuteRelease: boolean
  }>(),
  { loading: false, taskMetaForEscrow: () => ({}) }
)

const emit = defineEmits<{
  markCompleted: [payload: { escrowId: string; zkProof: string }]
  updateDate: [escrowId: number]
  confirmReleaseOrExecute: [payload: { escrowId: string }]
  cancelEscrow: [payload: { escrowId: string; zkProof: string }]
}>()

const router = useRouter()

const normalize = (addr: string) => String(addr || '').toLowerCase()

const isDepositor = computed(() => {
  if (!props.account || !props.escrowDetails) return false
  return normalize(props.account) === normalize(props.escrowDetails.depositor)
})

const maxDeadlineUpdates = 2
const deadlineUpdatesCount = computed(() => props.taskMetaForEscrow?.deadlineUpdates ?? 0)
const canUpdateDate = computed(() => isDepositor.value && deadlineUpdatesCount.value < maxDeadlineUpdates)

const hasUserConfirmedRelease = computed(() => {
  if (!props.account || !props.escrowDetails) return false
  if (isDepositor.value) return props.releaseConfirmations.depositorConfirmed
  return props.releaseConfirmations.beneficiaryConfirmed
})

const releaseButtonLabel = computed(() => {
  if (props.canExecuteRelease) return 'Liberar el Pago'
  return 'Liberar el Pago'
})

const releaseHint = computed(() => {
  if (!props.form.escrowId) return ''
  if (props.canExecuteRelease) return 'Ambos han confirmado. Al hacer clic se ejecutará la liberación.'
  if (hasUserConfirmedRelease.value) return 'Esperando que la otra parte también confirme "Liberar el Pago" para ejecutar la liberación.'
  return 'Ambos (creador y ejecutor) deben confirmar "Liberar el Pago" para ejecutar la liberación.'
})

const onMarkCompleted = () =>
  emit('markCompleted', { escrowId: props.form.escrowId, zkProof: props.form.zkProof })
const onUpdateDate = () => emit('updateDate', Number(props.form.escrowId))
const onConfirmReleaseOrExecute = () => emit('confirmReleaseOrExecute', { escrowId: props.form.escrowId })
const onCancelEscrow = () =>
  emit('cancelEscrow', { escrowId: props.form.escrowId, zkProof: props.form.zkProof })
const onGoToChat = () => {
  router.push('/chat')
}
</script>
