<script setup>
import { computed } from 'vue'
import { paraPorcentagemNumerica } from '../../utils/aiMetricsFormatters'

const props = defineProps({
  bins: {
    type: Array,
    default: () => [],
  },
})

const series = computed(() => [
  {
    name: 'Observada',
    data: props.bins.map((item) => ({
      x: paraPorcentagemNumerica(item.confianca_media),
      y: paraPorcentagemNumerica(item.taxa_outcome_positivo),
    })),
  },
  {
    name: 'Perfeita',
    data: [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ],
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'scatter',
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  colors: ['#1D4ED8', '#94A3B8'],
  xaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    title: { text: 'Confiança reportada (%)' },
    labels: { formatter: (value) => `${value.toFixed(0)}%` },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    title: { text: 'Taxa real (%)' },
    labels: { formatter: (value) => `${value.toFixed(0)}%` },
  },
  tooltip: {
    custom({ series, seriesIndex, dataPointIndex, w }) {
      const ponto = w.config.series[seriesIndex].data[dataPointIndex]
      return `<div style="padding:8px 12px; font-size:12px;">Confiança: ${ponto.x.toFixed(1)}%<br/>Taxa real: ${ponto.y.toFixed(1)}%</div>`
    },
  },
  markers: {
    size: [6, 0],
  },
  stroke: {
    width: [0, 2],
    dashArray: [0, 4],
  },
  legend: {
    position: 'top',
  },
}))
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">Calibração da confiança</v-card-title>
    <v-card-text>
      <apexchart type="scatter" height="360" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>
