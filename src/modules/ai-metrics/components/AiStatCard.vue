<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  valor: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  status: { type: String, default: 'neutro' },
  tendencia: { type: Number, default: 0 },
})

const corStatus = computed(() => {
  if (props.status === 'sucesso') return 'success'
  if (props.status === 'alerta') return 'warning'
  if (props.status === 'erro') return 'error'
  return 'secondary'
})

const tendenciaPositiva = computed(() => props.tendencia >= 0)
</script>

<template>
  <v-card variant="tonal" :color="corStatus" data-testid="ai-stat-card">
    <v-card-text>
      <div class="d-flex justify-space-between align-start ga-2">
        <div>
          <div class="text-caption text-medium-emphasis">{{ titulo }}</div>
          <div class="text-h4 font-weight-bold mt-2">{{ valor }}</div>
          <div v-if="subtitulo" class="text-caption mt-1">{{ subtitulo }}</div>
        </div>

        <v-chip size="small" :color="tendenciaPositiva ? 'success' : 'error'" variant="flat">
          {{ tendenciaPositiva ? '+' : '' }}{{ tendencia.toFixed(1) }}%
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>
