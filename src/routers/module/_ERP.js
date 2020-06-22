const Index = resolve => require(['@pages/index'], resolve)
export default [{
    path: "/",
    redirect: "/ERP/monitor",
    component: Index,
    children: [{
        path: "/ERP/monitor",
        component: resolve => require(['@pages/ERP/monitor'], resolve)
    }, {
        path: "/ERP/chartDetail",
        component: resolve => require(['@pages/ERP/chartDetail'], resolve)
    }, {
        path: "/ERP/detail3",
        component: resolve => require(['@pages/ERP/detail'], resolve)
    }, {
        path: "/ERP/detail4",
        component: resolve => require(['@pages/ERP/detail'], resolve)
    }, ]
}];