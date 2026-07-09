import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import 'element-plus/dist/index.css'
import elementIcon from './plugins/icons'
import echarts from './plugins/echarts.js'
createApp(App).use(router).use(elementIcon).use(echarts).mount('#app')
