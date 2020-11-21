import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element'
import './plugins/http'
//导入全局样式表
import '@/assets/css/global.css'

Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
