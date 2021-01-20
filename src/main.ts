import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import SnLayout from '@/components/portal/index.tsx'
// 加载全局样式
import './styles/index.scss'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(SnLayout)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
