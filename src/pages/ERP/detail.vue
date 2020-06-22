<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <el-form :inline="true">
          <el-form-item label="选择时间 :">
            <datePickerComponent v-model="fromDate"></datePickerComponent>
          </el-form-item>
          <el-form-item label="销售渠道 :">
            <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
          </el-form-item>
          <el-form-item label="客户类型 :" v-if="nowPageNum === 3">
            <cascaderComponent v-model="selected.customerType" :props="lazy(All.codeCustomerType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="客户地区 :" v-if="nowPageNum === 3">
            <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion"></selectComponent>
          </el-form-item>
          <el-form-item label="供应商类型 :" v-if="nowPageNum === 3">
            <cascaderComponent v-model="selected.supplierType" :props="lazy(All.codeSupplierType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="采购渠道 :" v-if="nowPageNum === 3">
            <cascaderComponent v-model="selected.purchaseChannel" :props="lazy(All.codePurchaseChannel())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="部门 :" v-if="nowPageNum === 3">
            <selectComponent v-model="selected.dept" :options="selectOptions.dept"></selectComponent>
          </el-form-item>
          <el-form-item label="药品类型 :" v-if="nowPageNum == 4">
            <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="利润等级 :" v-if="nowPageNum == 4">
            <selectComponent v-model="selected.profitLevel" :options="selectOptions.profitLevel"></selectComponent>
          </el-form-item>
          <el-form-item label="OTC类型 :" v-if="nowPageNum == 4">
            <selectComponent v-model="selected.medicineOtcType" :options="selectOptions.medicineOtcType"></selectComponent>
          </el-form-item>
          <el-form-item label="公司 :">
            <selectComponent :options="[{name:'母公司+健康之家',code:2},{name:'母公司',code:1}]" v-model="companyRange" width="160px"></selectComponent>
          </el-form-item>
          <el-form-item label="药品编号/名称/生产厂家 :" v-if="nowPageNum === 4">
            <el-input v-model="searchWord" placeholder="请输入药品编号/名称/生产厂家" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户编号/名称 :" v-if="nowPageNum === 3">
            <el-input v-model="searchWord" placeholder="请输入客户编号/名称" clearable></el-input>
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
      <ul class="table-all" v-if="nowPageNum == '3'">
        <li class="all-item">
          <span>{{nowPageNum === 3 ? "客户数量：" : "品种数量："}}</span>
          <span class="deepen">{{methodList[3].dimension[0]}}</span>
          <span>个</span>
        </li>
        <li class="all-item">
          <span>含税收入：</span>
          <span class="deepen">{{methodList[3].dimension[1]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>不含税收入：</span>
          <span class="deepen">{{methodList[3].dimension[2]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>含税成本：</span>
          <span class="deepen">{{methodList[3].dimension[3]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>不含税成本：</span>
          <span class="deepen">{{methodList[3].dimension[4]}}</span>
          <span>元</span>
        </li>
      </ul>
      <ul class="table-all" v-if="nowPageNum == '4'">
        <li class="all-item">
          <span>品种数量：</span>
          <span class="deepen">{{methodList[4].dimension[0]}}</span>
          <span>个</span>
        </li>
        <li class="all-item">
          <span>含税收入：</span>
          <span class="deepen">{{methodList[4].dimension[1]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>不含税收入：</span>
          <span class="deepen">{{methodList[4].dimension[2]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>含税成本：</span>
          <span class="deepen">{{methodList[4].dimension[3]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>不含税成本：</span>
          <span class="deepen">{{methodList[4].dimension[4]}}</span>
          <span>元</span>
        </li>
      </ul>
      <tableComponent :dataList="dataList" :headTable="headTable" border></tableComponent>
    </div>
  </div>
</template>

<script>
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import cascaderComponent from "@c/CascaderComponent.vue";
import { getStrCount, getDaysBefore, getMonthDays } from "@utils/index";
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
      eg: "",
      companyRange: 2,
      fromDate: [],
      headTable: [],
      dataList: [],
      tableLoading: false,
      nowPageNum: null,
      selectOptions: {},
      selected: {},
      isSelected: [],
      searchWord: "",
      getStorage: false,
      hide: false,
      methodList: [
        {},
        {},
        {},
        {
          method: All.erpCustomerSaleDetailList(),
          totalMethod: All.erpCustomerSaleDetailSum(),
          dimension: {}
        },
        {
          method: All.erpCategorySaleDetailList(),
          totalMethod: All.erpCategorySaleDetailSum(),
          dimension: {}
        }
      ]
    };
  },
  computed: {
    defaulted() {
      return this.$store.state.defaulted;
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
    window.addEventListener(
      "message",
      function(e) {
        if (e.data && e.data.data === "refresh") {
          _this.getStorage = true;
          _this.init();
        }
      },
      false
    );
  },
  methods: {
    init() {
      this.hide = this.$route.query.hide;
      this.reset();
      if (this.getStorage) {
        this.getFatherData();
      }
      this.getIsSelected();
      this.getTable();
    },
    reset() {
      let timeArr = this.$GetStorage("erpTime");
      timeArr
        ? (this.fromDate = timeArr)
        : (this.fromDate = this.$store.state.defaultTime);
      this.pageSize = 10;
      this.pageNum = 1;
      this.searchWord = "";
      let str = this.$route.path;
      let num = str[str.length - 1];
      this.nowPageNum = +num;
      if (this.nowPageNum == 3) {
        this.selected = {
          saleChannel: -1,
          customerType: [-1],
          erpRegion: -1,
          supplierType: [-1],
          purchaseChannel: [-1],
          dept: -1
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
            width: "110"
          },
          {
            text: "客户名称",
            field: "customerName",
            width: "220"
          },
          {
            text: "客户地区",
            field: "customerArea",
            width: "200"
          },
          {
            text: "客户大类",
            field: "customerPrimaryTypeName",
          },
          {
            text: "客户小类",
            field: "customerSubTypeName",
          },
          {
            text: "合作性质",
            field: "cooperativeNature",
            width: "110"
          },
          {
            text: "含税收入(元)",
            field: "incomeOfTax"
          },
          {
            text: "不含税收入(元)",
            field: "incomeOfNoneTax"
          },
          {
            text: "含税成本(元)",
            field: "costOfTax"
          }
        ];
        if (this.hide) {
          this.headTable.push({
            text: "不含税成本(元)",
            field: "costOfNoneTax"
          });
        } else {
          this.headTable.push(
            {
              text: "真实成本(元)",
              field: "realCost"
            },
            {
              text: "不含税成本(元)",
              field: "costOfNoneTax"
            },
            {
              text: "毛利(元)",
              field: "ml"
            }
          );
        }
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeErpRegion());
        this.getSelectOptions(All.codeDept());
      } else if (this.nowPageNum == 4) {
        this.selected = {
          saleChannel: -1,
          medicineType: [-1],
          profitLevel: -1,
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
            field: "goodsNo",
            width: "110"
          },
          {
            text: "品种名称",
            field: "goodsName",
            width: "130"
          },
          {
            text: "品种规格",
            field: "goodsStandards",
            width: "130"
          },
          {
            text: "单位",
            field: "goodsUnit",
            width: "80"
          },
          {
            text: "生产厂家",
            field: "producer"
          },
          {
            text: "品种大类",
            field: "primaryTypeName"
          },
          {
            text: "品种小类",
            field: "subTypeName",
            width: "110"
          },
          {
            text: "利润等级",
            field: "profitLevelName",
            width: "110"
          },
          {
            text: "OTC类型",
            field: "otcTypeName",
            width: "110"
          },
          {
            text: "销售数量",
            field: "goodsAmount",
            width: "110"
          },
          {
            text: "含税收入(元)",
            field: "incomeOfTax"
          },
          {
            text: "不含税收入(元)",
            field: "incomeOfNoneTax"
          },
          {
            text: "含税成本(元)",
            field: "costOfTax"
          }
        ];
        if (this.hide) {
          this.headTable.push(
            {
              text: "不含税成本(元)",
              field: "costOfNoneTax"
            },
            {
              text: "ERP税率",
              field: "erpTaxRate" //rateOfTax
            }
          );
        } else {
          this.headTable.push(
            {
              text: "真实成本(元)",
              field: "realCost"
            },
            {
              text: "不含税成本(元)",
              field: "costOfNoneTax"
            },
            {
              text: "ERP税率",
              field: "erpTaxRate" //rateOfTax
            },
            {
              text: "毛利(元)",
              field: "ml"
            }
          );
        }
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeProfitLevel());
        this.getSelectOptions(All.codeMedicineOtcType());
      }
      console.log(this.selected);
    },
    getFatherData() {
      let str = this.$route.fullPath.replace("mars-admin/", "");
      console.log(str)
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
        this.companyRange = storage.companyRange || this.companyRange;
        date = storage.date || storage.time;
      }
      if (date) {
        let dateNum = getStrCount(date, "-");
        let dateStart = "";
        let dateEnd = "";
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth() + 1;
        nowMonth.toString().length === 1
          ? (nowMonth = "0" + nowMonth)
          : nowMonth;
        let nowDay = now.getDate();
        if ((nowDay + "").length < 2) {
          nowDay = "0" + nowDay;
        }
        let arr = date.split("-");
        if (dateNum === 0) {
          dateStart = date + "/01/01";
          if (date == nowYear) {
            dateEnd = date + "/" + nowMonth + "/" + nowDay;
          } else {
            dateEnd = date + "/12/" + getMonthDays(date, 12);
          }
        } else if (dateNum === 1) {
          if (arr[0] == nowYear && arr[1] == nowMonth) {
            arr[2] = nowDay;
          } else {
            arr[2] = getMonthDays(arr[0], arr[1] - 1);
          }
          dateEnd = arr.join("/");
          arr[2] = "01";
          dateStart = arr.join("/");
        } else if (dateNum === 2) {
          dateStart = arr.join("/");
          dateEnd = arr.join("/");
        }
        this.fromDate = [dateStart + " 00:00:00", dateEnd + " 23:59:59"];
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
          } else if (i === "medicineType") {
            if (arr.length === 1) {
              obj.primaryType = arr[0];
            } else if (arr.length === 2) {
              obj.primaryType = arr[0];
              obj.subType = arr[1];
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
          } else {
            obj[i] = this.selected[i][0];
          }
        }
      });
      this.isSelected = obj;
    },
    getTotal() {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        companyRange: this.companyRange,
        ...this.isSelected
      };
      if (this.nowPageNum === 3) {
        params.customerNoOrName = this.searchWord;
      } else if (this.nowPageNum === 4) {
        params.medicineNoOrName = this.searchWord;
      }
      All.postAPI({
        method: this.methodList[this.nowPageNum].totalMethod,
        params: params
      }).then(res => {
        let dim = this.methodList[this.nowPageNum].dimension;
        dim[0] = this.$ToThousands(res.medicineCount || res.customerCounts);
        dim[1] = this.$ToThousands(res.incomeOfTax);
        dim[2] = this.$ToThousands(res.incomeOfNoneTax);
        dim[3] = this.$ToThousands(res.costOfTax);
        dim[4] = this.$ToThousands(res.costOfNoneTax);
      });
    },
    getTable() {
      if ("totalMethod" in this.methodList[this.nowPageNum]) {
        this.getTotal();
      }
      this.tableLoading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        eg: this.eg,
        companyRange: this.companyRange,
        ...this.isSelected
      };
      if (this.nowPageNum === 3) {
        params.customerNoOrName = this.searchWord;
      } else if (this.nowPageNum === 4) {
        params.medicineNoOrName = this.searchWord;
      }
      All.postAPI({
        method: this.methodList[this.nowPageNum].method,
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
                  width: item.width || "160px"
                });
              }
            });
            this.headTable = arr;
            resList.forEach(i => {
              i.area = i.provinceName + i.cityName + i.countyName;
            });
            this.dataList = resList;
          } else {
            this.dataList = [];
            this.$Notif({
              title: "提示",
              message: "当前筛选条件下列表暂无数据",
              type: "warning"
            });
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
          this.eg = `${prop} asc`;
          break;
        case "descending":
          this.eg = `${prop} desc`;
          break;
        default:
          this.eg = "";
      }
      this.getTable();
    },
    lazy(str) {
      return {
        lazy: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            if (node.level == 0) {
              let nodes = [];
              All.postAPI({
                method: str,
                params:
                  str === "basic.code.erpRegion" ? { code: 1 } : { code: 0 }
              }).then(res => {
                nodes = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.unshift({ value: -1, label: "全部", leaf: true });
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
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        eg: this.eg,
        companyRange: this.companyRange,
        ...this.isSelected
      };
      let method;
      if (this.nowPageNum === 3) {
        method = All.erpExport0a();
        params.customerNoOrName = this.searchWord;
      } else if (this.nowPageNum === 4) {
        method = All.erpExport1a();
        params.medicineNoOrName = this.searchWord;
      }
      this.$GetDownload(method, params);
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
</style>