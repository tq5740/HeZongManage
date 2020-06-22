<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-if="!showHeader">筛选条件</p>
      <el-radio-group v-else v-model="timeDimension" size="mini" style="float: left; margin-left: 20px" @change="changeTime">
        <el-radio-button :label="1">年报</el-radio-button>
        <el-radio-button :label="2">月报</el-radio-button>
      </el-radio-group>
      <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <el-form :inline="true">
          <el-form-item label="选择时间 :">
            <div v-if="timeDimension === 2">
              <datePickerComponent v-model="fromDate" type="monthrange" valueFormat="yyyy/MM" format="yyyy/MM"></datePickerComponent>
            </div>
            <div v-else class="year-class">
              <datePickerComponent v-model="fromDate[0]" type="year" valueFormat="yyyy" format="yyyy"></datePickerComponent>
              <p>-</p>
              <datePickerComponent v-model="fromDate[1]" type="year" valueFormat="yyyy" format="yyyy"></datePickerComponent>
            </div>
          </el-form-item>
          <el-form-item label="销售渠道 :" v-if="nowPageNum === 0 || nowPageNum === 1">
            <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
          </el-form-item>
          <el-form-item label="公司 :" v-if="nowPageNum === 0">
            <selectComponent :options="[{name:'全部',code:-1},{name:'母公司',code:50},{name:'健康之家直营店',code:20}]" v-model="companyRange" width="160px"></selectComponent>
          </el-form-item>
          <el-form-item label="客户类型 :" v-if="nowPageNum === 0">
            <cascaderComponent v-model="selected.customerType" :props="lazy(All.codeCustomerType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="客户地区 :" v-if="nowPageNum === 0">
            <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion" firstOption="四川省"></selectComponent>
          </el-form-item>
          <el-form-item label="品种类型 :" v-if="nowPageNum === 1 || nowPageNum === 3 || nowPageNum === 5">
            <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="利润等级 :" v-if="nowPageNum === 1 || nowPageNum === 3">
            <selectComponent v-model="selected.profitLevel" :options="selectOptions.profitLevel"></selectComponent>
          </el-form-item>
          <el-form-item label="OTC类型 :" v-if="nowPageNum === 1 || nowPageNum === 3">
            <selectComponent v-model="selected.medicineOtcType" :options="selectOptions.medicineOtcType"></selectComponent>
          </el-form-item>
          <el-form-item label="供应商类型 :" v-if="nowPageNum === 2">
            <cascaderComponent v-model="selected.supplierType" :props="lazy(All.codeSupplierType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="供应商地区 :" v-if="nowPageNum === 2">
            <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion" firstOption="四川省"></selectComponent>
          </el-form-item>
          <el-form-item label="采购渠道 :" v-if="nowPageNum === 4">
            <cascaderComponent v-model="selected.purchaseChannel" :props="lazy(All.codePurchaseChannel())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="客户编号/名称 :" v-if="nowPageNum === 0">
            <el-input v-model="customerNoOrName" placeholder="请输入客户编号/名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="品种编号/名称 :" v-if="nowPageNum === 1 || nowPageNum === 3 || nowPageNum === 4">
            <el-input v-model="categoryNoOrName" placeholder="请输入品种编号/名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="供应商编号/名称 :" v-if="nowPageNum === 2">
            <el-input v-model="supplierNoOrName" placeholder="请输入供应商编号/名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="品种编号/名称 :" v-if="nowPageNum === 5">
            <el-input v-model="searchKeyWord" placeholder="请输入品种编号/名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="tableLoading">
      <tableComponent :dataList="dataList" :headTable="headTable" border from="CFO"></tableComponent>
    </div>
  </div>
</template>

<script>
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import cascaderComponent from "@c/CascaderComponent.vue";
import { CFOcode } from "@utils/objArrData";
import All from "@api/all";

export default {
  components: {
    selectComponent,
    datePickerComponent,
    tableComponent,
    cascaderComponent
  },
  data() {
    return {
      All: All,
      showHeader: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      orderColumns: [],
      CFOcode: CFOcode(),
      companyRange: -1,
      fromDate: [],
      headTable: [],
      dataList: [],
      tableLoading: false,
      nowPageNum: null,
      selectOptions: {},
      selected: {},
      isSelected: [],
      customerNoOrName: "",
      categoryNoOrName: "",
      supplierNoOrName: "",
      searchKeyWord: "",
      timeDimension: 1,
      CFOlist: [
        {
          method: All.cfoCustomerSaleDetail()
        },
        {
          method: All.cfoCategorySaleDetail()
        },
        {
          method: All.cfoSupplierPurchaseDetail()
        },
        {
          method: All.cfoCategoryPurchaseDetail()
        },
        {
          method: All.cfoChannelPurchaseDetail()
        },
        {
          method: All.cfoStockBalanceDetail()
        }
      ]
    };
  },
  computed: {
    defaulted() {
      return this.$store.state.defaulted;
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
  mounted() {
    let _this = this;
    window.addEventListener("message", function(e) {
      if (e && e.data && e.data.data === "refresh") {
        _this.init();
      }
    });
  },
  methods: {
    init() {
      this.timeDimension = this.isMonth ? 2 : 1;
      this.reset();
      this.getFatherData();
      this.getIsSelected();
      this.getTable();
    },
    reset() {
      let str = this.$route.path;
      let num = str[str.length - 1];
      this.nowPageNum = +num;
      this.fromDate = this.cfoTime.time();
      this.pageSize = 10;
      this.pageNum = 1;
      this.customerNoOrName = this.categoryNoOrName = this.supplierNoOrName = this.searchKeyWord =
        "";
      if (this.nowPageNum == 0) {
        this.selected = {
          saleChannel: -1,
          customerType: [-1],
          erpRegion: -1
        };
        this.selectOptions = {
          saleChannel: [
            {
              name: "全部",
              code: -1
            }
          ],
          erpRegion: [
            {
              name: "全部",
              code: -1
            }
          ]
        };
        this.headTable = [
          {
            text: "客户编号",
            field: "customerNo",
            width: "130px"
          },
          {
            text: "客户名称",
            field: "customerName",
            width: "200px"
          },
          {
            text: "客户地区",
            field: "provinceName",
            width: "130px"
          },
          {
            text: "客户大类",
            field: "primaryCustomerType",
            width: "130px"
          },
          {
            text: "客户小类",
            field: "subCustomerType",
            width: "130px"
          },
          {
            text: "合作性质",
            field: "cooperationKind"
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
            text: "含税成本(元)",
            field: "taxCost"
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
            text: "税率",
            field: "erpTaxRate"
          }
        ];
        this.getSelectOptions(All.codeErpRegion());
        this.getSelectOptions(All.codeAaleChannel());
      } else if (this.nowPageNum == 1) {
        this.selected = {
          saleChannel: -1,
          profitLevel: -1,
          medicineType: [-1],
          medicineOtcType: -1
        };
        this.selectOptions = {
          profitLevel: [
            {
              name: "全部",
              code: -1
            }
          ],
          medicineOtcType: [
            {
              name: "全部",
              code: -1
            }
          ]
        };
        this.headTable = [
          {
            text: "品种编号",
            field: "categoryNo",
            width: "110px"
          },
          {
            text: "品种名称",
            field: "categoryName"
          },
          {
            text: "品种规格",
            field: "categoryStandard",
            width: "150px"
          },
          {
            text: "单位",
            field: "unit",
            width: "80"
          },
          {
            text: "生产厂家",
            field: "producer"
          },
          {
            text: "品种大类",
            field: "primaryCategoryType",
            width: "140px"
          },
          {
            text: "品种小类",
            field: "subCategoryType",
            width: "130px"
          },
          {
            text: "利润等级",
            field: "profitLevel",
            width: "110px"
          },
          {
            text: "OTC类型",
            field: "otcType",
            width: "110px"
          },
          {
            text: "销售数量",
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
            text: "ERP税率",
            field: "erpTaxRate"
          }
        ];
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeProfitLevel());
        this.getSelectOptions(All.codeMedicineOtcType());
      } else if (this.nowPageNum == 2) {
        this.selected = {
          saleChannel: -1,
          supplierType: [-1],
          erpRegion: -1
        };
        this.selectOptions = {
          saleChannel: [
            {
              name: "全部",
              code: -1
            }
          ],
          erpRegion: [
            {
              name: "全部",
              code: -1
            }
          ]
        };
        this.headTable = [
          {
            text: "供应商编号",
            field: "supplierNo",
            width: "130"
          },
          {
            text: "供应商名称",
            field: "supplierName",
            width: "270"
          },
          {
            text: "供应商区域",
            field: "provinceName"
          },
          {
            text: "供应商大类",
            field: "primarySupplierType"
          },
          {
            text: "供应商小类",
            field: "subSupplierType"
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
        this.getSelectOptions(All.codeErpRegion());
        this.getSelectOptions(All.codeAaleChannel());
      } else if (this.nowPageNum == 3) {
        this.selected = {
          profitLevel: -1,
          medicineType: [-1],
          medicineOtcType: -1
        };
        this.selectOptions = {
          profitLevel: [
            {
              name: "全部",
              code: -1
            }
          ],
          medicineOtcType: [
            {
              name: "全部",
              code: -1
            }
          ]
        };
        this.headTable = [
          {
            text: "品种编号",
            field: "categoryNo",
            width: "110"
          },
          {
            text: "品种名称",
            field: "categoryName"
          },
          {
            text: "品种规格",
            field: "categoryStandard",
            width: "150"
          },
          {
            text: "品种单位",
            field: "unit",
            width: "110"
          },
          {
            text: "生产厂家",
            field: "producer"
          },
          {
            text: "品种大类",
            field: "primaryCategoryType"
          },
          {
            text: "品种小类",
            field: "subCategoryType",
            width: "110"
          },
          {
            text: "利润等级",
            field: "profitLevel",
            width: "110"
          },
          {
            text: "OTC类型",
            field: "otcType",
            width: "110"
          },
          {
            text: "采购数量",
            field: "categoryNumber"
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
        this.getSelectOptions(All.codeProfitLevel());
        this.getSelectOptions(All.codeMedicineOtcType());
      } else if (this.nowPageNum == 4) {
        this.selected = {
          purchaseChannel: [-1]
        };
        this.headTable = [
          {
            text: "品种编号",
            field: "categoryNo",
            width: "110"
          },
          {
            text: "品种名称",
            field: "categoryName"
          },
          {
            text: "品种规格",
            field: "categoryStandard"
          },
          {
            text: "品种单位",
            field: "unit"
          },
          {
            text: "生产厂家",
            field: "producer"
          },
          {
            text: "供应商编码",
            field: "supplierNo",
            width: "120"
          },
          {
            text: "直接供应商",
            field: "supplierName"
          },
          {
            text: "供应商类别",
            field: "subSupplierType",
            width: "120"
          },
          {
            text: "采购渠道(大类)",
            field: "primaryPurchaseChannel",
            width: "140"
          },
          {
            text: "采购渠道(小类)",
            field: "subPurchaseChannel",
            width: "140"
          },
          // {
          //   text: "采购员",
          //   field: "purchaseStaff",
          // },
          {
            text: "客户类型(大类)",
            field: "primarycustomerTypeName",
            width: "140"
          },
          {
            text: "客户类型(小类)",
            field: "subCustomerTypeName",
            width: "140"
          },
          {
            text: "采购数量",
            field: "categoryNumber",
            width: "110"
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
          }
        ];
      } else if (this.nowPageNum == 5) {
        this.selected = {
          medicineType: [-1]
        };
        this.headTable = [
          {
            text: "品种编号",
            field: "categoryNo",
            width: "110"
          },
          {
            text: "品种名称",
            field: "categoryName"
          },
          {
            text: "品种规格",
            field: "categoryStandard",
            width: "140"
          },
          {
            text: "单位",
            field: "unit",
            width: "90"
          },
          {
            text: "生产厂家",
            field: "producer"
          },
          {
            text: "品种大类",
            field: "primaryCategoryType",
            width: "140"
          },
          {
            text: "品种小类",
            field: "subCategoryType",
            width: "120"
          },
          {
            text: "机构结存数量",
            field: "agencyBalanceNumber",
            width: "140"
          },
          {
            text: "机构结存金额(元)",
            field: "agencyBalanceAmount"
          },
          // {
          //   text: "数量",
          //   field: "categoryNumber"
          // },
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
            text: "结存净额(元)",
            field: "pureBalanceAmount"
          }
        ];
      }
      this.dataList = [];
    },
    getFatherData() {
      let str = this.$route.fullPath.replace("mars-admin/", "");
      // console.log(this.$route.fullPath,str)
      let storage = this.$GetStorage(str);
      let date;
      if (storage) {
        let arr = Object.keys(storage);
        if (arr.length) {
          arr.forEach(i => {
            if (i in this.selected) {
              this.selected[i] = storage[i];
            }
          });
        }
        if (storage.timeDimension) {
          this.timeDimension = storage.timeDimension;
        }
        this.companyRange = storage.companyRange || this.companyRange;
        date = storage.date;
      }
      if (date) {
        date = date.toString();
        let arr = date.split("-");
        if (arr.length === 1) {
          this.fromDate = [date, date];
        } else if (arr.length === 2) {
          let time = date.replace("-", "/");
          this.fromDate = [time, time];
        }
      }
    },
    getSelectOptions(str) {
      All.postAPI({
        method: str
      }).then(res => {
        let arr = str.split(".");
        let name = arr[arr.length - 1];
        this.selectOptions[name] = res;
        this.selectOptions[name].unshift({ name: "全部", code: -1 });
        console.log(this.selectOptions.medicineOtcType)
      });
    },
    getIsSelected() {
      let obj = {};
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
        } else if (this.selected[i].length !== 0) {
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
    },
    getTable() {
      this.tableLoading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderColumns: this.orderColumns,
        ...this.isSelected
      };
      if (this.nowPageNum == 0) {
        params.companyRange = this.companyRange;
        params.customerNoOrName = this.customerNoOrName;
      }
      if (this.nowPageNum == 2) {
        params.supplierNoOrName = this.supplierNoOrName;
      }
      if (
        this.nowPageNum == 1 ||
        this.nowPageNum == 3 ||
        this.nowPageNum == 4
      ) {
        params.categoryNoOrName = this.categoryNoOrName;
      }
      if (this.nowPageNum == 5) {
        params.searchKeyWord = this.searchKeyWord;
      }
      params.timeDimension = this.timeDimension;
      params.startDate = this.$GetApiTime(this.fromDate[0]);
      params.endDate = this.$GetApiTime(this.fromDate[1]);
      All.postAPI({
        method: this.CFOlist[this.nowPageNum].method,
        params: params
      })
        .then(res => {
          this.total = res.total;
          let resList = res.list;
          if (resList.length) {
            let arr = [];
            this.headTable.forEach((item, index) => {
              if (item.field in resList[0]) {
                arr.push({
                  text: item.text,
                  field: item.field,
                  sortable: item.field,
                  width: item.width || "170px"
                });
              }
            });
            if (params.startDate !== params.endDate && arr[0].text !== "日期") {
              arr.unshift({
                text: "日期",
                field: "date",
                sortable: "date",
                width: "80px"
              });
            }
            this.headTable = arr;
            this.dataList = resList;
            // console.log(this.headTable,this.dataList)
          } else {
            this.$Notif({
              title: "提示",
              message: "当前筛选条件下列表暂无数据",
              type: "warning"
            });
            this.dataList = [];
          }
        })
        .catch(() => {
          this.dataList = [];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    search() {
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
    lazy(str) {
      return {
        lazy: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            if (node.level == 0) {
              let nodes = [{ value: -1, label: "全部", leaf: true }];
              All.postAPI({
                method: str,
                params:
                  str === "basic.code.erpRegion" ? { code: 1 } : { code: 0 }
              }).then(res => {
                let arr = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.push(...arr);
                resolve(nodes);
              });
            } else {
              let nodes = [];
              All.postAPI({
                method: str,
                params: { code: node.value }
              }).then(res => {
                nodes = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.unshift({ value: -1, label: "全部", leaf: true });
                resolve(nodes);
              });
            }
          }, 1000);
        }
      };
    },
    downLoad() {
      let method;
      if (this.nowPageNum == 0) {
        method = All.financeExport0a();
      } else if (this.nowPageNum == 1) {
        method = All.financeExport1a();
      } else if (this.nowPageNum == 2) {
        method = All.financeExport2a();
      } else if (this.nowPageNum == 3) {
        method = All.financeExport3a();
      } else if (this.nowPageNum == 4) {
        method = All.financeExport4a();
      } else if (this.nowPageNum == 5) {
        method = All.financeExport5a();
      }
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderColumns: this.orderColumns,
        ...this.isSelected
      };
      if (this.nowPageNum == 0) {
        params.companyRange = this.companyRange;
        params.customerNoOrName = this.customerNoOrName;
      }
      if (this.nowPageNum == 2) {
        params.supplierNoOrName = this.supplierNoOrName;
      }
      if (
        this.nowPageNum == 1 ||
        this.nowPageNum == 3 ||
        this.nowPageNum == 4
      ) {
        params.categoryNoOrName = this.categoryNoOrName;
      }
      if (this.nowPageNum == 5) {
        params.searchKeyWord = this.searchKeyWord;
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
.header {
  .el-form-item {
    margin-right: 20px;
  }
}
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