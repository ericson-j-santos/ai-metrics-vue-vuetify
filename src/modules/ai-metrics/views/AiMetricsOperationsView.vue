<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  buscarIncidente,
  buscarRecomendacao,
  criarRecomendacao,
  listarIncidentes,
  listarRecomendacoes,
  registrarDecisaoRecomendacao,
  registrarOutcomeRecomendacao,
} from '../api/aiMetricsService'

const carregandoLista = ref(false)
const carregandoDetalhe = ref(false)
const carregandoIncidentes = ref(false)
const enviandoCriacao = ref(false)
const enviandoDecisao = ref(false)
const enviandoOutcome = ref(false)
const erro = ref('')
const snackbar = reactive({ aberto: false, texto: '', cor: 'success' })
const recomendacoes = ref([])
const recomendacaoSelecionada = ref(null)
const incidentes = ref([])
const incidenteSelecionadoId = ref(null)
const incidenteSelecionado = ref(null)
const buscaIncidente = ref('')

const tiposRecomendacao = [
  { title: 'Hotfix', value: 'hotfix' },
  { title: 'Próx. versão', value: 'proxima_versao' },
  { title: 'Backlog', value: 'backlog' },
  { title: 'Monitorar', value: 'monitorar' },
]

const opcoesBooleanas = [
  { title: 'Sim', value: true },
  { title: 'Não', value: false },
]

const opcoesBooleanasNullable = [
  { title: 'Sim', value: true },
  { title: 'Não', value: false },
  { title: 'Não avaliado', value: null },
]

const formularioCriacao = reactive({
  id_incidente: null,
  titulo: '',
  contexto_incidente: '',
  tipo_recomendacao: 'hotfix',
  confianca_ia: 0.8,
  recomendacao: '',
  modelo: 'gemini-2.5-flash',
  score_inicial: 0.5,
})

const formularioDecisao = reactive({
  id_recomendacao: null,
  aceita: true,
  motivo_decisao: '',
  decidido_por: '',
})

const formularioOutcome = reactive({
  id_recomendacao: null,
  foi_aplicada: true,
  versao_aplicada: '',
  outcome_positivo: true,
  score_pos_correcao: 0.8,
  observacao: '',
})

const possuiSelecao = computed(() => Boolean(recomendacaoSelecionada.value))

const incidentesOptions = computed(() =>
  incidentes.value.map((item) => ({
    title: `#${item.id} • ${item.titulo}`,
    value: item.id,
    subtitle: `${item.modulo} • ${item.funcionalidade} • ${item.severidade}`,
  })),
)

function abrirMensagem(texto, cor = 'success') {
  snackbar.texto = texto
  snackbar.cor = cor
  snackbar.aberto = true
}

function preencherIds(idRecomendacao) {
  formularioDecisao.id_recomendacao = idRecomendacao
  formularioOutcome.id_recomendacao = idRecomendacao
}

function aplicarIncidenteNoFormulario(incidente) {
  if (!incidente) return
  formularioCriacao.id_incidente = incidente.id
  formularioCriacao.titulo = incidente.titulo
  formularioCriacao.contexto_incidente = incidente.resumo_contexto || ''
  formularioCriacao.score_inicial = incidente.score_atual ?? formularioCriacao.score_inicial
}

async function carregarIncidentes() {
  try {
    carregandoIncidentes.value = true
    incidentes.value = await listarIncidentes(20, null, buscaIncidente.value)
  } catch (err) {
    erro.value = err?.message || 'Erro ao carregar incidentes.'
  } finally {
    carregandoIncidentes.value = false
  }
}

async function selecionarIncidente(idIncidente) {
  if (!idIncidente) {
    incidenteSelecionado.value = null
    return
  }

  try {
    carregandoIncidentes.value = true
    const detalhe = await buscarIncidente(idIncidente)
    incidenteSelecionado.value = detalhe
    aplicarIncidenteNoFormulario(detalhe)
  } catch (err) {
    erro.value = err?.message || 'Erro ao buscar incidente.'
  } finally {
    carregandoIncidentes.value = false
  }
}

async function carregarLista() {
  try {
    carregandoLista.value = true
    erro.value = ''
    recomendacoes.value = await listarRecomendacoes(20)
  } catch (err) {
    erro.value = err?.message || 'Erro ao carregar lista de recomendações.'
  } finally {
    carregandoLista.value = false
  }
}

async function selecionarRecomendacao(idRecomendacao) {
  try {
    carregandoDetalhe.value = true
    erro.value = ''
    const detalhe = await buscarRecomendacao(idRecomendacao)
    recomendacaoSelecionada.value = detalhe
    preencherIds(detalhe.id)
  } catch (err) {
    erro.value = err?.message || 'Erro ao buscar recomendação.'
  } finally {
    carregandoDetalhe.value = false
  }
}

async function enviarCriacao() {
  try {
    if (!formularioCriacao.id_incidente) {
      throw new Error('Selecione um incidente para criar a recomendação.')
    }

    enviandoCriacao.value = true
    erro.value = ''
    const criada = await criarRecomendacao({ ...formularioCriacao })
    abrirMensagem(`Recomendação ${criada.id} criada com sucesso.`)
    await carregarLista()
    await selecionarRecomendacao(criada.id)
  } catch (err) {
    erro.value = err?.message || 'Erro ao criar recomendação.'
    abrirMensagem(erro.value, 'error')
  } finally {
    enviandoCriacao.value = false
  }
}

async function enviarDecisao() {
  try {
    if (!formularioDecisao.id_recomendacao) {
      throw new Error('Informe o ID da recomendação para registrar a decisão.')
    }

    enviandoDecisao.value = true
    erro.value = ''
    await registrarDecisaoRecomendacao(formularioDecisao.id_recomendacao, {
      aceita: formularioDecisao.aceita,
      motivo_decisao: formularioDecisao.motivo_decisao || null,
      decidido_por: formularioDecisao.decidido_por || null,
    })
    abrirMensagem('Decisão registrada com sucesso.')
    await carregarLista()
    await selecionarRecomendacao(formularioDecisao.id_recomendacao)
  } catch (err) {
    erro.value = err?.message || 'Erro ao registrar decisão.'
    abrirMensagem(erro.value, 'error')
  } finally {
    enviandoDecisao.value = false
  }
}

async function enviarOutcome() {
  try {
    if (!formularioOutcome.id_recomendacao) {
      throw new Error('Informe o ID da recomendação para registrar o outcome.')
    }

    enviandoOutcome.value = true
    erro.value = ''
    await registrarOutcomeRecomendacao(formularioOutcome.id_recomendacao, {
      foi_aplicada: formularioOutcome.foi_aplicada,
      versao_aplicada: formularioOutcome.versao_aplicada || null,
      outcome_positivo: formularioOutcome.outcome_positivo,
      score_pos_correcao: formularioOutcome.score_pos_correcao ?? null,
      observacao: formularioOutcome.observacao || null,
    })
    abrirMensagem('Outcome registrado com sucesso.')
    await carregarLista()
    await selecionarRecomendacao(formularioOutcome.id_recomendacao)
  } catch (err) {
    erro.value = err?.message || 'Erro ao registrar outcome.'
    abrirMensagem(erro.value, 'error')
  } finally {
    enviandoOutcome.value = false
  }
}

watch(buscaIncidente, async () => {
  await carregarIncidentes()
})

onMounted(async () => {
  await carregarIncidentes()
  if (incidentes.value.length > 0) {
    incidenteSelecionadoId.value = incidentes.value[0].id
    await selecionarIncidente(incidenteSelecionadoId.value)
  }
  await carregarLista()
  if (recomendacoes.value.length > 0) {
    await selecionarRecomendacao(recomendacoes.value[0].id)
  }
})
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="mb-4">
          <v-card-title class="text-h5">Operações de recomendações</v-card-title>
          <v-card-subtitle>
            Selecione um incidente real, preencha automaticamente o contexto e siga o fluxo de recomendação.
          </v-card-subtitle>
          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-0" icon="mdi-information-outline">
              Fluxo recomendado: <strong>seleção do incidente → criação → decisão → outcome</strong>.
            </v-alert>
          </v-card-text>
        </v-card>

        <v-alert v-if="erro" type="error" variant="tonal" class="mb-4">{{ erro }}</v-alert>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title class="text-h6">0. Selecionar incidente</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="buscaIncidente" label="Buscar incidente" prepend-inner-icon="mdi-magnify" />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-autocomplete
                      v-model="incidenteSelecionadoId"
                      :items="incidentesOptions"
                      :loading="carregandoIncidentes"
                      label="Incidente"
                      item-title="title"
                      item-value="value"
                      clearable
                      @update:model-value="selecionarIncidente"
                    />
                  </v-col>
                </v-row>

                <v-card v-if="incidenteSelecionado" variant="tonal" color="info">
                  <v-card-text>
                    <div class="text-subtitle-1 font-weight-bold">{{ incidenteSelecionado.titulo }}</div>
                    <div class="text-body-2 mt-1">{{ incidenteSelecionado.resumo_contexto }}</div>
                    <div class="d-flex ga-2 flex-wrap mt-3">
                      <v-chip size="small">Módulo {{ incidenteSelecionado.modulo }}</v-chip>
                      <v-chip size="small">Funcionalidade {{ incidenteSelecionado.funcionalidade }}</v-chip>
                      <v-chip size="small" color="warning" variant="flat">Severidade {{ incidenteSelecionado.severidade }}</v-chip>
                      <v-chip size="small" color="primary" variant="flat">Score {{ incidenteSelecionado.score_atual ?? '—' }}</v-chip>
                      <v-chip size="small">Status {{ incidenteSelecionado.status }}</v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-h6">1. Criar recomendação</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model.number="formularioCriacao.id_incidente" type="number" label="ID do incidente" readonly />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select v-model="formularioCriacao.tipo_recomendacao" :items="tiposRecomendacao" label="Tipo da recomendação" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model.number="formularioCriacao.confianca_ia" type="number" step="0.01" min="0" max="1" label="Confiança da IA" />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field v-model="formularioCriacao.titulo" label="Título" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="formularioCriacao.modelo" label="Modelo" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formularioCriacao.contexto_incidente" label="Contexto do incidente" rows="3" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formularioCriacao.recomendacao" label="Texto da recomendação" rows="3" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model.number="formularioCriacao.score_inicial" type="number" step="0.01" min="0" max="1" label="Score inicial" />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end">
                  <v-btn color="primary" :loading="enviandoCriacao" @click="enviarCriacao">Criar recomendação</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-h6">2. Registrar decisão</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model.number="formularioDecisao.id_recomendacao" type="number" label="ID da recomendação" />
                  </v-col>
                  <v-col cols="12">
                    <v-select v-model="formularioDecisao.aceita" :items="opcoesBooleanas" label="Aceita?" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formularioDecisao.decidido_por" label="Decidido por" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formularioDecisao.motivo_decisao" label="Motivo da decisão" rows="3" />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end">
                  <v-btn color="secondary" :loading="enviandoDecisao" @click="enviarDecisao">Registrar decisão</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-h6">3. Registrar outcome</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model.number="formularioOutcome.id_recomendacao" type="number" label="ID da recomendação" />
                  </v-col>
                  <v-col cols="12">
                    <v-select v-model="formularioOutcome.foi_aplicada" :items="opcoesBooleanas" label="Foi aplicada?" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formularioOutcome.versao_aplicada" label="Versão aplicada" />
                  </v-col>
                  <v-col cols="12">
                    <v-select v-model="formularioOutcome.outcome_positivo" :items="opcoesBooleanasNullable" label="Outcome positivo?" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model.number="formularioOutcome.score_pos_correcao" type="number" step="0.01" min="0" max="1" label="Score pós-correção" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formularioOutcome.observacao" label="Observação" rows="3" />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end">
                  <v-btn color="success" :loading="enviandoOutcome" @click="enviarOutcome">Registrar outcome</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="mb-4">
          <v-card-title class="text-h6">Recomendações recentes</v-card-title>
          <v-card-text>
            <v-progress-linear v-if="carregandoLista" indeterminate class="mb-3" />
            <v-list density="compact">
              <v-list-item
                v-for="item in recomendacoes"
                :key="item.id"
                :title="`#${item.id} • ${item.titulo}`"
                :subtitle="`${item.tipo_recomendacao} • incidente ${item.id_incidente}`"
                @click="selecionarRecomendacao(item.id)"
              >
                <template #append>
                  <v-chip size="small" color="primary" variant="tonal">{{ item.confianca_ia.toFixed(2) }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title class="text-h6">Detalhe da recomendação</v-card-title>
          <v-card-text>
            <template v-if="carregandoDetalhe">
              <v-skeleton-loader type="article" />
            </template>
            <template v-else-if="possuiSelecao">
              <div class="text-subtitle-1 font-weight-bold">{{ recomendacaoSelecionada.titulo }}</div>
              <div class="text-caption text-medium-emphasis mb-3">ID {{ recomendacaoSelecionada.id }} • incidente {{ recomendacaoSelecionada.id_incidente }}</div>
              <div class="text-body-2 mb-3">{{ recomendacaoSelecionada.recomendacao }}</div>
              <v-alert v-if="recomendacaoSelecionada.contexto_incidente" type="info" variant="tonal" class="mb-3">
                <strong>Contexto:</strong> {{ recomendacaoSelecionada.contexto_incidente }}
              </v-alert>
              <div class="d-flex ga-2 flex-wrap mb-3">
                <v-chip size="small">Tipo {{ recomendacaoSelecionada.tipo_recomendacao }}</v-chip>
                <v-chip size="small">Confiança {{ recomendacaoSelecionada.confianca_ia.toFixed(2) }}</v-chip>
                <v-chip size="small">Score {{ recomendacaoSelecionada.score_inicial ?? '—' }}</v-chip>
              </div>

              <v-divider class="my-3" />

              <div class="text-subtitle-2 mb-2">Decisão</div>
              <div v-if="recomendacaoSelecionada.decisao" class="text-body-2 mb-4">
                {{ recomendacaoSelecionada.decisao.aceita ? 'Aceita' : 'Rejeitada' }}
                <span v-if="recomendacaoSelecionada.decisao.decidido_por"> • {{ recomendacaoSelecionada.decisao.decidido_por }}</span>
              </div>
              <div v-else class="text-body-2 text-medium-emphasis mb-4">Sem decisão registrada.</div>

              <div class="text-subtitle-2 mb-2">Outcome</div>
              <div v-if="recomendacaoSelecionada.outcome" class="text-body-2">
                {{ recomendacaoSelecionada.outcome.foi_aplicada ? 'Aplicada' : 'Não aplicada' }}
                <span v-if="recomendacaoSelecionada.outcome.versao_aplicada"> • versão {{ recomendacaoSelecionada.outcome.versao_aplicada }}</span>
                <div class="mt-1">Resultado: {{ recomendacaoSelecionada.outcome.outcome_positivo === null ? 'Não avaliado' : recomendacaoSelecionada.outcome.outcome_positivo ? 'Positivo' : 'Negativo' }}</div>
              </div>
              <div v-else class="text-body-2 text-medium-emphasis">Sem outcome registrado.</div>
            </template>
            <template v-else>
              <div class="text-body-2 text-medium-emphasis">Selecione uma recomendação para ver o detalhe.</div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.aberto" :color="snackbar.cor">
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>
