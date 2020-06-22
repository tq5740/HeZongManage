// import Vue from "vue";
// import VueRouter from "vue-router";

import _ERP from '@router/_ERP';
import _ECS from '@router/_ECS';
import _WMS from '@router/_WMS';
import _CFO from '@router/_CFO';
// import _TMS from '@router/_TMS';
// import _GSP from '@router/_GSP';

Vue.use(VueRouter);
const Routers = new VueRouter({
  mode: "history",
  routes: [
    ..._ERP,
    ..._ECS,
    ..._WMS,
    ..._CFO,
    // ..._TMS,
    // ..._GSP
  ]
});

// Routers.beforeEach(async (to, from, next) => {
  
//   next();
// });
Routers.onError(() => {
  $Notif({
    type: `error`,
    title: "提示",
    message: "网络错误或服务器异常"
  });
});
export default Routers;
