import { defineStore } from 'pinia'
import { buscarMetricasIA } from '../api/aiMetricsService'

export const useAiMetricsStore = defineStore('aiMetrics', {
  state: () => ({
    carregando: false,
    erro: null,
    janelaDias: 30,
    abaAtiva: 'overview',
    dados: null,
  }),

  getters: {
    possuiDados: (state) => Boolean(state.dados),
  },

  actions: {
    async carregarDados() {
      try {
        this.carregando = true
        this.erro = null
        console.info('[aiMetricsStore] carregando dados', { janelaDias: this.janelaDias })

        const resultado = await buscarMetricasIA(this.janelaDias)
        this.dados = resultado
      } catch (erro) {
        this.erro = erro?.message || 'Falha ao carregar dados.'
        console.error('[aiMetricsStore] erro ao carregar dados', { erro: this.erro })
      } finally {
        this.carregando = false
      }
    },

    async definirJanela(janelaDias) {
      this.janelaDias = janelaDias
      await this.carregarDados()
    },

    definirAba(aba) {
      this.abaAtiva = aba
    },
  },
})
