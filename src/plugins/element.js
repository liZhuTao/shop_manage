import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox
} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Dialog).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog)
//挂载弹框组件
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
