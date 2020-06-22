import http from "../base";
export default {
    postAPI(data) { return http.post(`${http.router}`, data) },
    getAPI(data) { return http.get(`${http.router}`, data) },
    http() {return http},
    
    // ERP码表
    codeAaleChannel() { return "basic.code.saleChannel"}, // 销售渠道
    codeErpRegion() { return "basic.code.erpRegion"}, // 销售区域
    codeCustomerType() { return "basic.code.customerType"}, // 客户类型
    codeSupplierType() { return "basic.code.supplierType"}, // 供应商类型
    codePurchaseChannel() { return "basic.code.purchaseChannel"}, // 采购渠道
    codeDept() { return "basic.code.dept"}, // 部门
    codeMedicineType() { return "basic.code.medicineType"}, // 品种类型
    codeProfitLevel() { return "basic.code.profitLevel"}, // 利润等级
    codeMedicineOtcType() { return "basic.code.medicineOtcType"}, // OTC类型
    codeErpZhiyzl() { return "basic.code.erpZhiyzl"}, // 人员
    // ECS码表
    codeEcsRegion() { return "basic.code.ecsRegion"}, // 销售区域
    codeEcsUserRank() { return "basic.code.ecsUserRank"}, // 会员等级
    codeEcsDept() { return "basic.code.ecsDept"}, // 部门
    codeEcsCategory() { return "basic.code.ecsCategory"}, // 品种类型
    codeEcsPayment() { return "basic.code.ecsPayment"}, // 支付类型
    
    // ERP
    erpSum() { return "erp.report.sum"}, // 查询ERP销售整体情况（默认半年）
    erpTotal() { return "erp.report.total"}, // 查询ERP销售整体情况（默认半年）
    erpChannel() { return "erp.report.channel"}, // 查询电商和线下营销收入情况
    erpArea() { return "erp.report.area"}, // 查询区域营销收入情况
    erpCustomerType() { return "erp.report.customerType"}, // 查询不同客户类型营销收入情况
    erpCategory() { return "erp.report.category"}, // 查询药品种类营销收入情况
    erpDept() { return "erp.report.dept"}, // 查询部门营销收入情况
    erpDeptAndIncome() { return "erp.report.deptAndIncome"}, // ERP部门欠款&回款
    erpCustomerSale() { return "erp.report.customerSale"}, // ERP客户销售图表统计
    erpCustomerSaleSum() { return "erp.report.customerSale.sum"}, // ERP客户销售合计
    erpCustomerSaleList() { return "erp.report.customerSale.list"}, // ERP客户销售详细列表
    erpCustomerSaleDetailSum() { return "erp.report.customerSale.detail.sum"}, // ERP客户销售列表详细页合计
    erpCustomerSaleDetailList() { return "erp.report.customerSale.detail.list"}, // ERP客户销售详细页列表
    erpCategorySaleChart() { return "erp.report.categorySale.chart"}, // ERP品种销售图表统计
    erpCategorySaleList() { return "erp.report.categorySale.list"}, // ERP品种销售详细列表
    erpCategorySaleDetailSum() { return "erp.report.categorySale.detail.sum"}, // ERP品种销售列表详细页合计
    erpCategorySaleDetailList() { return "erp.report.categorySale.detail.list"}, // ERP品种销售列表详细页列表
    erpDeptAndIncomeChart() { return "erp.report.deptAndIncomeChart"}, // ERP部门欠款与回款图表
    erpDeptAndIncomeList() { return "erp.report.deptAndIncomeList"}, // ERP部门欠款与回款列表
    erpTotalDeptAndIncome() { return "erp.report.totalDeptAndIncome"}, // ERP部门欠款与回款合计

    // ECS
    ecsTotalSum() { return "ecs.report.total.sum"},
    ecsTotalSimple() { return "ecs.report.total.simple"},
    ecsTotalChart() { return "ecs.report.total.chart"},
    ecsArea() { return "ecs.report.area"},
    ecsUserrank() { return "ecs.report.userrank"},
    ecsCategory() { return "ecs.report.category"},
    ecsBoughts() { return "ecs.report.boughts"},  // 复购次数
    ecsDept() { return "ecs.report.dept"},
    ecsPay() { return "ecs.report.pay"},

    auditMembersChart() { return "ecs.report.auditMembersChart"}, // ECS审核会员数图表
    registerMembersChart() { return "ecs.report.registerMembersChart"}, // ECS注册会员数图表
    orderMembersChart() { return "ecs.report.orderMembersChart"}, // ECS下单会员数图表
    allMembersChartBuyRate() { return "ecs.report.allMembersChartBuyRate"}, // ECS会员购买率数图表
    orderAvgPriceChart() { return "ecs.report.orderAvgPriceChart"}, // ECS订单均价
    associateMembersChartBuyRate() { return "ecs.report.associateMembersChartBuyRate"}, // ECS准会员购买率
    membersAgainSaleChart() { return "ecs.report.membersAgainSaleChart"}, // ECS会员复购率
    customerAvgPriceChart() { return "ecs.report.customerAvgPriceChart"}, // ECS客单价

    customerSaleChart() { return "ecs.report.customerSaleChart"}, // ECS电商客户销售图表
    ecsCustomerSaleList() { return "ecs.report.customerSaleList"}, // ECS电商客户销售列表
    customerSaleDetails() { return "ecs.report.customerSaleDetails"}, // ECS电商客户销售详情列表
    
    categorySaleChart() { return "ecs.report.categorySaleChart"}, // ECS品种销售图表统计
    ecsCategorySaleList() { return "ecs.report.categorySaleList"}, // ECS品种销售列表
    categoryDetails() { return "ecs.report.categoryDetails"}, // ECS品种销售详细页列表

    buyNum() { return "ecs.report.buyNum"}, // ECS复购次数统计（图列一样）

    ecsCountChart() { return "ecs.report.countChart"}, // ECS支付方式图表
    ecsPayList() { return "ecs.report.payList"}, // ECS支付方式列表

    ecsTotalCustomerSaleList() { return "ecs.report.totalCustomerSaleList"},     // 详情页汇总
    ecsTotalCustomerSaleDetails() { return "ecs.report.totalCustomerSaleDetails"},
    ecsTotalCategorySaleList() { return "ecs.report.totalCategorySaleList"},
    ecsTotalCategoryDetails() { return "ecs.report.totalCategoryDetails"},
    ecsTotalPayList() { return "ecs.report.totalPayList"},

    // WMS
    wmsSum() { return "wms.report.sum" },
    wmsHome0() { return "wms.report.hourOrdersReport"}, // 小时接单量
    wmsHome1() { return "wms.report.reviewHourCapacityReport"}, // 复核小时产能
    wmsHome2() { return "wms.report.pickhourCapacityReport"}, // 拣货小时产能
    wmsHome3() { return "wms.report.receivePutawayTimeRateReport"}, // 收货上架及时率
    wmsHome4() { return "wms.report.deliveryTimeRateReport"}, // 出库及时率
    wmsHome5() { return "wms.report.damageRateReport"}, // 破损率
    wmsHome6() { return "wms.report.outNumberReport"}, // 出库箱数
    wmsHome7() { return "wms.report.personalHoursRateReport"}, // 个人小时效率
    wmsHome8() { return "wms.report.inventoryDistributionReport"}, // 库存分布

    wmsDetailChart0() { return "wms.report.entryChart"}, // 日均/年均条目数详情图表
    wmsDetailList0() { return "wms.report.entryList"}, // 日均/年均条目数详情列表
    wmsDetailChart1() { return "wms.report.receivePutawayTimeRateChart"}, // 收货上架及时率图表
    wmsDetailList1() { return "wms.report.receivePutawayTimeRateList"}, // 收货上架及时率列表
    wmsDetailChart2() { return "wms.report.deliveryTimeRateChart"}, // 出库及时率图表
    wmsDetailList2() { return "wms.report.deliveryTimeRateList"}, // 出库及时率列表
    wmsDetailChart3() { return "wms.report.damageRateChart"}, // 破损率图表
    wmsDetailList3() { return "wms.report.damageRateList"}, // 破损率列表
    wmsDetailChart4() { return "wms.report.outNumberChart"}, // 出库图表
    wmsDetailList4() { return "wms.report.outNumberList"}, // 出库列表
    wmsDetailChart5() { return "wms.report.personalHoursRateChart"}, // 个人小时效率图表
    wmsDetailList5() { return "wms.report.personalHoursRateList"}, // 个人小时效率列表
    wmsDetailChart6() { return "wms.report.inventoryDistributionChart"}, // 库存分布图表
    wmsDetailList6() { return "wms.report.inventoryDistributionList"}, // 库存分布列表

    // 财务（finance）
    cfoCustomerSale() { return "finance.report.customerSale"}, // 客户销售报表
    cfoCustomerSaleDetail() { return "finance.report.customerSaleDetail"}, // 客户销售报表详情
    cfoCategorySale() { return "finance.report.categorySale"}, // 品种销售报表
    cfoCategorySaleDetail() { return "finance.report.categorySaleDetail"}, // 品种销售报表详情
    cfoSupplierPurchase() { return "finance.report.supplierPurchase"}, // 供应商采购报表
    cfoSupplierPurchaseDetail() { return "finance.report.supplierPurchaseDetail"}, // 供应商采购报表详情
    cfoCategoryPurchase() { return "finance.report.categoryPurchase"}, // 品种采购报表
    cfoCategoryPurchaseDetail() { return "finance.report.categoryPurchaseDetail"}, // 品种采购报表详情
    cfoChannelPurchase() { return "finance.report.channelPurchase"}, // 渠道采购报表
    cfoChannelPurchaseDetail() { return "finance.report.channelPurchaseDetail"}, //  渠道采购报表详情
    cfoStockBalance() { return "finance.report.stockBalance"}, // 存货结存报表
    cfoStockBalanceDetail() { return "finance.report.stockBalanceDetail"}, // 存货结存报表详情

    // ESC下载
    ecsExport0() { return "ecs.report.registerMembersChart.export" },
    ecsExport1() { return "ecs.report.auditMembersChart.export" },
    ecsExport2() { return "ecs.report.orderMembersChart.export" },
    ecsExport3() { return "ecs.report.allMembersChartBuyRate.export" },
    ecsExport4() { return "ecs.report.associateMembersChartBuyRate.export" },
    ecsExport5() { return "ecs.report.membersAgainSaleChart.export" },
    ecsExport6() { return "ecs.report.orderAvgPriceChart.export" },
    ecsExport7() { return "ecs.report.customerAvgPriceChart.export" },
    ecsExport8() { return "ecs.report.customerSaleList.export" },
    ecsExport9() { return "ecs.report.categorySaleList.export" },
    ecsExport9a() { return "ecs.report.categoryDetails.export" },
    ecsExport10() { return "ecs.report.buyNum.export" },
    ecsExport11() { return "ecs.report.payList.export" },

    // ERP下载
    erpExport0() { return "erp.report.customerSale.list.export" },
    erpExport0a() { return "erp.report.customerSale.detail.list.export" },
    erpExport1() { return "erp.report.categorySale.list.export" },
    erpExport1a() { return "erp.report.categorySale.detail.list.export" },
    erpExport2() { return "erp.report.deptAndIncomeList.export" },

    // WMS下载
    wmsExport0() { return "wms.report.entryList.export" },
    wmsExport1() { return "wms.report.receivePutawayTimeRateList.export" },
    wmsExport2() { return "wms.report.deliveryTimeRateList.export" },
    wmsExport3() { return "wms.report.damageRateList.export" },
    wmsExport4() { return "wms.report.outNumberList.export" },
    wmsExport5() { return "wms.report.personalHoursRateList.export" },
    wmsExport6() { return "wms.report.inventoryDistributionList.export" },

    // CFO财务下载
    financeExport0() { return "finance.report.customerSale.export" },
    financeExport0a() { return "finance.report.customerSaleDetail.export" },
    financeExport1() { return "finance.report.categorySale.export" },
    financeExport1a() { return "finance.report.categorySaleDetail.export" },
    financeExport2() { return "finance.report.supplierPurchase.export" },
    financeExport2a() { return "finance.report.supplierPurchaseDetail.export" },
    financeExport3() { return "finance.report.categoryPurchase.export" },
    financeExport3a() { return "finance.report.categoryPurchaseDetail.export" },
    financeExport4() { return "finance.report.channelPurchase.export" },
    financeExport4a() { return "finance.report.channelPurchaseDetail.export" },
    financeExport5() { return "finance.report.stockBalance.export" },
    financeExport5a() { return "finance.report.stockBalanceDetail.export" },

    // TMS物流
    tmsHome0() { return "tms.board.item"},
    tmsHome1() { return "tms.board.receiveAmount"},
    tmsHome2() { return "tms.board.cargoAmount"},
    tmsHome3() { return "tms.board.stockOutTimelyRate"},
    tmsHome4() { return "tms.board.staffEfficiency"},
    tmsHome5() { return "tms.board.regionDeliverAmountChart"},
    tmsHome6() { return "tms.board.stockOutTimeEfficiency"},
    tmsHome7() { return "tms.board.customerComplaint"},

    tmsDetail0() { return "tms.report.receiveAmount"},
    tmsDetail1() { return "tms.report.stockOutTimelyRate"},
    tmsDetail2() { return "tms.report.staffEfficiency"},
    tmsDetail3() { return "tms.report.stockOutTimeEfficiency"},
    tmsDetail4() { return "tms.report.regionDeliverAmountTable"},
    tmsDetail5() { return "tms.report.customerComplaint"},
    tmsDetail5a() { return "tms.table.customerComplaint"},

    tmsCode0() { return "tms.code.region"},
    
    // GSP资管
    gspChart0() { return "gsp.receivingDAChart"},
    gspTable0() { return "gsp.receivingDATable"},
    gspChart1() { return "gsp.rejectDAChart"},
    gspTable1() { return "gsp.rejectDATable"},
    gspDetail1() { return "gsp.rejectDetail"},
    gspChart2() { return "gsp.acceptanceDAChart"},
    gspTable2() { return "gsp.acceptanceDATable"},
    gspChart3() { return "gsp.returnSaledDAChart"},
    gspTable3() { return "gsp.returnSaledDATable"},
    gspDetail3() { return "gsp.returnSaledDetail"},
    gspChart4() { return "gsp.maintenanceDAChart"},
    gspTable4() { return "gsp.maintenanceDATable"},
    gspChart5() { return "gsp.returnFlowDAChart"},
    gspTable5() { return "gsp.returnFlowDATable"},
    gspDetail5() { return "gsp.returnFlowDetail"},
    gspChart6() { return "gsp.substandardMedicineDAChart"},
    gspTable6() { return "gsp.substandardMedicineDATable"},
    gspDetail6() { return "gsp.substandardMedicineDetail"},
    gspChart7() { return "gsp.purchaseAbortDAChart"},
    gspTable7() { return "gsp.purchaseAbortDATable"},
    gspDetail7() { return "gsp.purchaseAbortDetail"},
    gsp8() { return "gsp.qualityPostDA"},
    gspDetailSave8() { return "gsp.qualityPostDetailSave"},
    gspImport8() { return "gsp.qualityPostImport"},
    gspDetail8() { return "gsp.qualityPostDetail"},
    gspTable9() { return "gsp.recallDA"},
    gspTable10() { return "gsp.ephedrineMedicineDA"},

    // GSP码表
    gspCode0() {return "gsp.receivingDAType"}, // 类型
    gspCode1() {return "gsp.Jusyy"}, // 拒收原因
    gspCode2() {return "gsp.acceptanceDAStaff"}, // 人员
    gspCode3() {return "gsp.returnSaledDACode"}, // 销退数据分析 5个类型的码表
    gspCode4() {return "gsp.maintenanceDAStaff"}, // 养护数据分析 人员
    gspCode5() {return "gsp.substandardReason"}, // 不合格药品 不合格原因
    gspCode6() {return "gsp.purchaseAbortDACode"}, // 采购退出--退出原因码表
    gspCode7() {return "gsp.returnFlowCode"} // 退货流向 --仓库码表
};