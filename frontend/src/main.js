import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Solid icons
import { fab } from '@fortawesome/free-brands-svg-icons'; // Brand icons

library.add(fas, fab);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
