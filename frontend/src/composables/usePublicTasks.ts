import { ref } from 'vue'
import { apiGet, apiPost, ApiError } from '../services/api'
import { log } from '../services/logger'
import type { PublicTask } from './useTaskManager'

/**
 * Composable REST-only para el marketplace público de tareas: no depende de
 * web3Service ni de una wallet conectada, a diferencia de useTaskManager.
 */
export function usePublicTasks() {
  const tasks = ref<PublicTask[]>([])
  const loading = ref(false)
  const applying = ref(false)
  const alert = ref({ type: '', message: '' })

  const showAlert = (type: string, message: string) => {
    alert.value = { type, message }
    setTimeout(() => {
      alert.value = { type: '', message: '' }
    }, 5000)
  }

  const loadPublicTasks = async () => {
    loading.value = true
    try {
      tasks.value = await apiGet<PublicTask[]>('/tasks/public')
    } catch (error) {
      log.error('PublicTasks', 'Failed to load public tasks', error)
      showAlert('error', 'Error al cargar las tareas públicas')
    } finally {
      loading.value = false
    }
  }

  const applyToTask = async (uuid: string, message: string, token: string) => {
    applying.value = true
    try {
      await apiPost(`/tasks/public/${uuid}/apply`, { message: message || undefined }, token)
      showAlert('success', 'Aplicación enviada')
      return true
    } catch (error) {
      log.error('PublicTasks', `Failed to apply to task ${uuid}`, error)
      if (error instanceof ApiError && error.status === 409) {
        showAlert('info', 'Ya habías aplicado a esta tarea')
      } else {
        showAlert('error', 'Error al aplicar a la tarea')
      }
      return false
    } finally {
      applying.value = false
    }
  }

  return {
    tasks,
    loading,
    applying,
    alert,
    showAlert,
    loadPublicTasks,
    applyToTask
  }
}
