<script setup>
import { computed } from 'vue'
import { paraPorcentagemNumerica } from '../../utils/aiMetricsFormatters'

const props = defineProps({
  linhas: {
    type: Array,
    default: () => [],
  },
  campo: {
    type: String,
    default: 'taxa_aceitacao',
  },
  titulo: {
    type: String,
    default: 'Gráfico por tipo',
  },
  cor: {
    type: String,
    default: '#1D4ED8',
  },
})

const series = computed(() => [
  {
    name: props.titulo,
    data: props.linhas.map((item) => paraPorcentagemNumerica(item[props.campo] ?? 0)),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  colors: [props.cor],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: props.linhas.map((item) => item.tipo),
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      formatter: (value) => `${value.toFixed(0)}%`,
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `${value.toFixed(1)}%`,
    },
  },
  legend: {
    show: false,
  },
}))
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">{{ titulo }}</v-card-title>
    <v-card-text>
      <apexchart type="bar" height="320" :options="chartOptions" :series="series" />
    </v-card-text>
  </v-card>
</template>
