<script setup>
import { abasDashboard } from '../types/aiMetrics.types'

defineProps({
  abaAtiva: { type: String, required: true },
})

const emit = defineEmits(['alterar-aba'])
</script>

<template>
  <v-tabs
    :model-value="abaAtiva"
    color="primary"
    align-tabs="start"
    @update:model-value="emit('alterar-aba', $event)"
  >
    <v-tab v-for="aba in abasDashboard" :key="aba.id" :value="aba.id">
      {{ aba.titulo }}
    </v-tab>
  </v-tabs>
</template>
