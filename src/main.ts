import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import './styles/main.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
