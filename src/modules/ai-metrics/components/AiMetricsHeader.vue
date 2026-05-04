<script setup>
const props = defineProps({
  janelaDias: { type: Number, required: true },
})

const emit = defineEmits(['alterar-janela'])
const opcoes = [7, 30, 90, 180]
</script>

<template>
  <v-card class="mb-4" rounded="lg">
    <v-card-text class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4">
      <div>
        <div class="text-h4 font-weight-bold">MVP Intelligence</div>
        <div class="text-body-2 text-medium-emphasis">Painel consolidado de acurácia da IA</div>
      </div>

      <div class="d-flex ga-2 flex-wrap">
        <v-btn
          v-for="item in opcoes"
          :key="item"
          :variant="janelaDias === item ? 'flat' : 'tonal'"
          :color="janelaDias === item ? 'primary' : 'secondary'"
          @click="emit('alterar-janela', item)"
        >
          {{ item }}d
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
