import { createApp } from 'vue'
import App from './App.vue'
import { vuetify } from './app/plugins/vuetify'
import { pinia } from './app/plugins/pinia'
import { router } from './app/router'
import VueApexCharts from 'vue3-apexcharts'
import './styles/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)

app.mount('#app')
