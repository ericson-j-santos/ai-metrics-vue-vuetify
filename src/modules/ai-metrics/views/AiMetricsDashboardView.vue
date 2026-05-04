<script setup>
import { computed } from 'vue'
import { useAiMetrics } from '../composables/useAiMetrics'
import AiMetricsHeader from '../components/AiMetricsHeader.vue'
import AiMetricsTabs from '../components/AiMetricsTabs.vue'
import AiStatCard from '../components/AiStatCard.vue'
import AiEvidenceCard from '../components/AiEvidenceCard.vue'
import AiPerformanceTable from '../components/AiPerformanceTable.vue'
import AiTypeBarChart from '../components/charts/AiTypeBarChart.vue'
import AiTrendChart from '../components/charts/AiTrendChart.vue'
import AiCalibrationScatterChart from '../components/charts/AiCalibrationScatterChart.vue'
import {
  formatarPercentual,
  formatarDecimal,
  obterStatusMetrica,
} from '../utils/aiMetricsFormatters'

const { carregando, erro, janelaDias, abaAtiva, dados, metricas, definirJanela, definirAba } = useAiMetrics()

const cardsOverview = computed(() => {
  if (!metricas.value) return []

  return [
    {
      titulo: 'Taxa de Aceitação',
      valor: formatarPercentual(metricas.value.taxa_aceitacao.valor.taxa),
      subtitulo: `${metricas.value.taxa_aceitacao.valor.aceitas}/${metricas.value.taxa_aceitacao.valor.total}`,
      status: obterStatusMetrica(metricas.value.taxa_aceitacao.valor.taxa),
      tendencia: metricas.value.taxa_aceitacao.tendencia,
    },
    {
      titulo: 'Eficácia Pós-Correção',
      valor: formatarPercentual(metricas.value.eficacia_pos_correcao.valor.taxa),
      subtitulo: `${metricas.value.eficacia_pos_correcao.valor.sucessos}/${metricas.value.eficacia_pos_correcao.valor.avaliadas}`,
      status: obterStatusMetrica(metricas.value.eficacia_pos_correcao.valor.taxa),
      tendencia: metricas.value.eficacia_pos_correcao.tendencia,
    },
    {
      titulo: 'Brier Score',
      valor: formatarDecimal(metricas.value.calibracao.valor.brier_score),
      subtitulo: `ECE ${formatarDecimal(metricas.value.calibracao.valor.ece)}`,
      status: 'sucesso',
      tendencia: -5.2,
    },
    {
      titulo: 'Amostras',
      valor: String(dados.value?.amostras_total ?? 0),
      subtitulo: `últimos ${janelaDias.value} dias`,
      status: 'neutro',
      tendencia: 12.4,
    },
  ]
})

const linhasPorTipo = computed(() => metricas.value?.por_tipo?.valor ?? [])
const linhasTendencia = computed(() => metricas.value?.tendencia_30d?.valor ?? [])
const binsCalibracao = computed(() => metricas.value?.calibracao?.valor?.bins ?? [])
const evidencias = computed(() => metricas.value?.evidencias?.valor ?? null)
</script>

<template>
  <v-container fluid class="py-6">
    <AiMetricsHeader :janela-dias="janelaDias" @alterar-janela="definirJanela" />

    <v-card rounded="lg">
      <AiMetricsTabs :aba-ativa="abaAtiva" @alterar-aba="definirAba" />
    </v-card>

    <div class="mt-4">
      <v-alert v-if="erro" type="error" variant="tonal" class="mb-4" icon="mdi-alert-circle-outline">
        {{ erro }}
      </v-alert>

      <template v-if="carregando">
        <v-row>
          <v-col v-for="item in 4" :key="item" cols="12" sm="6" lg="3">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-skeleton-loader type="article" class="mt-4" />
      </template>

      <template v-else-if="dados">
        <template v-if="abaAtiva === 'overview'">
          <v-alert type="info" variant="tonal" class="mb-4" icon="mdi-information-outline">
            <strong>Síntese:</strong> {{ dados.interpretacao_geral }}
          </v-alert>

          <v-row>
            <v-col v-for="card in cardsOverview" :key="card.titulo" cols="12" sm="6" lg="3">
              <AiStatCard
                :titulo="card.titulo"
                :valor="card.valor"
                :subtitulo="card.subtitulo"
                :status="card.status"
                :tendencia="card.tendencia"
              />
            </v-col>
          </v-row>

          <v-row class="mt-1">
            <v-col cols="12">
              <v-card>
                <v-card-title class="text-h6">Desempenho por tipo</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="linha in linhasPorTipo"
                      :key="linha.tipo"
                      cols="12"
                      md="6"
                    >
                      <v-card variant="outlined">
                        <v-card-text>
                          <div class="d-flex justify-space-between align-center mb-3">
                            <div>
                              <div class="text-subtitle-1 font-weight-bold">{{ linha.tipo }}</div>
                              <div class="text-caption text-medium-emphasis">{{ linha.amostras }} amostras</div>
                            </div>
                          </div>

                          <div class="mb-3">
                            <div class="text-caption mb-1">Aceitação</div>
                            <v-progress-linear
                              :model-value="linha.taxa_aceitacao * 100"
                              color="primary"
                              rounded
                              height="10"
                            />
                            <div class="text-caption mt-1">{{ formatarPercentual(linha.taxa_aceitacao) }}</div>
                          </div>

                          <div>
                            <div class="text-caption mb-1">Eficácia</div>
                            <v-progress-linear
                              :model-value="(linha.taxa_eficacia ?? 0) * 100"
                              color="success"
                              rounded
                              height="10"
                            />
                            <div class="text-caption mt-1">
                              {{ linha.taxa_eficacia === null ? '—' : formatarPercentual(linha.taxa_eficacia) }}
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="abaAtiva === 'calibration'">
          <v-row>
            <v-col cols="12" lg="8">
              <AiCalibrationScatterChart :bins="binsCalibracao" />
            </v-col>
            <v-col cols="12" lg="4">
              <v-card height="100%">
                <v-card-title class="text-h6">Leitura executiva</v-card-title>
                <v-card-text>
                  <v-chip color="success" variant="flat" class="mb-3">Boa calibração</v-chip>
                  <p class="text-body-2 mb-2">
                    Confiança reportada próxima da taxa real observada.
                  </p>
                  <p class="text-body-2"><strong>ECE:</strong> {{ formatarDecimal(metricas.calibracao.valor.ece) }}</p>
                  <p class="text-body-2"><strong>Brier:</strong> {{ formatarDecimal(metricas.calibracao.valor.brier_score) }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="abaAtiva === 'types'">
          <v-row>
            <v-col cols="12" lg="6">
              <AiTypeBarChart :linhas="linhasPorTipo" campo="taxa_aceitacao" titulo="Aceitação por tipo" cor="#1D4ED8" />
            </v-col>
            <v-col cols="12" lg="6">
              <AiTypeBarChart :linhas="linhasPorTipo.filter((item) => item.taxa_eficacia !== null)" campo="taxa_eficacia" titulo="Eficácia por tipo" cor="#059669" />
            </v-col>
            <v-col cols="12">
              <AiPerformanceTable :linhas="linhasPorTipo" />
            </v-col>
          </v-row>
        </template>

        <template v-else-if="abaAtiva === 'trend'">
          <v-row>
            <v-col cols="12">
              <AiTrendChart :linhas="linhasTendencia" />
            </v-col>
            <v-col cols="12">
              <v-alert type="info" variant="tonal" icon="mdi-trending-up">
                <strong>Análise:</strong> Aceitação saiu de 55% para 68% ao longo da janela analisada.
              </v-alert>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="abaAtiva === 'evidence' && evidencias">
          <v-row>
            <v-col cols="12" lg="6">
              <v-card>
                <v-card-title class="text-h6">Acertos • Alta confiança</v-card-title>
                <v-card-text class="d-flex flex-column ga-3">
                  <AiEvidenceCard
                    v-for="item in evidencias.acertos_alta_confianca"
                    :key="`${item.titulo}-${item.confianca}`"
                    :titulo="item.titulo"
                    :recomendacao="item.recomendacao"
                    :confianca="item.confianca"
                    :score="item.score"
                    tipo="sucesso"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" lg="6">
              <v-card>
                <v-card-title class="text-h6">Erros • Alta confiança</v-card-title>
                <v-card-text class="d-flex flex-column ga-3">
                  <AiEvidenceCard
                    v-for="item in evidencias.erros_alta_confianca"
                    :key="`${item.titulo}-${item.confianca}`"
                    :titulo="item.titulo"
                    :recomendacao="item.recomendacao"
                    :confianca="item.confianca"
                    :score="item.score"
                    tipo="erro"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card>
                <v-card-title class="text-h6">Acertos • Baixa confiança</v-card-title>
                <v-card-text class="d-flex flex-column ga-3">
                  <AiEvidenceCard
                    v-for="item in evidencias.acertos_baixa_confianca"
                    :key="`${item.titulo}-${item.confianca}`"
                    :titulo="item.titulo"
                    :recomendacao="item.recomendacao"
                    :confianca="item.confianca"
                    :score="item.score"
                    tipo="info"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </template>
    </div>
  </v-container>
</template>
