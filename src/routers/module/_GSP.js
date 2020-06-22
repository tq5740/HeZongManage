const Index = resolve => require(['@pages/index'], resolve)
export default [
    {
        path: "/GSP",
        redirect: "/GSP/chartDetail",
        component: Index,
        children: [
            {
                path: "/GSP/chartDetail",
                component: resolve => require(['@pages/GSP/chartDetail'], resolve)
            },
            {
                path: "/GSP/detail1",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
            {
                path: "/GSP/detail3",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
            {
                path: "/GSP/detail5",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
            {
                path: "/GSP/detail6",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
            {
                path: "/GSP/detail7",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
            {
                path: "/GSP/detail8",
                component: resolve => require(['@pages/GSP/detail'], resolve)
            },
        ]
    }
];