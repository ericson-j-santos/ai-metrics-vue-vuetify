<script setup>
import { computed } from 'vue'
import { paraPorcentagemNumerica } from '../../utils/aiMetricsFormatters'

const props = defineProps({
  linhas: {
    type: Array,
    default: () => [],
  },
})

const series = computed(() => [
  {
    name: 'Aceitação',
    type: 'area',
    data: props.linhas.map((item) => paraPorcentagemNumerica(item.taxa_aceitacao)),
  },
  {
    name: 'Eficácia',
    type: 'line',
    data: props.linhas.map((item) => paraPorcentagemNumerica(item.taxa_eficacia)),
  },
])

const chartOptions = computed(() => ({
  chart: {
    height: 360,
    type: 'line',
    toolbar: { show: false },
  },
  stroke: {
    width: [2, 3],
    curve: 'smooth',
  },
  fill: {
    opacity: [0.2, 1],
  },
  colors: ['#1D4ED8', '#059669'],
  labels: props.linhas.map((item) => item.data_fim),
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      formatter: (value) => `${value.toFixed(0)}%`,
    },
  },
  tooltip: {
    shared: true,
    y: {
      formatter: (value) => `${value.toFixed(1)}%`,
    },
  },
}))
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">Tendência 30 dias</v-card-title>
    <v-card-text>
      <apexchart height="360" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>
