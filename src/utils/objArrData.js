/**
 * 粒度
 */
export function granularity() {
    return {
        name: "粒度",
        options: [{
                code: 1,
                name: "按年"
            },
            {
                code: 2,
                name: "按月"
            },
            {
                code: 3,
                name: "按天"
            }
        ]
    };
}


/**
 * 字段对照表
 */
export function nameCodeObj() {
    return [{
            name: "日期",
            code: "time"
        }, {
            name: "会员数量(个)",
            code: "memberNum"
        }, {
            name: "销售总额(元)",
            code: "countMoney"
        }, {
            name: "销售总额(元)",
            code: "saleMoney"
        }, {
            name: "销售区域(省)",
            code: "provinceName"
        }, {
            name: "销售区域(市)",
            code: "cityName"
        }, {
            name: "销售区域(区)",
            code: "countyName"
        }, {
            name: "会员等级",
            code: "userRankName"
        }, {
            name: "品种(一大类)",
            code: "firstTypeName"
        }, {
            name: "品种(二大类)",
            code: "secondTypeName"
        }, {
            name: "品种(三大类)",
            code: "threeTypeName"
        }, {
            name: "总金额(元)",
            code: "payMoney"
        }, {
            name: "订单数量(个)",
            code: "orderNum"
        }, {
            name: "部门名称",
            code: "deptName"
        }, {
            name: "部门名称",
            code: "departmentName"
        }, {
            name: "部门名称",
            code: "bmName"
        }, {
            name: "业务员名称",
            code: "salesmanName"
        }, {
            name: "品种类型(大类)",
            code: "primaryCategory"
        }, {
            name: "品种类型(大类)",
            code: "subCategory"
        }, {
            name: "欠款(元)",
            code: "debt"
        }, {
            name: "回款(元)",
            code: "income"
        }, {
            name: "客户数量(个)",
            code: "customerCounts"
        }, {
            name: "客户类型(第一大类)",
            code: "primaryCustomerType"
        }, {
            name: "客户类型(第二大类)",
            code: "subCustomerType"
        }, {
            name: "日期",
            code: "date"
        },
        // {
        //     name: "客户数量(个)",
        //     code: "formscustomerCounts"
        // },
        {
            name: "含税收入(元)",
            code: "incomeOfTax"
        }, {
            name: "不含税收入(元)",
            code: "incomeOfNoneTax"
        }, {
            name: "含税成本(元)",
            code: "costOfTax"
        }, {
            name: "不含税成本(元)",
            code: "costOfNoneTax"
        }, {
            name: "品种数量(个)",
            code: "medicineCount"
        }, {
            name: "销售渠道",
            code: "saleChannelName"
        }, {
            name: "供应商类型(第一大类)",
            code: "primarySupplierType"
        }, {
            name: "供应商类型(第二大类)",
            code: "subSupplierType"
        }, {
            name: "采购渠道(第一大类)",
            code: "primaryPurchaseChannel"
        }, {
            name: "采购渠道(第二大类)",
            code: "subPurchaseChannel"
        }, {
            name: "客户数量(个)",
            code: "customerNumber"
        }, {
            name: "购买家数(个)",
            code: "customerNum"
        }, {
            name: "销售数量(个)",
            code: "saleNum"
        }, {
            name: "含税收入(元)",
            code: "taxIncome"
        }, {
            name: "不含税收入(元)",
            code: "noTaxIncome"
        }, {
            name: "销售折让(不含税)(元)",
            code: "noTaxSaleDiscount"
        }, {
            name: "收入净额(元)",
            code: "pureIncome"
        }, {
            name: "不含税成本(元)",
            code: "noTaxCost"
        }, {
            name: "采购返利(不含税)",
            code: "noTaxPurchaseBenefit"
        }, {
            name: "成本净额(元)",
            code: "pureCost"
        }, {
            name: "收入净额占比(%)",
            code: "pureIncomeProportion"
        }, {
            name: "毛利额(元)",
            code: "roughProfit"
        }, {
            name: "毛利率(%)",
            code: "roughProfitRate"
        }, {
            name: "毛利额占比(%)",
            code: "roughProfitProportion"
        }, {
            name: "品种类型大类",
            code: "primaryCategoryType"
        }, {
            name: "品种类型小类",
            code: "subCategoryType"
        }, {
            name: "品种数量(个)",
            code: "categoryNumber"
        }, {
            name: "利润等级",
            code: "profitLevel"
        }, {
            name: "客户编号",
            code: "customerNo"
        }, {
            name: "客户名称",
            code: "customerName"
        }, {
            name: "客户地区",
            code: "provinceName"
        }, {
            name: "含税金额(元)",
            code: "taxAmount"
        }, {
            name: "不含税金额(元)",
            code: "noTaxAmount"
        }, {
            name: "含税采购返利(元)",
            code: "taxPurchaseBenefit"
        }, {
            name: "不含税采购返利(元)",
            code: "noTaxPurchaseBenefit"
        }, {
            name: "采购净额(元)",
            code: "purePurchaseAmount"
        }, {
            name: "支付类型",
            code: "payTypeName"
        }
    ];
}

export function CFOcode() {
    return [{
        name: "销售渠道",
        code: "saleChannelName"
    }, {
        name: "日期",
        code: "date"
    }, {
        name: "客户数量(个)",
        code: "formscustomerCounts"
    }, {
        name: "含税收入(元)",
        code: "incomeOfTax"
    }, {
        name: "不含税收入(元)",
        code: "incomeOfNoneTax"
    }, {
        name: "含税成本(元)",
        code: "costOfTax"
    }, {
        name: "不含税成本(元)",
        code: "costOfNoneTax"
    }, {
        name: "品种数量(个)",
        code: "medicineCount"
    }, {
        name: "供应商类型大类",
        code: "primarySupplierType"
    }, {
        name: "供应商类型小类",
        code: "subSupplierType"
    }, {
        name: "采购渠道大类",
        code: "primaryPurchaseChannel"
    }, {
        name: "采购渠道小类",
        code: "subPurchaseChannel"
    }, {
        name: "客户数量(个)",
        code: "customerNumber"
    }, {
        name: "含税收入(元)",
        code: "taxIncome"
    }, {
        name: "不含税收入(元)",
        code: "noTaxIncome"
    }, {
        name: "不含税销售折让(元)",
        code: "noTaxSaleDiscount"
    }, {
        name: "收入净额(元)",
        code: "pureIncome"
    }, {
        name: "不含税成本(元)",
        code: "noTaxCost"
    }, {
        name: "不含税采购返利(元)",
        code: "noTaxPurchaseBenefit"
    }, {
        name: "成本净额(元)",
        code: "pureCost"
    }, {
        name: "收入净额占比(%)",
        code: "pureIncomeProportion"
    }, {
        name: "毛利额(元)",
        code: "roughProfit"
    }, {
        name: "毛利率(%)",
        code: "roughProfitRate"
    }, {
        name: "毛利额占比(%)",
        code: "roughProfitProportion"
    }, {
        name: "品种类型大类",
        code: "primaryCategoryType"
    }, {
        name: "品种类型小类",
        code: "subCategoryType"
    }, {
        name: "利润等级",
        code: "profitLevel"
    }, {
        name: "毛利率(%)",
        code: "roughProfitRate"
    }, {
        name: "客户编号",
        code: "customerNo"
    }, {
        name: "客户名称",
        code: "customerName"
    }, {
        name: "客户地区",
        code: "provinceName"
    }, {
        name: "客户大类",
        code: "primaryCustomerType"
    }, {
        name: "客户小类",
        code: "subCustomerType"
    }, {
        name: "合作性质",
        code: "cooperationKind"
    }]
}

export function WMScode() {
    return [{
            name: "日期",
            code: "time"
        },
        {
            name: "日均条目数",
            code: "counts"
        },
        {
            name: "收货上架及时率(整件)",
            code: "rateOfWhole"
        },
        {
            name: "收货上架及时率(散件)",
            code: "rateOfSpare"
        },
        {
            name: "出库及时率",
            code: "rate"
        },
        {
            name: "破损率",
            code: "damageRate"
        },
        {
            name: "损失金额(元)",
            code: "damageMoney"
        },
        {
            name: "仓库",
            code: "name"
        },
        {
            name: "金额(元)",
            code: "amount"
        },
        {
            name: "占比(%)",
            code: "proportion"
        },
        {
            name: "仓库数量(件)",
            code: "num"
        },
        {
            name: "整件(件)",
            code: "wholeNum"
        },
        {
            name: "散件(条目)",
            code: "spareNum"
        },
        {
            name: "个人小时效率(整件)",
            code: "countsOfWhole"
        },
        {
            name: "个人小时效率(散件)",
            code: "countsOfSpare"
        },
        
    ]
}

export function TMScode() {
    return [{
            name: "日期",
            code: "time"
        },
        {
            name: "日期",
            code: "date"
        },
        {
            name: "网点",
            code: "departments"
        },
        {
            name: "合纵货物数",
            code: "cargos"
        },
        {
            name: "省份",
            code: "provinceName"
        },
        {
            name: "城市",
            code: "cityName"
        },
        {
            name: "地区",
            code: "countyName"
        },
        {
            name: "送货量(件)",
            code: "amount"
        },
        {
            name: "人员",
            code: "staffName"
        },
        {
            name: "收货散件条目数",
            code: "scatteredCount"
        },
        {
            name: "收货整件件数",
            code: "intactItemCount"
        },
        {
            name: "收货整件条目数",
            code: "intactCount"
        },
        
    ]
}

export function GSPcode() {
    return [{
            name: "日期",
            code: "time"
        },
        {
            name: "日期",
            code: "date"
        },
        {
            name: "人员",
            code: "staffName"
        },
        {
            name: "药品类型",
            code: "medicineTypeName"
        },
        {
            name: "收货散件条目数",
            code: "scatteredItem"
        },
        {
            name: "收货整件件数",
            code: "intactPackItem"
        },
        {
            name: "收货整件条目数",
            code: "intactPack"
        },
        {
            name: "往来单位",
            code: "wldw"
        },
        {
            name: "拒收次数",
            code: "times"
        },
        {
            name: "商品编码",
            code: "spId"
        },
        {
            name: "商品名称",
            code: "spName"
        },
        {
            name: "商品规格",
            code: "spGg"
        },
        {
            name: "生产厂家",
            code: "spProducer"
        },
        {
            name: "生产厂家",
            code: "producer"
        },
        {
            name: "批号",
            code: "spPih"
        },
        {
            name: "批号",
            code: "pihao"
        },
        {
            name: "商品单位",
            code: "spDw"
        },
        {
            name: "商品单位",
            code: "spUnit"
        },
        {
            name: "拒收数量",
            code: "num"
        },
        {
            name: "拒收原因",
            code: "spReason"
        },
        {
            name: "拒收原因",
            code: "jusyy"
        },
        {
            name: "往来单位",
            code: "spWldw"
        },
        {
            name: "商品类别",
            code: "spType"
        },
        {
            name: "退回数量",
            code: "returnNum"
        },
        {
            name: "退回原因",
            code: "reason"
        },
        {
            name: "退回入库区",
            code: "returnToKq"
        },
        {
            name: "含税金额",
            code: "amount"
        },
        {
            name: "类别",
            code: "spTypeName"
        },
        {
            name: "验收整件条目",
            code: "intactPackItemCount"
        },
        {
            name: "验收散件条目",
            code: "scatteredItemCount"
        },
        {
            name: "验收整件件数",
            code: "intactPackCount"
        },
        {
            name: "整件条目数",
            code: "yanshouZjtm"
        },
        {
            name: "散件条目数",
            code: "yanshouSjtm"
        },
        {
            name: "操作员",
            code: "operatorName"
        },
        {
            name: "整件件数",
            code: "jianshu"
        },
        {
            name: "条目数",
            code: "pack"
        },
        {
            name: "业务员",
            code: "salesmanName"
        },
        {
            name: "频次",
            code: "frequency"
        },
        {
            name: "含税金额",
            code: "hansje"
        },
        {
            name: "往来单位",
            code: "wldwName"
        },
        {
            name: "仓库",
            code: "warehouseName"
        },
        {
            name: "品种",
            code: "breed"
        },
        {
            name: "数量",
            code: "shul"
        },
        {
            name: "原因",
            code: "reasonName"
        },
        {
            name: "品种数",
            code: "spCount"
        },
        {
            name: "在库时长",
            code: "stockTime"
        },
        {
            name: "数量",
            code: "number"
        },
        {
            name: "数量占比",
            code: "proportion"
        },
        {
            name: "退回原因",
            code: "abortReason"
        },
        {
            name: "退回次数",
            code: "abortCount"
        },
        {
            name: "移出库",
            code: "outWarehouse"
        },
        {
            name: "移入库",
            code: "inWarehouse"
        },
        {
            name: "移入时间",
            code: "inTime"
        },
        {
            name: "移出时间",
            code: "outTime"
        },
        {
            name: "不合格原因",
            code: "substandardReason"
        },
        {
            name: "出现质量问题次数",
            code: "problemTimes"
        },
        {
            name: "商品规格",
            code: "spStandard"
        },
        {
            name: "采退数量",
            code: "puNumber"
        },
        {
            name: "采退库区",
            code: "puWarehouse"
        },
        {
            name: "类别",
            code: "ypType"
        },
        {
            name: "生产企业",
            code: "producer"
        },
        {
            name: "召回数量",
            code: "recallNumber"
        },
        {
            name: "销售退回单位",
            code: "recallUnit"
        },
        {
            name: "召回发布日期",
            code: "recallDate"
        },
        {
            name: "销售退回验收收货日期",
            code: "recallAcceptanceDate"
        },
        {
            name: "召回耗时",
            code: "duration"
        },
        {
            name: "开票员",
            code: "kaipy"
        },
        {
            name: "地区",
            code: "regionName"
        },
        {
            name: "召回品种数量",
            code: "recallSpCount"
        },
        {
            name: "召回平均时间",
            code: "recallAvgDuration"
        },
        {
            name: "购进数量",
            code: "purchaseNumber"
        },
        {
            name: "购进日期",
            code: "purchaseDate"
        },
        {
            name: "购进单位",
            code: "purchaseUnit"
        },
        {
            name: "销售日期",
            code: "salesDate"
        },
        {
            name: "销往单位",
            code: "customerName"
        },
        {
            name: "销售数量",
            code: "salesNumber"
        },
        {
            name: "库存数量",
            code: "stockNumber"
        },
        {
            name: "购进单位是否生产企业",
            code: "isCustomerProducer"
        },
        {
            name: "客户类型",
            code: "customerType"
        },
        {
            name: "购买次数",
            code: "buyCount"
        },
        {
            name: "购买数量",
            code: "buyNumber"
        },
        {
            name: "客户",
            code: "consumerName"
        },
        {
            name: "来源库区",
            code: "fromWarehouse"
        },
        {
            name: "不合格原因",
            code: "subStandardReason"
        }
    ]
}