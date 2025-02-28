import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router/index'
//import './style.css'
import App from './App.vue'
import './assets/style/output.css'


const app =createApp(App)

app.use(createPinia())
app.use(router).mount('#app')
