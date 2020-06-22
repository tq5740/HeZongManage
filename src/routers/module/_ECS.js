const Index = resolve => require(['@pages/index'], resolve)
export default [{
    path: "/ECS",
    redirect: "/ECS/monitor",
    component: Index,
    children: [{
            path: "/ECS/monitor",
            component: resolve => require(['@pages/ECS/monitor'], resolve)
        },
        {
            path: "/ECS/chartDetail",
            component: resolve => require(['@pages/ECS/chartDetail'], resolve)
        },
        {
            path: "/ECS/detail3",
            component: resolve => require(['@pages/ECS/detail'], resolve)
        },
    ]
}];