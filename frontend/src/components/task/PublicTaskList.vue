<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { PublicTask } from '../../composables/useTaskManager'

defineProps<{
  tasks: PublicTask[]
  loading: boolean
  applying: boolean
}>()

const emit = defineEmits<{
  apply: [payload: { task: PublicTask; message: string }]
}>()

const expandedUuid = ref<string | null>(null)
const messages = reactive<Record<string, string>>({})

const toggleExpanded = (task: PublicTask) => {
  expandedUuid.value = expandedUuid.value === task.uuid ? null : task.uuid
}

const handleApply = (task: PublicTask) => {
  emit('apply', { task, message: messages[task.uuid] || '' })
}
</script>

<template>
  <div class="public-task-list space-y-4">
    <p v-if="!loading && tasks.length === 0" class="text-sm text-gray-500 text-center py-10">
      No hay tareas públicas abiertas en este momento.
    </p>

    <div class="grid gap-4">
      <div
        v-for="task in tasks"
        :key="task.uuid"
        class="bg-white border-4 rounded-2xl overflow-hidden border-brand"
      >
        <div class="p-5 flex justify-between items-start gap-4 cursor-pointer" @click="toggleExpanded(task)">
          <div class="flex flex-col gap-1">
            <span class="text-lg font-bold text-gray-800">{{ task.task_name }}</span>
            <span class="text-sm text-textSecondary">{{ task.description }}</span>
            <span v-if="task.reward" class="text-xs text-textSecondary mt-1">Recompensa referencial: {{ task.reward }}</span>
          </div>
          <i :class="expandedUuid === task.uuid ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-gray-400 mt-1"></i>
        </div>

        <div v-if="expandedUuid === task.uuid" class="px-5 pb-5 border-t border-gray-100">
          <div class="form-group mt-3">
            <label :for="`message-${task.uuid}`" class="form-label">Mensaje (opcional)</label>
            <textarea
              :id="`message-${task.uuid}`"
              v-model="messages[task.uuid]"
              class="form-textarea"
              rows="2"
              placeholder="Contale al creador por qué sos la persona indicada..."
            ></textarea>
          </div>
          <button
            type="button"
            class="btn-secundary !w-auto !px-5 !py-2.5 !text-sm !rounded-full"
            :disabled="applying"
            @click="handleApply(task)"
          >
            {{ applying ? 'Aplicando...' : 'Aplicar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
