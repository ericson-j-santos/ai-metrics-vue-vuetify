import { aiMetricsMock } from '../mocks/aiMetricsMock'

const MODO_TESTE = import.meta.env.MODE === 'test'
const USAR_MOCK = MODO_TESTE || String(import.meta.env.VITE_AI_METRICS_USE_MOCK ?? 'false').toLowerCase() === 'true'
const API_BASE_URL = String(import.meta.env.VITE_AI_METRICS_API_BASE_URL ?? '').trim().replace(/\/$/, '')

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function montarUrl(caminho) {
  return API_BASE_URL ? `${API_BASE_URL}${caminho}` : caminho
}

async function tratarResposta(resposta, mensagemPadrao) {
  if (resposta.ok) {
    return resposta.json()
  }

  let detalhe = mensagemPadrao

  try {
    const payload = await resposta.json()
    detalhe = payload?.detail?.message || payload?.detail || payload?.message || mensagemPadrao
  } catch {
    detalhe = mensagemPadrao
  }

  throw new Error(detalhe)
}

export async function buscarMetricasIA(janelaDias = 30) {
  if (USAR_MOCK) {
    await esperar(300)
    return { ...aiMetricsMock, janela_dias: janelaDias }
  }

  const resposta = await fetch(montarUrl(`/v1/dashboard/ia?janela_dias=${janelaDias}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return tratarResposta(resposta, 'Erro ao buscar métricas do dashboard.')
}

export async function listarIncidentes(limit = 20, status = null, search = '') {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (status) params.set('status', status)
  if (search?.trim()) params.set('search', search.trim())

  const resposta = await fetch(montarUrl(`/v1/incidentes?${params.toString()}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return tratarResposta(resposta, 'Erro ao listar incidentes.')
}

export async function buscarIncidente(idIncidente) {
  const resposta = await fetch(montarUrl(`/v1/incidentes/${idIncidente}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return tratarResposta(resposta, 'Erro ao buscar incidente.')
}

export async function listarRecomendacoes(limit = 20) {
  const resposta = await fetch(montarUrl(`/v1/recomendacoes?limit=${limit}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return tratarResposta(resposta, 'Erro ao listar recomendações.')
}

export async function buscarRecomendacao(idRecomendacao) {
  const resposta = await fetch(montarUrl(`/v1/recomendacoes/${idRecomendacao}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return tratarResposta(resposta, 'Erro ao buscar recomendação.')
}

export async function criarRecomendacao(payload) {
  const resposta = await fetch(montarUrl('/v1/recomendacoes'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return tratarResposta(resposta, 'Erro ao criar recomendação.')
}

export async function registrarDecisaoRecomendacao(idRecomendacao, payload) {
  const resposta = await fetch(montarUrl(`/v1/recomendacoes/${idRecomendacao}/decisao`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return tratarResposta(resposta, 'Erro ao registrar decisão da recomendação.')
}

export async function registrarOutcomeRecomendacao(idRecomendacao, payload) {
  const resposta = await fetch(montarUrl(`/v1/recomendacoes/${idRecomendacao}/outcome`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return tratarResposta(resposta, 'Erro ao registrar outcome da recomendação.')
}

export function obterConfiguracaoAiMetrics() {
  return { usarMock: USAR_MOCK, apiBaseUrl: API_BASE_URL }
}
