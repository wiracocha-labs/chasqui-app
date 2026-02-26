<template>
  <div class="w-1/2 mx-auto flex flex-col items-center justify-center border-4 border-brand rounded-2xl p-6 bg-white shadow-sm">
    <form @submit.prevent="onSubmit" class="w-full">
      <h2 class="title mb-2">Crear nueva tarea</h2>
      <div class="form-group">
        <label for="beneficiary" class="form-label required">Beneficiario</label>
        <input id="beneficiary" v-model="form.beneficiary" type="text" class="form-input" placeholder="0x..." required />
      </div>
      <div class="form-group">
        <label for="amount" class="form-label required">Monto (ETH)</label>
        <input id="amount" v-model="form.amount" type="number" min="0" step="0.01" class="form-input" placeholder="0.1" required />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
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
      
      <button type="submit" class="btn-secundary w-full mt-4">Crear tarea</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const emit = defineEmits(['submit'])

const today = new Date().toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// MOCK: Información pre-llenada para demostración en video
const form = ref({
  beneficiary: '0x3A216E98dB49987A4F234234234234234234F901',
  amount: '0.75',
  startDate: today,
  endDate: nextWeek,
  taskDescription: 'Integración de la capa frontend con el contrato inteligente de Escrow. Implementación de llamadas a métodos de creación de tareas, eventos de escucha y manejo de estados de transacción con Wagmi/Viem.'
})

const onSubmit = () => {
  emit('submit', { ...form.value })
  // Opcional: limpiar el formulario
  // form.value = { beneficiary: '', amount: '', startDate: '', endDate: '', taskDescription: '' }
}
</script>
