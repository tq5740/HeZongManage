<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <el-button v-if="nowPageNum == 3" @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <el-form :inline="true">
          <el-form-item label="选择时间 :">
            <datePickerComponent v-model="fromDate"></datePickerComponent>
          </el-form-item>
          <el-form-item label="药品类型 :">
            <cascaderComponent v-model="selected.ecsCategory" :props="lazy(All.codeEcsCategory())" multiple :otherProps="{checkStrictly : true}"></cascaderComponent>
          </el-form-item>
          <el-form-item label="品种编号/名称 :" v-if="nowPageNum === 3 || nowPageNum === 4 || nowPageNum === 5">
            <el-input v-model="drugsKeyword" placeholder="请输入品种编号/名称" clearable></el-input>
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
          <span>品种销售额：</span>
          <span class="deepen">{{methodList[3].dimension[0]}}</span>
          <span>元</span>
        </li>
        <li class="all-item">
          <span>品种销售数量：</span>
          <span class="deepen">{{methodList[3].dimension[1]}}</span>
          <span>个</span>
        </li>
        <li class="all-item">
          <span>购买家数：</span>
          <span class="deepen">{{methodList[3].dimension[2]}}</span>
          <span>个</span>
        </li>
      </ul>
      <tableComponent :dataList="dataList" :headTable="headTable" border :from="'ECS'"></tableComponent>
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
    // selectComponent,
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
      fromDate: [],
      headTable: [],
      dataList: [],
      tableLoading: false,
      nowPageNum: null,
      selectOptions: {},
      selected: {},
      ecsCategory: [],
      isSelected: [],
      customerNoOrName: "",
      drugsKeyword: "",
      getStorage: false,
      methodList: [
        {
          method: All.cfoCustomerSaleDetail()
        },
        {},
        {},
        {
          method: All.categoryDetails(),
          totalMethod: All.ecsTotalCategoryDetails(),
          dimension: {}
        },
        {},
        {}
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
      this.reset();
      if (this.getStorage) {
        this.getFatherData();
      }
      this.getIsSelected();
      this.getTable();
    },
    reset() {
      let timeArr = this.$GetStorage("ecsTime");
      timeArr
        ? (this.fromDate = timeArr)
        : (this.fromDate = this.$store.state.defaultTime);
      this.pageSize = 10;
      this.pageNum = 1;
      this.drugsKeyword = "";
      let str = this.$route.path;
      let num = str[str.length - 1];
      this.nowPageNum = +num;
      if (this.nowPageNum == 0) {
        this.selected = {
          saleChannel: -1,
          erpRegion: -1
        };
        this.selectOptions = {
          saleChannel: [],
          erpRegion: []
        };
        this.headTable = [
          {
            text: "客户编号",
            field: "customerNo"
          },
          {
            text: "客户名称",
            field: "customerName"
          },
          {
            text: "客户地区",
            field: "area"
          },
          {
            text: "客户大类",
            field: "primaryCustomerType"
          },
          {
            text: "客户小类",
            field: "subCustomerType"
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
          }
        ];
        this.getSelectOptions(All.codeErpRegion());
        this.getSelectOptions(All.codeAaleChannel());
      } else if (this.nowPageNum == 3) {
        this.selected = {
          ecsCategory: [-1]
        };
        this.selectOptions = {};
        this.headTable = [
          {
            text: "品种编号",
            field: "goodsId",
            minWidth: "50"
          },
          {
            text: "品种名称",
            field: "goodsName",
            minWidth: "100"
          },
          {
            text: "品种规格",
            field: "goodsStandard",
            minWidth: "70"
          },
          {
            text: "品种单位",
            field: "goodsPackUnit",
            minWidth: "50"
          },
          {
            text: "生产厂家",
            field: "goodsProducer",
            minWidth: "120"
          },
          {
            text: "品种大类",
            field: "firstTypeName"
          },
          {
            text: "品种小类",
            field: "secondTypeName"
          },
          {
            text: "件装量",
            field: "goodsItemAmount",
            minWidth: "50"
          },
          {
            text: "销售数量",
            field: "saleNum",
            minWidth: "70"
          },
          {
            text: "销售额(元)",
            field: "saleMoney",
            minWidth: "70"
          },
          {
            text: "购买家数",
            field: "buyNum",
            minWidth: "70"
          }
        ];
      }
      console.log(this.selected);
    },
    getFatherData() {
      let str = this.$route.fullPath.replace("mars-admin/", "");
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
        date =
          storage.date || storage.time;  
      }
      if (date) {
        let dateNum = getStrCount(date, "-");
        let dateStart = "";
        let dateEnd = "";
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth() + 1;
        nowMonth.toString().length === 1 ? nowMonth = "0" + nowMonth : nowMonth;
        let nowDay = now.getDate();
        if((nowDay+"").length < 2) {
          nowDay = "0"+nowDay
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
      console.log(str);
      All.postAPI({
        method: str
      }).then(res => {
        let arr = str.split(".");
        let name = arr[arr.length - 1];
        this.selectOptions[name] = res;
        this.selectOptions[name].unshift({ name: "全部", code: -1 });
        console.log(this.selectOptions);
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
          if (i === "ecsPayment") {
            obj.payment1 = this.selected[i];
          } else if (i.substring(0, 3) === "ecs") {
            let right = i.substring(4);
            let left = i.substring(3, 4).toLowerCase();
            let str = left + right;
            obj[str] = this.selected[i];
          } else {
            obj[i] = this.selected[i];
          }
        } else if (this.selected[i].length !== 0) {
          let arr = this.selected[i];
          if (i === "ecsRegion") {
            if (arr.length === 1) {
              obj.province = arr[0];
            } else if (arr.length === 2) {
              obj.province = arr[0];
              obj.city = arr[1];
            } else if (arr.length === 3) {
              obj.province = arr[0];
              obj.city = arr[1];
              obj.county = arr[2];
            }
          } else if (i === "ecsCategory") {
            if (arr.length === 1) {
              obj.firstType = arr[0];
            } else if (arr.length === 2) {
              obj.firstType = arr[0];
              obj.secondType = arr[1];
            } else {
              obj.firstType = arr[0];
              obj.secondType = arr[1];
              obj.threeType = arr[2];
            }
          } else if (i.substring(0, 3) === "ecs") {
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
    getTotal() {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        name: this.drugsKeyword,
        ...this.isSelected
      };
      All.postAPI({
        method: this.methodList[this.nowPageNum].totalMethod,
        params: params
      }).then(res => {
        let dim = this.methodList[this.nowPageNum].dimension;
        dim[0] = this.$ToThousands(res.totalMoney);
        dim[1] = this.$ToThousands(res.totalNum);
        dim[2] = this.$ToThousands(res.totalBuyNum);
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
        name: this.drugsKeyword,
        ...this.isSelected
      };
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
                if (item.field === "goodsName" || item.field === "goodsStandard" || item.field === "goodsProducer" || item.field === "goodsItemAmount") {
                  arr.push({
                    text: item.text,
                    field: item.field,
                    minWidth: item.minWidth
                  });
                } else {
                  arr.push({
                    text: item.text,
                    field: item.field,
                    sortable: item.field,
                    minWidth: item.minWidth
                  });
                }
              }
            });
            this.headTable = arr;
            resList.forEach(i => {
              i.area = i.provinceName + i.cityName + i.countyName;
            });
            this.dataList = resList;
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
      let method;
      if (this.nowPageNum == 0) {
        method = All.ecsExport8a()
      } else if (this.nowPageNum == 3) {
        method = All.ecsExport9a()
      }
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        eg: this.eg,
        name: this.drugsKeyword,
        ...this.isSelected
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