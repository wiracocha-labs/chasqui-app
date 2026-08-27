<script setup lang="ts">
import { reactive, ref } from 'vue'
import { extractRecordUuid, type PublicTask, type TaskApplication } from '../../composables/useTaskManager'

const props = defineProps<{
  tasks: PublicTask[]
  loading: boolean
  getApplications: (taskUuid: string) => Promise<TaskApplication[]>
  assign: (taskUuid: string, applicationId: string) => Promise<{ task: PublicTask; applicant_wallet: string | null } | null>
}>()

const emit = defineEmits<{
  refresh: []
  assigned: [payload: { task: PublicTask; wallet: string | null }]
}>()

const expandedUuid = ref<string | null>(null)
const applicationsByTask = reactive<Record<string, TaskApplication[]>>({})
const loadingApplications = reactive<Record<string, boolean>>({})
const assigningId = ref<string | null>(null)

const statusLabel = (status: PublicTask['status']) => {
  if (status === 'open') return 'Abierta'
  if (status === 'assigned') return 'Asignada'
  return 'Cerrada'
}

const statusClasses = (status: PublicTask['status']) => {
  if (status === 'open') return 'bg-amber-50 text-amber-600 border-amber-200'
  if (status === 'assigned') return 'bg-emerald-50 text-emerald-600 border-emerald-200'
  return 'bg-gray-50 text-gray-500 border-gray-200'
}

const toggleApplicants = async (task: PublicTask) => {
  if (expandedUuid.value === task.uuid) {
    expandedUuid.value = null
    return
  }
  expandedUuid.value = task.uuid
  if (!applicationsByTask[task.uuid]) {
    loadingApplications[task.uuid] = true
    try {
      applicationsByTask[task.uuid] = await props.getApplications(task.uuid)
    } finally {
      loadingApplications[task.uuid] = false
    }
  }
}

const handleAssign = async (task: PublicTask, application: TaskApplication) => {
  const applicationId = extractRecordUuid(application.id)
  assigningId.value = applicationId
  try {
    const result = await props.assign(task.uuid, applicationId)
    if (result) {
      emit('assigned', { task: result.task, wallet: result.applicant_wallet })
      expandedUuid.value = null
    }
  } finally {
    assigningId.value = null
  }
}
</script>

<template>
  <div class="public-task-owner-list space-y-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">
          <i class="fas fa-bullhorn mr-2 text-gray-400"></i>Tareas Públicas
        </h2>
        <p class="text-sm text-gray-500">Tareas que publicaste, abiertas a postulaciones</p>
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

    <p v-if="!loading && tasks.length === 0" class="text-sm text-gray-500">
      Todavía no publicaste ninguna tarea pública. Creá una desde la pestaña "Crear Tarea" eligiendo "Publicar para que cualquiera pueda aplicar".
    </p>

    <div class="grid gap-4">
      <div
        v-for="task in tasks"
        :key="task.uuid"
        class="bg-white border-4 rounded-2xl overflow-hidden border-brand"
      >
        <div class="p-5 flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <span class="text-lg font-bold text-gray-800">{{ task.task_name }}</span>
            <span v-if="task.reward" class="text-xs text-textSecondary">Recompensa referencial: {{ task.reward }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border min-w-[100px] text-center"
              :class="statusClasses(task.status)"
            >{{ statusLabel(task.status) }}</span>
            <button
              v-if="task.status === 'open'"
              class="btn-secundary !py-1 !px-4 !text-[10px] !w-auto !rounded-full !min-h-0 uppercase tracking-wider"
              @click="toggleApplicants(task)"
            >{{ expandedUuid === task.uuid ? 'Ocultar' : 'Ver postulantes' }}</button>
          </div>
        </div>

        <div v-if="expandedUuid === task.uuid" class="px-5 pb-5 border-t border-gray-100">
          <p class="text-sm text-textSecondary my-3">{{ task.description }}</p>

          <p v-if="loadingApplications[task.uuid]" class="text-sm text-gray-500">Cargando postulantes...</p>
          <p v-else-if="(applicationsByTask[task.uuid] || []).length === 0" class="text-sm text-gray-500">
            Todavía nadie aplicó a esta tarea.
          </p>
          <div v-else class="grid gap-2">
            <div
              v-for="application in applicationsByTask[task.uuid]"
              :key="extractRecordUuid(application.id)"
              class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div class="text-sm text-textSecondary">
                <div class="font-mono text-xs text-gray-500">{{ extractRecordUuid(application.applicant_id) }}</div>
                <div v-if="application.message">{{ application.message }}</div>
              </div>
              <button
                class="btn-secundary !py-1 !px-4 !text-[10px] !w-auto !rounded-full !min-h-0 uppercase tracking-wider"
                :disabled="assigningId === extractRecordUuid(application.id)"
                @click="handleAssign(task, application)"
              >
                {{ assigningId === extractRecordUuid(application.id) ? 'Asignando...' : 'Asignar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
