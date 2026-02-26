<template>
  <div class="task-list space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">
        <i class="fas fa-tasks mr-2 text-gray-400"></i>Gestión de Proyectos
      </h2>
      <button class="text-sm text-gray-500 hover:text-gray-800 transition-colors" @click="mockedTasks = [...mockedTasks]">
        <i class="fas fa-sync-alt mr-1"></i> Sincronizar
      </button>
    </div>

    <!-- MOCK: Lista de tareas y acordeón para video showcase -->
    <div class="grid gap-4">
      <div 
        v-for="(task, index) in mockedTasks" 
        :key="task.id"
        class="bg-white border-4 rounded-2xl overflow-hidden border-brand cursor-default"
        :class="{ 'hover:bg-gray-100 transition-colors': expandedTask !== index }"
        @click="toggleTask(index)"
      >
        <!-- Header always visible -->
        <div class="p-5 flex justify-between items-center transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand transition-colors">
              <i :class="expandedTask === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Canal / Tarea</span>
              <span class="text-lg font-bold text-gray-800">{{ task.id }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              class="btn-secundary !py-1 !px-4 !text-[10px] !w-auto !rounded-full !min-h-0 uppercase tracking-wider"
              @click.stop="goToChat(task.id)"
            ><span>Chat</span></button>
            <span 
              class="flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border min-w-[100px] text-center"
              :class="{
                'bg-emerald-50 text-emerald-600 border-emerald-200': task.status === 'Pagada',
                'bg-amber-50 text-amber-600 border-amber-200': task.status === 'Pendiente',
                'bg-blue-50 text-blue-600 border-blue-200': task.status === 'Completada',
                'bg-rose-50 text-rose-600 border-rose-200': task.status === 'Cancelada'
              }"
            ><span>{{ task.status }}</span></span>
          </div>
        </div>

        <!-- Expanded content -->
        <div 
          v-if="expandedTask === index"
          class="px-5 pb-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="rounded-lg p-3" style="background-color: #D9D9D9">
              <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Ejecutor</div>
              <div class="font-mono text-xs text-gray-600">{{ task.beneficiary }}</div>
            </div>
            <div class="rounded-lg p-3" style="background-color: #D9D9D9">
              <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Presupuesto Escrow</div>
              <div class="font-bold text-gray-700">{{ task.amount }} {{ task.unit }}</div>
            </div>
          </div>

          <div class="text-sm text-gray-600 leading-relaxed italic p-3 rounded-lg border border-blue-100/50" style="background-color: #D9D9D9">
            <i class="fas fa-info-circle mr-2 text-blue-400"></i>
            "{{ task.description }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const expandedTask = ref<number | null>(0)

const goToChat = (taskId: string) => {
  console.log('Redirecting to chat for task:', taskId)
  router.push('/chat')
}

const toggleTask = (index: number) => {
  if (expandedTask.value === index) {
    expandedTask.value = null
  } else {
    expandedTask.value = index
  }
}

const mockedTasks = ref([
  {
    id: "bug contrato inteligente",
    description: "Corrección de vulnerabilidad en el sistema de subastas asincrónicas.",
    beneficiary: "0x71C765...d897",
    amount: "400.00",
    unit: "USDC",
    status: "Pagada"
  },
  {
    id: "backend-api",
    description: "Desarrollo de microservicio para indexación de eventos on-chain.",
    beneficiary: "0x3A21...F901",
    amount: "0.85",
    unit: "ETH",
    status: "Pendiente"
  },
  {
    id: "despliegue mainnet",
    description: "Configuración de parámetros finales y despliegue del protocolo en red principal.",
    beneficiary: "0x4B21...E202",
    amount: "1.50",
    unit: "ETH",
    status: "Pendiente"
  },
  {
    id: "frontend refactor",
    description: "Migración de componentes base a la nueva interfaz v2 y optimización de carga.",
    beneficiary: "0x9C33...A112",
    amount: "1200.00",
    unit: "USDT",
    status: "Pendiente"
  },
  {
    id: "diseño ux v2",
    description: "Iteración final del prototipo de alta fidelidad para el dashboard de gestión.",
    beneficiary: "0xDesign...6677",
    amount: "500.00",
    unit: "USDC",
    status: "Pendiente"
  },
  {
    id: "infraestructura-cli",
    description: "Script de automatización para despliegues en redes de prueba.",
    beneficiary: "0x882A...77BC",
    amount: "250.00",
    unit: "USDT",
    status: "Cancelada"
  }
])
</script>

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
