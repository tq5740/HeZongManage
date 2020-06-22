const Index = resolve => require(['@pages/index'], resolve)
const forms = resolve => require(['@pages/CFO/forms'], resolve)
const detail = resolve => require(['@pages/CFO/detail'], resolve)
export default [
    {
        path: "/finance",
        redirect: "/finance/forms0",
        component: Index,
        children: [
            {
                path: "/finance/forms0",
                component: forms
            },
            {
                path: "/finance/forms1",
                component: forms
            },
            {
                path: "/finance/forms2",
                component: forms
            },
            {
                path: "/finance/forms3",
                component: forms
            },
            {
                path: "/finance/forms4",
                component: forms
            },
            {
                path: "/finance/forms5",
                component: forms
            },
            {
                path: "/finance/detail0",
                component: detail
            },
            {
                path: "/finance/detail1",
                component: detail
            },
            {
                path: "/finance/detail2",
                component: detail
            },
            {
                path: "/finance/detail3",
                component: detail
            },
            {
                path: "/finance/detail4",
                component: detail
            },
            {
                path: "/finance/detail5",
                component: detail
            },
        ]
    }
];