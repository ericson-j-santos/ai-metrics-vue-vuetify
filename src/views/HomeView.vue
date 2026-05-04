<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const rotas = computed(() => {
  return router
    .getRoutes()
    .filter((item) => item.path)
    .map((item) => ({
      nome: item.name || '(sem nome)',
      caminho: item.path,
      titulo: item.meta?.titulo || '-',
      descricao: item.meta?.descricao || '-',
    }))
    .sort((a, b) => a.caminho.localeCompare(b.caminho))
})
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title class="text-h5">Painel inicial</v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">
              Esta base já vem com roteamento, Vuetify, Pinia, backend FastAPI integrado,
              operações de recomendação, integração com incidentes, dashboard consolidado, testes e lista de rotas em tempo de execução.
            </p>

            <div class="d-flex ga-3 flex-wrap">
              <v-btn color="primary" to="/ai-metrics">Abrir dashboard</v-btn>
              <v-btn variant="tonal" color="secondary" to="/ai-metrics/operacoes">Abrir operações</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card>
          <v-card-title class="text-h6">Resumo técnico</v-card-title>
          <v-card-text>
            <v-list lines="two" density="compact">
              <v-list-item title="Estado" subtitle="Pinia com ações, logs e carregamento assíncrono" />
              <v-list-item title="UI" subtitle="Vuetify com skeleton loader e layout responsivo" />
              <v-list-item title="Gráficos" subtitle="ApexCharts para barras, linha e scatter" />
              <v-list-item title="Operações" subtitle="Incidentes, criação, decisão e outcome das recomendações" />
              <v-list-item title="Testes" subtitle="Vitest + Vue Test Utils" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title class="text-h6">Painel de rotas em tempo de execução</v-card-title>
      <v-card-subtitle>Implementado com <code>router.getRoutes()</code></v-card-subtitle>
      <v-card-text>
        <v-table density="comfortable">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Caminho</th>
              <th>Título</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rota in rotas" :key="`${rota.nome}-${rota.caminho}`">
              <td>{{ rota.nome }}</td>
              <td><code>{{ rota.caminho }}</code></td>
              <td>{{ rota.titulo }}</td>
              <td>{{ rota.descricao }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
