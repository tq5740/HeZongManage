const Index = resolve => require(['@pages/index'], resolve)
export default [
    {
        path: "/TMS",
        redirect: "/TMS/monitor",
        component: Index,
        children: [
            {
                path: "/TMS/monitor",
                component: resolve => require(['@pages/TMS/monitor'], resolve)
            },
            {
                path: "/TMS/chartDetail",
                component: resolve => require(['@pages/TMS/chartDetail'], resolve)
            },
        ]
    }
];