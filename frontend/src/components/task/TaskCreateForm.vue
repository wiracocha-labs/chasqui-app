<template>
  <div class="w-1/2 mx-auto flex flex-col items-center justify-center border-4 border-brand rounded-2xl p-6 bg-white shadow-sm">
    <form @submit.prevent="onSubmit" class="w-full">
      <h2 class="title mb-2">Crear nueva tarea</h2>

      <div class="form-group">
        <label class="form-label required">Tipo de tarea</label>
        <div class="flex flex-col gap-2 mt-1">
          <label class="flex items-center gap-2 text-sm">
            <input type="radio" name="taskVisibility" :checked="!form.openToApplicants" @change="form.openToApplicants = false" />
            Ya sé quién la va a hacer (asigno beneficiario ahora)
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="radio" name="taskVisibility" :checked="form.openToApplicants" @change="form.openToApplicants = true" />
            Publicar para que cualquiera pueda aplicar
          </label>
        </div>
      </div>

      <div v-if="form.openToApplicants" class="form-group">
        <label for="taskName" class="form-label required">Título</label>
        <input id="taskName" v-model="form.taskName" type="text" class="form-input" placeholder="Ej: Diseñar landing page" required />
      </div>

      <div v-if="!form.openToApplicants" class="form-group">
        <label for="beneficiary" class="form-label required">Beneficiario</label>
        <input id="beneficiary" v-model="form.beneficiary" type="text" class="form-input" placeholder="0x..." required />
      </div>
      <div v-if="!form.openToApplicants" class="form-group">
        <label for="amount" class="form-label required">Monto AVAX (precio USD)</label>
        <input id="amount" v-model="form.amount" type="number" min="0" step="0.01" class="form-input" placeholder="0.1 AVAX" :required="!form.isPrivate" />
        <p v-if="!form.isPrivate" class="text-xs text-textSecondary mt-1">
          {{ usdPriceLoading ? 'Cotizando AVAX/USD...' : `Equivalente: ${amountUsdEquivalent}` }}
        </p>
        <p v-if="!form.isPrivate && usdPriceSource === 'fallback'" class="text-[11px] text-textSecondary/80 mt-1">
          Precio USD referencial (fallback local).
        </p>
      </div>

      <div v-if="form.openToApplicants" class="form-group">
        <label for="reward" class="form-label">Recompensa (referencial)</label>
        <input id="reward" v-model="form.reward" type="text" class="form-input" placeholder="Ej: 0.5 AVAX" />
        <p class="text-xs text-textSecondary mt-1">
          Solo orientativo: el monto real del escrow se define recién cuando elijas a un postulante.
        </p>
      </div>

      <div v-if="!form.openToApplicants" class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="startDate" class="form-label required">Fecha Inicio</label>
          <input id="startDate" v-model="form.startDate" type="date" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="endDate" class="form-label required">Fecha Fin</label>
          <input id="endDate" v-model="form.endDate" type="date" class="form-input" required />
        </div>
      </div>

      <div class="form-group">
        <label for="taskDescription" class="form-label required">Descripción</label>
        <textarea id="taskDescription" v-model="form.taskDescription" class="form-textarea" rows="3" placeholder="Describe la tarea a realizar..." required></textarea>
      </div>
      <div v-if="!form.openToApplicants" class="form-group">
        <label for="timeValue" class="form-label required">Tiempo máximo</label>
        <div class="flex gap-2">
          <input
            id="timeValue"
            v-model.number="form.timeValue"
            type="number"
            min="1"
            step="1"
            class="form-input"
            placeholder="1"
            required
          />
          <select v-model="form.timeUnit" class="form-input max-w-[140px]">
            <option value="hours">Horas</option>
            <option value="days">Días</option>
          </select>
        </div>
      </div>
      <div v-if="!form.openToApplicants" class="form-group flex items-center">
        <input id="isPrivate" v-model="form.isPrivate" type="checkbox" class="form-checkbox" />
        <label for="isPrivate" class="form-label mb-0 ml-2">Privada (pago encriptado con eERC20)</label>
      </div>
      <button type="submit" class="btn-secundary w-full mt-4" :disabled="creating">
        {{ creating ? 'Creando...' : (form.openToApplicants ? 'Publicar tarea' : 'Crear tarea') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

interface CreateFormModel {
  beneficiary: string
  amount: string
  encryptedAmount: string
  taskDescription: string
  startDate: string
  endDate: string
  timeValue: number
  timeUnit: 'hours' | 'days'
  zkProof: string
  isPrivate: boolean
  /** true = tarea pública sin beneficiario asignado (aparece en el marketplace y espera postulantes) */
  openToApplicants: boolean
  /** Título corto, requerido solo cuando openToApplicants es true */
  taskName: string
  /** Recompensa orientativa en texto libre, solo para tareas abiertas */
  reward: string
}

const props = defineProps<{
  form: CreateFormModel
  creating: boolean
  amountUsdEquivalent: string
  usdPriceLoading: boolean
  usdPriceSource: 'live' | 'fallback' | 'none'
}>()

const { form, amountUsdEquivalent, usdPriceLoading, usdPriceSource } = toRefs(props)
const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit')
}
</script>
