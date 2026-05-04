import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../../views/HomeView.vue'
import NotFoundView from '../../views/NotFoundView.vue'
import AiMetricsDashboardView from '../../modules/ai-metrics/views/AiMetricsDashboardView.vue'
import AiMetricsOperationsView from '../../modules/ai-metrics/views/AiMetricsOperationsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      titulo: 'Início',
      descricao: 'Painel inicial e lista de rotas',
    },
  },
  {
    path: '/ai-metrics',
    name: 'ai-metrics',
    component: AiMetricsDashboardView,
    meta: {
      titulo: 'AI Metrics Dashboard',
      descricao: 'Painel consolidado de acurácia da IA',
    },
  },
  {
    path: '/ai-metrics/operacoes',
    name: 'ai-metrics-operations',
    component: AiMetricsOperationsView,
    meta: {
      titulo: 'Operações de Recomendações',
      descricao: 'Criação, decisão e outcome das recomendações de IA',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      titulo: 'Página não encontrada',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
