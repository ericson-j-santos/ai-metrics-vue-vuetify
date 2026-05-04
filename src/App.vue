<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const drawer = ref(false)
const route = useRoute()
const router = useRouter()

const items = [
  {
    title: 'Início',
    value: 'home',
    icon: 'mdi-home-outline',
    to: '/',
  },
  {
    title: 'AI Metrics',
    value: 'ai-metrics',
    icon: 'mdi-chart-box-outline',
    to: '/ai-metrics',
  },
  {
    title: 'Operações IA',
    value: 'ai-metrics-operations',
    icon: 'mdi-form-select',
    to: '/ai-metrics/operacoes',
  },
]

const tituloAtual = computed(() => route.meta?.titulo || 'Aplicação')

function navegar(destino) {
  router.push(destino)
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav density="comfortable">
        <v-list-subheader>Navegação</v-list-subheader>

        <v-list-item
          v-for="item in items"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="route.path === item.to"
          @click="navegar(item.to)"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="surface" elevation="1">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>

      <v-app-bar-title>{{ tituloAtual }}</v-app-bar-title>

      <template #append>
        <v-chip color="primary" variant="tonal" class="mr-4">
          Vue 3 + Vuetify + Pinia
        </v-chip>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
