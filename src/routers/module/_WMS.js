const Index = resolve => require(['@pages/index'], resolve)
export default [
    {
        path: "/WMS",
        redirect: "/WMS/monitor",
        component: Index,
        children: [
            {
                path: "/WMS/monitor",
                component: resolve => require(['@pages/WMS/monitor'], resolve)
            },
            {
                path: "/WMS/chartDetail",
                component: resolve => require(['@pages/WMS/chartDetail'], resolve)
            },
        ]
    }
];