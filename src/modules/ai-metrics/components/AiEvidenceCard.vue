<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  recomendacao: { type: String, required: true },
  confianca: { type: Number, required: true },
  score: { type: Number, required: true },
  tipo: { type: String, default: 'sucesso' },
})

const cor = computed(() => {
  if (props.tipo === 'erro') return 'error'
  if (props.tipo === 'info') return 'info'
  return 'success'
})
</script>

<template>
  <v-card :color="cor" variant="tonal">
    <v-card-text>
      <div class="text-subtitle-2 font-weight-bold">{{ titulo }}</div>
      <div class="text-body-2 text-medium-emphasis mt-1">{{ recomendacao }}</div>

      <div class="d-flex ga-2 flex-wrap mt-3">
        <v-chip size="small" variant="flat">Confiança {{ confianca.toFixed(2) }}</v-chip>
        <v-chip size="small" variant="flat">Score {{ score.toFixed(2) }}</v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>
