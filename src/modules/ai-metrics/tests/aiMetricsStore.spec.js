import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAiMetricsStore } from '../stores/aiMetricsStore'

describe('aiMetricsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve iniciar com estado padrão', () => {
    const store = useAiMetricsStore()

    expect(store.carregando).toBe(false)
    expect(store.erro).toBe(null)
    expect(store.janelaDias).toBe(30)
    expect(store.abaAtiva).toBe('overview')
    expect(store.dados).toBe(null)
  })

  it('deve alterar aba ativa', () => {
    const store = useAiMetricsStore()
    store.definirAba('trend')
    expect(store.abaAtiva).toBe('trend')
  })

  it('deve carregar dados mockados', async () => {
    const store = useAiMetricsStore()
    await store.carregarDados()

    expect(store.dados).not.toBe(null)
    expect(store.dados.amostras_total).toBe(47)
  })
})
