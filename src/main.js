// import Vue from 'vue'
import App from './App.vue'
// import VueRouter from 'vue-router'
import router from "./routers/router";
import store from "./store/index";
import "@style/reset.scss"
import "@style/icon.js"
// import "element-ui/lib/theme-chalk/base.css";
import "@style/el-theme.scss";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import {
  Row,
  Dialog,
  Loading,
  MessageBox,
  Notification,
  Input,
  Form,
  FormItem,
  Button,
  ButtonGroup,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Cascader,
  RadioGroup,
  RadioButton,
  DatePicker,
  TimePicker,
  Tooltip,
  Link,
  Tabs,
  TabPane,
} from "element-ui";
import { setStorage, getStorage, formatDate, getApiTime, mapStr, toThousands, arrFilter, toTime, chartFormatter, getDownload } from '@utils/index';
const elemArr = [
  Row,
  Dialog,
  Input,
  Form,
  FormItem,
  Button,
  ButtonGroup,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Cascader,
  RadioGroup,
  RadioButton,
  DatePicker,
  TimePicker,
  Tooltip,
  Link,
  Tabs,
  TabPane,
]
Vue.use(Loading.directive);
Vue.use(VueRouter);
elemArr.forEach(item => {
  Vue.use(item);
})
Vue.component(CollapseTransition.name, CollapseTransition); // 展开的过渡动画
String.prototype.padLeft = function (padchar, num) {
  return padchar.repeat(this.length > num ? 0 : num - this.length) + this;
};

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// Vue实例方法
Vue.prototype.$Notif = Notification;    // 右侧通知框
Vue.prototype.$Loading = Loading;    // 全局遮盖等待
Vue.prototype.$MessageBox = MessageBox;    // 弹出框
Vue.prototype.$Confirm = MessageBox.confirm;    // 弹出框

Vue.prototype.$ToThousands = toThousands;    // 数字隔三加逗号
Vue.prototype.$ArrFilter = arrFilter;  // 过滤数组
Vue.prototype.$ToTime = toTime;  // 转换时间显示格式
Vue.prototype.$ChartFormatter = chartFormatter;  // 转换时间显示格式

Vue.prototype.$MapStr = mapStr;    // 根据code获取name
Vue.prototype.$SetStorage = setStorage;   // 设置缓存
Vue.prototype.$GetStorage = getStorage;   // 获取缓存
Vue.prototype.$FormatDate = formatDate;   // 格式化时间
Vue.prototype.$GetApiTime = getApiTime;   
Vue.prototype.$GetDownload = getDownload;  // 下载

// Vue实例对象方法

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      //loading: false,

    }
  },
  created() {

  },
  methods: {
    
  }
})

// 初始化Vue
async function initVue() {
  

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
}

initVue();
