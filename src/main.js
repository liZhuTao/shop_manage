import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button,Form,FormItem,Input,Dialog } from 'element-ui'
//导入全局样式表
import '@/assets/css/global.css'

console.log(Button)

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Dialog)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
