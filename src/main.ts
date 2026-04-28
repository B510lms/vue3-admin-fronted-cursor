import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import { useAppStore } from '@/store/modules/app'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'nprogress/nprogress.css'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'
import '@/permission'

const app = createApp(App)
app.use(pinia)
useAppStore().initTheme()
app.use(router)
app.use(ElementPlus)
app.mount('#app')
