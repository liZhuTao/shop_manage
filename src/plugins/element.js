import Vue from 'vue'
import { Button,Form,FormItem,Input,Dialog,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Dialog).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem)
//挂载弹框组件
Vue.prototype.$message = Message;