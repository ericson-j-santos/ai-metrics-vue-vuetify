import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAiMetricsStore } from '../stores/aiMetricsStore'

export function useAiMetrics() {
  const store = useAiMetricsStore()
  const { carregando, erro, janelaDias, abaAtiva, dados } = storeToRefs(store)

  const metricas = computed(() => dados.value?.metricas ?? null)

  onMounted(async () => {
    if (!dados.value) {
      await store.carregarDados()
    }
  })

  return {
    carregando,
    erro,
    janelaDias,
    abaAtiva,
    dados,
    metricas,
    carregarDados: store.carregarDados,
    definirJanela: store.definirJanela,
    definirAba: store.definirAba,
  }
}
