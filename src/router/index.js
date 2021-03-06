import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome'
import Users from '@/views/Users'
import Rights from '@/views/Power/Rights.vue'
import Roles from '@/views/Power/Roles.vue'
import Cate from '@/views/Goods/Cate.vue'
import Params from '@/views/Goods/Params.vue'
import List from '@/views/Goods/List.vue'
import Add from '@/views/Goods/Add.vue'
import Order from '@/views/Order'
import Report from '@/views/Report'

Vue.use(VueRouter)

const routes = [
  { path:"/",redirect:'/login' },
  { path:'/login',component:Login },
  { 
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      { path:'/welcome',component:Welcome },
      { path:'/users',component:Users },
      { path:'/rights',component:Rights },
      { path:'/roles',component:Roles },
      { path:'/categories',component:Cate },
      { path:'/params',component:Params },
      { path:'/goods',component:List },
      { path:'/goods/add',component:Add },
      { path:'/orders',component:Order },
      { path:'/reports',component:Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转过来
  //next 函数  表示放行
  // next() 放行  next('login) 强制跳转
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})


export default router
