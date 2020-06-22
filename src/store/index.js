// import Vue from 'vue';
// import Vuex from 'vuex';
import actions from "./actions";
import mutations from "./mutations";
import All from "@api/all";
import {
    getMonthDays,
    getDaysBefore,
    deepFreeze
} from "@utils/index";
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        v: "V1.0.0",
        appKey: "00001",
        defaultTime: [new Date().getFullYear() + '/01/01 00:00:00', getDaysBefore(true, undefined, 0) + ' 23:59:59'],
        defaultToday: [getDaysBefore(true, undefined, 0) + ' 00:00:00', getDaysBefore(true, undefined, 0) + ' 23:59:59'],
        datePoint: getDaysBefore(true, undefined, 0),
        defaultTime1: [getDaysBefore(true, undefined, 400) + ' 00:00:00', getDaysBefore(true, undefined, 170) + ' 23:59:59'],
        // defaultTime: ['2019/07/01 00:00:00', '2019/12/31 23:59:59'],
        // defaultToday: ['2020/03/04 00:00:00', '2020/03/05 23:59:59'],
        // datePoint: "2020/03/11",
        cfoTime: {
            isMonth: false,
            time() {
                let tYear = new Date().getFullYear();
                let tMonth = new Date().getMonth();
                if (this.isMonth) {
                    tMonth = tMonth + 1;
                    if (tMonth.toString().length == 1) {
                    tMonth = "0" + tMonth;
                    }
                    return [tYear + "/01", tYear + "/" + tMonth];
                } else {
                    return [tYear - 1 + "", tYear - 1 + ""];
                }
            }
        },
        pickerOptions: deepFreeze({
            disabledDate: time => {
                return time.getTime() > new Date().getTime();
            },
            shortcuts: [{
                text: "本月",
                onClick(picker) {
                    let now = new Date();
                    var nowDay = now.getDate();
                    let nowMonth = now.getMonth();
                    let nowYear = now.getFullYear();
                    const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59);
                    const start = new Date(nowYear, nowMonth, 1);
                    console.log(nowYear, nowMonth, nowDay, 23, 59, 59)
                    picker.$emit("pick", [start, end]);
                }
            }, {
                text: "上月",
                onClick(picker) {
                    let now = new Date();
                    let nowYear = now.getFullYear();
                    let lastMonthDate = new Date();
                    lastMonthDate.setDate(1);
                    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
                    let lastMonth = lastMonthDate.getMonth();
                    const end = new Date(nowYear, lastMonth, getMonthDays(null, lastMonth), 23, 59, 59);
                    const start = new Date(nowYear, lastMonth, 1);
                    picker.$emit("pick", [start, end]);
                }
            }, {
                text: "今年",
                onClick(picker) {
                    let now = new Date();
                    var nowDay = now.getDate();
                    let nowMonth = now.getMonth();
                    let nowYear = now.getFullYear();
                    const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59);
                    const start = new Date(nowYear, 0, 1);
                    picker.$emit("pick", [start, end]);
                }
            }, {
                text: "去年",
                onClick(picker) {
                    let now = new Date();
                    let nowYear = now.getFullYear();
                    const end = new Date(nowYear - 1, 11, getMonthDays(nowYear - 1, 11), 23, 59, 59);
                    const start = new Date(nowYear - 1, 0, 1);
                    picker.$emit("pick", [start, end]);
                }
            }, {
                text: "最近3个月",
                onClick(picker) {
                    let now = new Date();
                    let nowDay = now.getDate();
                    let nowMonth = now.getMonth();
                    let nowYear = now.getFullYear();
                    const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59);
                    let pass = now;
                    pass.setTime(pass.getTime() - 3600 * 1000 * 24 * 90);
                    let nowDayS = pass.getDate();
                    let nowMonthS = pass.getMonth();
                    let nowYearS = pass.getFullYear();
                    const start = new Date(nowYearS, nowMonthS, nowDayS);
                    picker.$emit("pick", [start, end]);
                }
            }, {
                text: "最近6个月",
                onClick(picker) {
                    let now = new Date();
                    let nowDay = now.getDate();
                    let nowMonth = now.getMonth();
                    let nowYear = now.getFullYear();
                    const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59);
                    let pass = now;
                    pass.setTime(pass.getTime() - 3600 * 1000 * 24 * 180);
                    let nowDayS = pass.getDate();
                    let nowMonthS = pass.getMonth();
                    let nowYearS = pass.getFullYear();
                    const start = new Date(nowYearS, nowMonthS, nowDayS);
                    picker.$emit("pick", [start, end]);
                }
            }]
        }),
        defaulted: {
            fromWhere: "",
            selectArr: [],
            chartTable: false,
            chart: {},
            table: {},
            select: {},
            params: [],
            show: {
                dimension: true,
                scope: true,
                time: true,
            }
        },
        selected: {},
        selectOptions: {
            saleChannel: [],
            dept: []
        },
        dimension: {
            ERP: [{
                    code: 1,
                    name: "客户数量",
                    unit: "个"
                },
                {
                    code: 2,
                    name: "含税收入",
                    unit: "元"
                },
                {
                    code: 3,
                    name: "不含税收入",
                    unit: "元"
                },
                {
                    code: 4,
                    name: "含税成本",
                    unit: "元"
                },
                {
                    code: 5,
                    name: "不含税成本",
                    unit: "元"
                }
            ],
            ERPtype: [{
                    code: 1,
                    name: "品种数量",
                    unit: "个"
                },
                {
                    code: 2,
                    name: "含税收入",
                    unit: "元"
                },
                {
                    code: 3,
                    name: "不含税收入",
                    unit: "元"
                },
                {
                    code: 4,
                    name: "含税成本",
                    unit: "元"
                },
                {
                    code: 5,
                    name: "不含税成本",
                    unit: "元"
                }
            ],
            ERPdebt: [{
                    code: 1,
                    name: "欠款金额",
                    unit: "元"
                },
                {
                    code: 2,
                    name: "回款金额",
                    unit: "元"
                },
            ],
            ECS: [{
                code: 2,
                name: "销售总额",
                unit: "元"
            }, {
                code: 1,
                name: "会员数量",
                unit: "个"
            }],
            ECSCategory: [{
                    code: 1,
                    name: "销售总额",
                    unit: "元"
                },
                {
                    code: 2,
                    name: "购买家数",
                    unit: "个"
                },
                {
                    code: 3,
                    name: "销售数量",
                    unit: "个"
                }
            ],
            ECSPayment: [{
                    code: 1,
                    name: "订单数量",
                    unit: "个"
                },
                {
                    code: 2,
                    name: "总金额",
                    unit: "元"
                }
            ]
        },
        listData: deepFreeze([{
                name: "注册会员数",
                code: "-",
                icon: "#icon-huiyuan",
                link: "/ecs/register",
                color: "rgb(73, 169, 238)",
                method: All.registerMembersChart(),
            },
            {
                name: "审核会员数",
                code: "-",
                icon: "#icon-huiyuan",
                link: "/ecs/check",
                color: "rgb(152, 216, 125)",
                method: All.auditMembersChart(),
            },
            {
                name: "下单会员数",
                code: "-",
                icon: "#icon-xiadan",
                link: "/ecs/bought",
                color: "rgb(255, 216, 110)",
                method: All.orderMembersChart(),
            },
            {
                name: "整体会员购买率",
                code: "-",
                icon: "#icon-qianbi",
                link: "/ecs/totalbuyrate",
                color: "rgb(243, 133, 124)",
                method: All.allMembersChartBuyRate(),
                unit: "%"
            },
            {
                name: "准会员数购买率",
                code: "-",
                icon: "#icon-qianbi",
                link: "/ecs/membuyrate",
                color: "rgb(243, 133, 124)",
                method: All.associateMembersChartBuyRate(),
                unit: "%"
            },
            {
                name: "会员复购率",
                code: "-",
                icon: "#icon-qianbi",
                link: "/ecs/rebuyrate",
                color: "rgb(255, 216, 110)",
                method: All.membersAgainSaleChart(),
                unit: "%"
            },
            {
                name: "订单均价",
                code: "-",
                icon: "#icon-xiadan",
                link: "/ecs/orderavg",
                color: "rgb(152, 216, 125)",
                method: All.orderAvgPriceChart(),
            },
            {
                name: "客单价",
                code: "-",
                icon: "#icon-qianbi",
                link: "/ecs/ordermem",
                color: "rgb(73, 169, 238)",
                method: All.customerAvgPriceChart()
            }
        ]),
        listData1: [{
            chart: {
                name: "电商客户销售图表",
                method: All.customerSaleChart()
            },
            select: {},
            table: {
                method: All.ecsCustomerSaleList()
            },
            total: {
                method: All.ecsTotalCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECS",
            selectArr: [{
                name: "销售区域",
                code: "ecsRegion"
            }, {
                name: "会员等级",
                code: "ecsUserRank"
            }, {
                name: "部门",
                code: "ecsDept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "区域销售",
                method: All.customerSaleChart()
            },
            select: {
                name: "销售区域",
                code: "ecsRegion"
            },
            table: {
                method: All.ecsCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECS",
            selectArr: [{
                name: "销售区域",
                code: "ecsRegion"
            }, {
                name: "会员等级",
                code: "ecsUserRank"
            }, {
                name: "部门",
                code: "ecsDept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "会员等级销售",
                method: All.customerSaleChart()
            },
            select: {
                name: "会员等级",
                code: "ecsUserRank"
            },
            table: {
                method: All.ecsCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECS",
            selectArr: [{
                name: "销售区域",
                code: "ecsRegion"
            }, {
                name: "会员等级",
                code: "ecsUserRank"
            }, {
                name: "部门",
                code: "ecsDept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "品种销售",
                method: All.categorySaleChart()
            },
            select: {
                name: "品种销售",
                code: "ecsCategory"
            },
            table: {
                method: All.ecsCategorySaleList()
            },
            total: {
                method: All.ecsTotalCategorySaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECSCategory",
            selectArr: [{
                name: "品种",
                code: "ecsCategory"
            }],
            chartTable: false
        }, {
            chart: {
                name: "复购次数",
                method: All.buyNum()
            },
            select: {},
            table: {
                method: All.buyNum()
            },
            show: {
                dimension: false,
                scope: false,
                time: true
            },
            fromWhere: "ECSbuyNum",
            selectArr: [],
            chartTable: true
        }, {
            chart: {
                name: "部门销售",
                method: All.customerSaleChart()
            },
            select: {
                name: "部门",
                code: "ecsDept"
            },
            table: {
                method: All.ecsCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECS",
            selectArr: [{
                name: "销售区域",
                code: "ecsRegion"
            }, {
                name: "会员等级",
                code: "ecsUserRank"
            }, {
                name: "部门",
                code: "ecsDept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "支付统计",
                method: All.ecsCountChart()
            },
            select: {
                name: "支付统计",
                code: "ecsPayment"
            },
            table: {
                method: All.ecsPayList()
            },
            total: {
                method: All.ecsTotalPayList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ECSPayment",
            selectArr: [{
                name: "支付方式",
                code: "ecsPayment"
            }, {
                name: "销售区域",
                code: "ecsRegion"
            }],
            chartTable: false
        }],
        ERPlistData: [{
            chart: {
                name: "客户整体销售情况",
                method: All.erpCustomerSale()
            },
            select: {},
            total: {
                method: All.erpCustomerSaleSum()
            },
            table: {
                method: All.erpCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: true,
                time: true
            },
            fromWhere: "ERP",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }, {
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "采购渠道",
                code: "purchaseChannel"
            }, {
                name: "部门",
                code: "dept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "渠道销售",
                method: All.erpCustomerSale()
            },
            select: {
                name: "销售渠道",
                code: "saleChannel"
            },
            total: {
                method: All.erpCustomerSaleSum()
            },
            table: {
                method: All.erpCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: true,
                time: true
            },
            fromWhere: "ERP",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }, {
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "采购渠道",
                code: "purchaseChannel"
            }, {
                name: "部门",
                code: "dept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "区域销售",
                method: All.erpCustomerSale()
            },
            select: {
                name: "销售渠道",
                code: "saleChannel"
            },
            total: {
                method: All.erpCustomerSaleSum()
            },
            table: {
                method: All.erpCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: true,
                time: true
            },
            fromWhere: "ERP",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }, {
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "采购渠道",
                code: "purchaseChannel"
            }, {
                name: "部门",
                code: "dept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "客户销售",
                method: All.erpCustomerSale()
            },
            select: {
                name: "销售渠道",
                code: "saleChannel"
            },
            total: {
                method: All.erpCustomerSaleSum()
            },
            table: {
                method: All.erpCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: true,
                time: true
            },
            fromWhere: "ERP",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }, {
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "采购渠道",
                code: "purchaseChannel"
            }, {
                name: "部门",
                code: "dept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "品种销售",
                method: All.erpCategorySaleChart()
            },
            select: {
                name: "品种",
                code: "medicineType"
            },
            total: {
                method: All.erpCategorySaleDetailSum()
            },
            table: {
                method: All.erpCategorySaleList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ERPtype",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "品种",
                code: "medicineType"
            }, {
                name: "利润等级",
                code: "profitLevel"
            }],
            chartTable: false
        }, {
            chart: {
                name: "部门销售",
                method: All.erpCustomerSale()
            },
            select: {
                name: "部门",
                code: "dept"
            },
            total: {
                method: All.erpCustomerSaleSum()
            },
            table: {
                method: All.erpCustomerSaleList()
            },
            show: {
                dimension: true,
                scope: true,
                time: true
            },
            fromWhere: "ERP",
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }, {
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "采购渠道",
                code: "purchaseChannel"
            }, {
                name: "部门",
                code: "dept"
            }],
            chartTable: false
        }, {
            chart: {
                name: "部门欠款&回款",
                method: All.erpDeptAndIncomeChart()
            },
            select: {
                name: "部门",
                code: "dept"
            },
            total: {
                method: All.erpTotalDeptAndIncome()
            },
            table: {
                method: All.erpDeptAndIncomeList()
            },
            show: {
                dimension: true,
                scope: false,
                time: true
            },
            fromWhere: "ERPdebt",
            selectArr: [{
                name: "部门",
                code: "dept"
            }, {
                name: "人员",
                code: "erpZhiyzl"
            }],
            chartTable: false
        }],
        CFOlistData: [{
            method: All.cfoCustomerSale(),
            methodD: All.cfoCustomerSaleDetail(),
            select: {
                name: "销售渠道",
                code: "saleChannel"
            },
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "销售区域",
                code: "erpRegion"
            }, {
                name: "客户类型",
                code: "customerType"
            }
            // , {
            //     name: "采购渠道",
            //     code: "purchaseChannel"
            // }
            ],
            fromWhere: "CFO0",
        }, {
            method: All.cfoCategorySale(),
            methodD: All.cfoCategorySaleDetail(),
            select: {
                name: "品种",
                code: "medicineType"
            },
            selectArr: [{
                name: "销售渠道",
                code: "saleChannel"
            }, {
                name: "品种",
                code: "medicineType"
            }, {
                name: "利润等级",
                code: "profitLevel"
            }, {
                name: "OTC类型",
                code: "medicineOtcType"
            }],
            fromWhere: "CFO1",
        }, {
            method: All.cfoSupplierPurchase(),
            methodD: All.cfoSupplierPurchaseDetail(),
            select: {
                name: "供应商类型",
                code: "supplierType"
            },
            selectArr: [{
                name: "供应商类型",
                code: "supplierType"
            }, {
                name: "供应商区域",
                code: "erpRegion"
            }],
            fromWhere: "CFO2",
        }, {
            method: All.cfoCategoryPurchase(),
            methodD: All.cfoCategoryPurchaseDetail(),
            select: {
                name: "品种",
                code: "medicineType"
            },
            selectArr: [{
                name: "品种",
                code: "medicineType"
            }],
            fromWhere: "CFO3",
        }, {
            method: All.cfoChannelPurchase(),
            methodD: All.cfoChannelPurchaseDetail(),
            select: {
                name: "采购渠道",
                code: "purchaseChannel"
            },
            selectArr: [{
                name: "采购渠道",
                code: "purchaseChannel"
            }],
            fromWhere: "CFO4",
        }, {
            method: All.cfoStockBalance(),
            methodD: All.cfoStockBalanceDetail(),
            select: {
                name: "品种",
                code: "medicineType"
            },
            selectArr: [{
                name: "品种",
                code: "medicineType"
            }],
            fromWhere: "CFO5",
        }],
        WMSlistData: [{
            chart: {
                name: "日均条目数",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList0()
            },
        }, {
            chart: {
                name: "收货上架及时率",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }, {
            chart: {
                name: "出库及时率",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }, {
            chart: {
                name: "破损率",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }, {
            chart: {
                name: "出库箱数",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }, {
            chart: {
                name: "个人小时效率",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }, {
            chart: {
                name: "库存分布",
                method: All.wmsDetailChart0()
            },
            table: {
                method: All.wmsDetailList1()
            },
        }]
    },
    mutations,
    actions,

})

export default store;