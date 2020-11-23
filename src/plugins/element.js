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
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Step,
  Steps,
  Upload,
  Checkbox,
  CheckboxGroup
} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Dialog).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Select).use(Option).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Step).use(Steps).use(Upload).use(Checkbox).use(CheckboxGroup)
//挂载弹框组件
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
