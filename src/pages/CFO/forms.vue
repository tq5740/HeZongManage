<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-if="!showHeader">筛选条件</p>
      <el-radio-group v-else v-model="timeDimension" size="mini" style="float: left; margin-left: 20px" @change="changeTime">
        <el-radio-button :label="1">年报</el-radio-button>
        <el-radio-button :label="2">月报</el-radio-button>
      </el-radio-group>
      <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}
      </el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <div>
          <p class="title">分析维度</p>
          <div v-if="haveSelect">
            <div v-for="(item, index) in selectNum" :key="item" class="selectBox">
              <p class="index-css index123 no">{{index+1}}</p>
              <selectForm :defaultIsSelect="defaultIsSelect" :index="index" style="float: left;"></selectForm>
              <el-form :inline="true">
                <el-form-item label="查看"></el-form-item>
                <el-form-item>
                  <el-button type="warning" plain icon="el-icon-remove" @click="delSelect(item, index)" v-if="selectNum.length > 0">减去维度</el-button>
                  <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(index)"
                    v-if="selectNum.length < defaulted.selectArr.length && selectNum.length === index + 1">添加维度</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(-1)" v-if="selectNum.length === 0" style="margin-bottom: 20px; margin-left: 20px;">添加维度
          </el-button>
        </div>
        <div v-if="nowPageNum == 0">
          <p class="title">数据范围</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item label="按">
                <selectComponent :options="[{name:'公司',code:1}]" v-model="isSelect1" width="110px"></selectComponent>
              </el-form-item>
              <el-form-item label="等于">
                <selectComponent :options="[{name:'全部',code:-1},{name:'母公司',code:50},{name:'健康之家直营店',code:20}]" v-model="dataRange" width="160px"></selectComponent>
              </el-form-item>
              <el-form-item label="查看">
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item>
                <div v-if="timeDimension === 2">
                  <datePickerComponent v-model="fromDate" type="monthrange" valueFormat="yyyy/MM" format="yyyy/MM"></datePickerComponent>
                </div>
                <div v-else class="year-class">
                  <datePickerComponent v-model="fromDate[0]" type="year" valueFormat="yyyy" format="yyyy"></datePickerComponent>
                  <p>-</p>
                  <datePickerComponent v-model="fromDate[1]" type="year" valueFormat="yyyy" format="yyyy"></datePickerComponent>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="search" :loading="formsLoading">搜索</el-button>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="formsLoading">
      <formsComponent :dataList="dataList" :headTable="headTable"></formsComponent>
    </div>
  </div>
</template>

<script>
import selectForm from "@c/SelectForm.vue";
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import formsComponent from "@c/FormsComponent.vue";
import { granularity } from "@utils/objArrData";
import { getDaysBefore } from "@utils/index";
import All from "@api/all";

export default {
  components: {
    selectForm,
    selectComponent,
    datePickerComponent,
    formsComponent
  },
  data() {
    return {
      showHeader: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      orderColumns: [],
      granularity: granularity(),
      isSelect1: 1,
      dataRange: -1,
      fromDate: [],
      defaultIsSelect: {},
      selectNum: [],
      dimensionOrder: [],
      headTable: [],
      headList: [],
      headFirstObj: {},
      dataList: [],
      timeDimension: 1,
      formsLoading: false,
      showPage: false,
      isSelected: {},
      haveSelect: false,
      CFO0Code: {
        i1: "saleChannel",
        i2: "erpRegion",
        i3: "customerType",
        // i4: "purchaseChannel"
      },
      CFO1Code: {
        i1: "saleChannel",
        i2: "medicineType",
        i3: "profitLevel",
        i4: "medicineOtcType"
      },
      CFO2Code: {
        i1: "supplierType",
        i2: "erpRegion"
      },
      CFO3Code: {
        i1: "medicineType"
      },
      CFO4Code: {
        i1: "purchaseChannel"
      },
      CFO5Code: {
        i1: "medicineType"
      },
      selected: {},
      selectedArr: [],
      defaultSelected: {
        saleChannel: -1,
        dept: -1,
        profitLevel: -1,
        medicineOtcType: -1,
        ecsUserRank: -1,
        ecsDept: -1,
        ecsPayment: -1,
        ecsRegion: -1,

        customerType: [-1],
        supplierType: [-1],
        purchaseChannel: [-1],
        medicineType: [-1],
        ecsCategory: [-1]
      },
      mapKeyName: {},
      nowPageNum: null,
      hasSelect: []
    };
  },
  computed: {
    defaulted() {
      return this.$store.state.defaulted;
    },
    optionsDisabled() {
      return this.selectName.optionsDisabled;
    },
    cfoTime() {
      return this.$store.state.cfoTime;
    },
    isMonth() {
      return this.$store.state.cfoTime.isMonth;
    }
  },
  watch: {
    $route: {
      handler: "init",
      immediate: true
    }
  },
  methods: {
    init() {
      this.getData();
      this.pageSize = 10;
      this.pageNum = 1;
      this.selected = {};
      this.selectedArr = [];
      this.timeDimension = this.isMonth ? 2 : 1;
      this.fromDate = this.cfoTime.time();
      this.getSelected();
      this.$nextTick(() => {    // 为了获取组件返回的dimensionOrder，延迟执行
        this.getTable();
      })
    },
    getData() {
      let str = this.$route.path;
      let num = str[str.length - 1];
      this.nowPageNum = num;
      let e = this.$store.state.CFOlistData[num];
      this.$store.commit("setDefaulted", e);
    },
    getHead() {
      if (this.nowPageNum == 0) {
        this.headFirstObj = {
          1: [
            {
              text: "销售渠道",
              field: "saleChannel"
            }
          ],
          2: [
            {
              text: "客户地区(省)",
              field: "provinceName"
            }
          ],
          3: [
            {
              text: "客户大类",
              field: "primaryCustomerType"
            },
            {
              text: "客户小类",
              field: "subCustomerType"
            }
          ],
          4: [
            {
              text: "采购渠道(大类)",
              field: "primaryPurchaseChannel"
            },
            {
              text: "采购渠道(小类)",
              field: "subPurchaseChannel"
            }
          ]
        };
        this.headList = [
          {
            text: "客户数量",
            field: "customerNumber"
          },
          {
            text: "含税收入(元)",
            field: "taxIncome"
          },
          {
            text: "不含税收入(元)",
            field: "noTaxIncome"
          },
          {
            text: "不含税销售折让(元)",
            field: "noTaxSaleDiscount"
          },
          {
            text: "收入净额(元)",
            field: "pureIncome"
          },
          {
            text: "收入净额占比(%)",
            field: "pureIncomeProportion"
          },
          {
            text: "不含税成本(元)",
            field: "noTaxCost"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "成本净额(元)",
            field: "pureCost"
          },
          {
            text: "毛利额(元)",
            field: "roughProfit"
          },
          {
            text: "毛利额占比(%)",
            field: "roughProfitProportion"
          },
          {
            text: "毛利率(%)",
            field: "roughProfitRate"
          }
        ];
      } else if (this.nowPageNum == 1) {
        this.headFirstObj = {
          1: [
            {
              text: "销售渠道",
              field: "saleChannel"
            }
          ],
          2: [
            {
              text: "品种大类",
              field: "primaryCategoryType"
            },
            {
              text: "品种小类",
              field: "subCategoryType"
            }
          ],
          3: [
            {
              text: "利润等级",
              field: "profitLevel"
            }
          ],
          4: [
            {
              text: "OTC类型",
              field: "otcType"
            }
          ]
        };
        this.headList = [
          {
            text: "品种数量",
            field: "categoryNumber"
          },
          {
            text: "含税收入(元)",
            field: "taxIncome"
          },
          {
            text: "不含税收入(元)",
            field: "noTaxIncome"
          },
          {
            text: "不含税销售折让(元)",
            field: "noTaxSaleDiscount"
          },
          {
            text: "收入净额(元)",
            field: "pureIncome"
          },
          {
            text: "收入净额占比",
            field: "pureIncomeProportion"
          },
          {
            text: "不含税成本(元)",
            field: "noTaxCost"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "成本净额(元)",
            field: "pureCost"
          },
          {
            text: "毛利率",
            field: "roughProfitRate"
          }
        ];
      } else if (this.nowPageNum == 2) {
        this.headFirstObj = {
          1: [
            {
              text: "供应商大类",
              field: "primarySupplierType"
            },
            {
              text: "供应商小类",
              field: "subSupplierType"
            }
          ],
          2: [
            {
              text: "供应商区域",
              field: "provinceName"
            }
          ]
        };
        this.headList = [
          {
            text: "供应商家数",
            field: "supplierNumber"
          },
          {
            text: "含税金额(元)",
            field: "taxAmount"
          },
          {
            text: "不含税金额(元)",
            field: "noTaxAmount"
          },
          {
            text: "含税采购返利(元)",
            field: "taxPurchaseBenefit"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "采购净额(元)",
            field: "purePurchaseAmount"
          }
        ];
      } else if (this.nowPageNum == 3) {
        this.headFirstObj = {
          1: [
            {
              text: "品种大类",
              field: "primaryCategoryType"
            },
            {
              text: "品种小类",
              field: "subCategoryType"
            }
          ]
        };
        this.headList = [
          {
            text: "品种数量",
            field: "categoryNumber"
          },
          {
            text: "含税采购额(元)",
            field: "taxAmount"
          },
          {
            text: "不含税采购额(元)",
            field: "noTaxAmount"
          },
          {
            text: "含税采购返利(元)",
            field: "taxPurchaseBenefit"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "采购净额(元)",
            field: "purePurchaseAmount"
          },
          {
            text: "采购净额占比(%)",
            field: "purePurchaseAmountProportion"
          }
        ];
      } else if (this.nowPageNum == 4) {
        this.headFirstObj = {
          1: [
            {
              text: "采购渠道(大类)",
              field: "primaryPurchaseChannel"
            },
            {
              text: "采购渠道(小类)",
              field: "subPurchaseChannel"
            }
          ]
        };
        this.headList = [
          {
            text: "品种数量",
            field: "categoryNumber"
          },
          {
            text: "含税采购额(元)",
            field: "taxAmount"
          },
          {
            text: "不含税采购额(元)",
            field: "noTaxAmount"
          },
          {
            text: "含税采购返利(元)",
            field: "taxPurchaseBenefit"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "采购净额(元)",
            field: "purePurchaseAmount"
          },
          {
            text: "采购净额占比(%)",
            field: "purePurchaseAmountProportion"
          }
        ];
      } else if (this.nowPageNum == 5) {
        this.headFirstObj = {
          1: [
            {
              text: "品种大类",
              field: "primaryCategoryType"
            },
            {
              text: "品种小类",
              field: "subCategoryType"
            }
          ]
        };
        this.headList = [
          {
            text: "品种数量",
            field: "categoryNumber"
          },
          {
            text: "不含税金额(元)",
            field: "noTaxAmount"
          },
          {
            text: "含税采购返利(元)",
            field: "taxPurchaseBenefit"
          },
          {
            text: "不含税采购返利(元)",
            field: "noTaxPurchaseBenefit"
          },
          {
            text: "存货净额(元)",
            field: "pureStockAmount"
          },
          {
            text: "存货净额占比",
            field: "pureStockAmountProportion"
          }
        ];
      }
      let headArr = [];
      console.log(this.dimensionOrder)
      this.dimensionOrder.forEach((item, index) => {
        headArr.push(...this.headFirstObj[item]);
      });
      this.headList = [...headArr, ...this.headList];
      this.headList.unshift({
        text: "日期",
        field: "date"
      });
    },
    getTable() {
      this.getHead();
      this.formsLoading = true;
      this.dataList = [];
      let params = {
        dimensionOrder: this.dimensionOrder,
        orderColumns: this.orderColumns,
        ...this.isSelected
      };
      if (this.nowPageNum == 0) {
        params.dataRange = this.dataRange;
      }
      params.timeDimension = this.timeDimension;
      params.startDate = this.$GetApiTime(this.fromDate[0]);
      params.endDate = this.$GetApiTime(this.fromDate[1]);
      All.postAPI({
        method: this.defaulted.method,
        params: params
      })
        .then(res => {
          if (res.length) {
            let hArr = []
            for (let i = 0; i < this.headList.length; i++) {
              if (this.headList[i].field in res[0]) {
                this.headList[i].sortable = this.headList[i].field;
                hArr.push(this.headList[i])
              }
            }
            this.headTable = hArr;
            this.dataList = res;
          } else {
            this.headTable = [];
            this.dataList = [];
            this.$Notif({
              title: "提示",
              message: "当前筛选条件下暂无数据",
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.headTable = [];
          this.dataList = [];
        })
        .finally(() => {
          this.formsLoading = false;
        });
    },
    getFormsList(arr) {
      if (arr.length) {
        arr;
      }
    },
    getSelected() {
      if (
        JSON.stringify(this.defaulted.select) !== "{}" &&
        this.defaulted.selectArr.length
      ) {
        this.haveSelect = true;
        this.defaultIsSelect = this.defaulted.select;
        let code = this.defaultIsSelect.code;
        this.selected[code] = this.defaultSelected[code];
        this.selectNum = [this.defaulted.select.name + "," + Date.now()];
      } else {
        this.haveSelect = false;
        this.selectNum = [];
      }
      this.getIsSelected();
    },
    addSelect(index) {
      if (
        this.selectNum.length < this.defaulted.selectArr.length ||
        this.selectNum.length === 0
      ) {
        this.selectNum.push(
          this.defaulted.selectArr[index + 1].name + "," + Date.now()
        );
        this.defaultIsSelect = this.defaulted.selectArr[index + 1];
        this.haveSelect = true;
      }
    },
    delSelect(item, index) {
      if (this.selectNum.length > 0) {
        this.selectNum.splice(index, 1);
        this.selectedArr.splice(index, 1);
        this.dimensionOrder.splice(index, 1);
        this.hasSelect.splice(index, 1);
        this.selected = {};
      }
    },
    getIsSelected() {
      let obj = {};
      for (let i = 0; i < this.selectedArr.length; i++) {
        // console.log(this.selectedArr);
        let item = this.selectedArr[i];
        if (item) {
          Object.keys(item).forEach(j => {
            let key;
            if (this.defaulted.fromWhere === "CFO0") {
              key = this.CFO0Code[j];
            } else if (this.defaulted.fromWhere === "CFO1") {
              key = this.CFO1Code[j];
            } else if (this.defaulted.fromWhere === "CFO2") {
              key = this.CFO2Code[j];
            } else if (this.defaulted.fromWhere === "CFO3") {
              key = this.CFO3Code[j];
            } else if (this.defaulted.fromWhere === "CFO4") {
              key = this.CFO4Code[j];
            } else if (this.defaulted.fromWhere === "CFO5") {
              key = this.CFO5Code[j];
            }
            this.selected[key] = item[j];
          });
        }
      }
      // console.log(this.selected);
      Object.keys(this.selected).forEach(i => {
        if (
          (this.selected[i] && typeof this.selected[i] === "string") ||
          typeof this.selected[i] === "number" ||
          this.selected[i] === 0
        ) {
          if (i === "erpRegion") {
            obj.regionProvince = this.selected[i];
          } else if (i === "medicineOtcType") {
            obj.otcType = this.selected[i];
          } else if (i.substring(0, 3) === "erp") {
            let right = i.substring(4);
            let left = i.substring(3, 4).toLowerCase();
            let str = left + right;
            obj[str] = this.selected[i];
          } else {
            obj[i] = this.selected[i];
          }
        } else if (this.selected[i] && this.selected[i].length !== 0) {
          let arr = this.selected[i];
          if (i === "customerType") {
            if (arr.length === 1) {
              obj.primaryCustomerType = arr[0];
            } else if (arr.length === 2) {
              obj.primaryCustomerType = arr[0];
              obj.subCustomerType = arr[1];
            }
          } else if (i === "supplierType") {
            if (arr.length === 1) {
              obj.primarySupplierType = arr[0];
            } else if (arr.length === 2) {
              obj.primarySupplierType = arr[0];
              obj.subSupplierType = arr[1];
            }
          } else if (i === "purchaseChannel") {
            if (arr.length === 1) {
              obj.primaryPurchaseChannel = arr[0];
            } else if (arr.length === 2) {
              obj.primaryPurchaseChannel = arr[0];
              obj.subPurchaseChannel = arr[1];
            }
          } else if (i === "medicineType") {
            if (arr.length === 1) {
              obj.primaryCategoryType = arr[0];
            } else if (arr.length === 2) {
              obj.primaryCategoryType = arr[0];
              obj.subCategoryType = arr[1];
            }
          } else if (i.substring(0, 3) === "erp") {
            let right = i.substring(4);
            let left = i.substring(3, 4).toLowerCase();
            let str = left + right;
            obj[str] = this.selected[i][0];
          } else {
            obj[i] = this.selected[i][0];
          }
        }
      });
      this.isSelected = obj;
      console.log(this.isSelected);
    },
    search() {
      if (new Set(this.hasSelect).size !== this.hasSelect.length) {
        this.$Notif({
          title: "提示",
          message: `不能选择相同维度`,
          type: "warning"
        });
        return;
      }
      // this.orderColumns = []; // 清空排序
      this.getIsSelected();
      this.getTable();
    },
    // 排序回调
    sortableChange({ order, prop }) {
      switch (order) {
        case "ascending":
          this.orderColumns = [`${prop}=asc`];
          break;
        case "descending":
          this.orderColumns = [`${prop}=desc`];
          break;
        default:
          this.orderColumns = [];
      }
      this.getTable();
    },
    downLoad() {
      let method;
      if (this.nowPageNum == 0) {
        method = All.financeExport0()
      } else if (this.nowPageNum == 1) {
        method = All.financeExport1()
      } else if (this.nowPageNum == 2) {
        method = All.financeExport2()
      } else if (this.nowPageNum == 3) {
        method = All.financeExport3()
      } else if (this.nowPageNum == 4) {
        method = All.financeExport4()
      } else if (this.nowPageNum == 5) {
        method = All.financeExport5()
      }
      let params = {
        dimensionOrder: this.dimensionOrder,
        orderColumns: this.orderColumns,
        ...this.isSelected
      };
      if (this.nowPageNum == 0) {
        params.dataRange = this.dataRange;
      }
      params.timeDimension = this.timeDimension;
      params.startDate = this.$GetApiTime(this.fromDate[0]);
      params.endDate = this.$GetApiTime(this.fromDate[1]);
      this.$GetDownload(method, params);
    },
    changeTime(val) {
      if (val === 1) {
        this.$store.commit("setCfoMonth", false);
      } else {
        this.$store.commit("setCfoMonth", true);
      }
      this.fromDate = this.cfoTime.time();
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.year-class {
  p {
    margin: 0 10px;
    float: left;
  }
  #dateRange {
    width: 100px;
    float: left;
  }
}
</style>