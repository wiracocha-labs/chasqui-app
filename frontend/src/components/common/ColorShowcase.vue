<template>
  <div class="min-h-screen bg-bg-primary p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-brand mb-2">Chasqui Color Palette</h1>
        <h2 class="text-xl text-text-secondary">Sistema de colores implementado</h2>
      </div>

      <!-- Color Palette Display -->
      <Card class="p-8">
        <h3 class="text-2xl text-brand mb-6">Paleta de Colores</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          
          <!-- Background Colors -->
          <div class="space-y-2">
            <h4 class="text-brand font-semibold">Fondos</h4>
            <div class="bg-bg-primary p-4 rounded border border-bg-secondary">
              <p class="text-text-primary text-sm">Primary BG</p>
              <p class="text-text-secondary text-xs">#2E1E1A</p>
            </div>
            <div class="bg-bg-secondary p-4 rounded">
              <p class="text-text-primary text-sm">Secondary BG</p>
              <p class="text-text-secondary text-xs">#5C5C5C</p>
            </div>
          </div>

          <!-- Text Colors -->
          <div class="space-y-2">
            <h4 class="text-brand font-semibold">Textos</h4>
            <div class="bg-bg-secondary p-4 rounded">
              <p class="text-text-primary text-sm">Primary Text</p>
              <p class="text-text-secondary text-xs">#F5F5F5</p>
            </div>
            <div class="bg-bg-secondary p-4 rounded">
              <p class="text-text-secondary text-sm">Secondary Text</p>
              <p class="text-text-secondary text-xs">#D9D9D9</p>
            </div>
          </div>

          <!-- Brand Colors -->
          <div class="space-y-2">
            <h4 class="text-brand font-semibold">Brand</h4>
            <div class="bg-brand p-4 rounded">
              <p class="text-bg-primary text-sm font-semibold">Brand</p>
              <p class="text-bg-primary text-xs">#D4AF37</p>
            </div>
            <div class="bg-action p-4 rounded">
              <p class="text-text-primary text-sm">Action</p>
              <p class="text-text-primary text-xs">#A9442B</p>
            </div>
            <div class="bg-accent p-4 rounded">
              <p class="text-text-primary text-sm">Accent</p>
              <p class="text-text-primary text-xs">#F27D42</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Buttons Showcase -->
      <Card class="p-8">
        <h3 class="text-2xl text-brand mb-6">Botones</h3>
        <div class="flex flex-wrap gap-4">
          <Button variant="primary">Button Primary</Button>
          <Button variant="secondary">Button Secondary</Button>
          <Button variant="accent">Button Accent</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="secondary" size="lg">Large</Button>
          <Button variant="primary" :disabled="true">Disabled</Button>
        </div>
      </Card>

      <!-- Form Elements -->
      <Card class="p-8">
        <h3 class="text-2xl text-brand mb-6">Elementos de Formulario</h3>
        <div class="space-y-4 max-w-md">
          <Input 
            label="Email" 
            type="email" 
            placeholder="tu@email.com"
            v-model="emailValue"
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••"
            v-model="passwordValue"
          />
          <Input 
            label="Campo con error" 
            type="text" 
            placeholder="Valor incorrecto"
            error="Este campo tiene un error"
            v-model="errorValue"
          />
        </div>
      </Card>

      <!-- Typography -->
      <Card class="p-8">
        <h3 class="text-2xl text-brand mb-6">Tipografía</h3>
        <div class="space-y-4">
          <h1 class="text-4xl text-brand">Heading 1</h1>
          <h2 class="text-3xl text-brand">Heading 2</h2>
          <h3 class="text-2xl text-brand">Heading 3</h3>
          <p class="text-text-primary">Texto principal con color primario.</p>
          <p class="text-text-secondary">Texto secundario con menor prominencia.</p>
          <a href="#" class="text-accent hover:text-brand transition-colors">
            Este es un enlace que cambia de accent a brand al hacer hover
          </a>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'
import Input from '../ui/Input.vue'

const emailValue = ref('')
const passwordValue = ref('')
const errorValue = ref('')
</script>
