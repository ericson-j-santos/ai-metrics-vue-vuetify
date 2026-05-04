<script setup>
import { formatarPercentual } from '../utils/aiMetricsFormatters'

defineProps({
  linhas: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <v-card>
    <v-card-title class="text-h6">Tabela detalhada</v-card-title>
    <v-card-text>
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Tipo</th>
            <th class="text-right">Aceitação</th>
            <th class="text-right">Eficácia</th>
            <th class="text-right">Amostras</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="linha in linhas" :key="linha.tipo">
            <td>{{ linha.tipo }}</td>
            <td class="text-right">{{ formatarPercentual(linha.taxa_aceitacao) }}</td>
            <td class="text-right">
              {{ linha.taxa_eficacia === null ? '—' : formatarPercentual(linha.taxa_eficacia) }}
            </td>
            <td class="text-right">{{ linha.amostras }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
