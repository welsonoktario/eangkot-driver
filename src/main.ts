import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'

/* Theme variables */
import './theme/variables.scss'

import { db } from '@/lib'
import 'mapbox-gl/dist/mapbox-gl.css'

const pinia = createPinia().use(piniaPluginPersistedstate)
const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .provide('db', db)

router.isReady().then(() => {
  app.mount('#app')
})
