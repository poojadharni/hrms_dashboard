import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)
app.use(VueApexCharts)

app.component('Button', Button)
app.component('apexchart', VueApexCharts)

app.mount('#app')