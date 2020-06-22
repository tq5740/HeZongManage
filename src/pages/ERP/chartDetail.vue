<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <div v-if="defaulted.show.dimension">
          <p class="title">分析维度</p>
          <div v-if="haveSelect">
            <div v-for="(item, index) in selectNum" :key="item" class="selectBox">
              <p class="index-css index123 no">{{index+1}}</p>
              <selectForm :defaultIsSelect="defaultIsSelect" :index="index" style="float: left;"></selectForm>
              <el-form :inline="true">
                <el-form-item label="查看"></el-form-item>
                <el-form-item>
                  <el-button type="warning" plain icon="el-icon-remove" @click="delSelect(item, index)" v-if="selectNum.length > 0">减去维度</el-button>
                  <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(index)" v-if="selectNum.length < defaulted.selectArr.length && selectNum.length === index + 1">添加维度</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(-1)" v-if="selectNum.length === 0" style="margin-bottom: 20px; margin-left: 20px;">添加维度</el-button>
        </div>
        <div v-if="defaulted.show.scope">
          <p class="title">数据范围</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item label="按">
                <selectComponent :options="[{name:'公司',code:1}]" v-model="isSelect1" width="110px"></selectComponent>
              </el-form-item>
              <el-form-item label="等于">
                <selectComponent :options="[{name:'母公司+健康之家',code:2},{name:'母公司',code:1}]" v-model="queryRange" width="160px"></selectComponent>
              </el-form-item>
              <el-form-item label="查看"></el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="defaulted.show.time">
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item>
                <datePickerComponent v-model="fromDate"></datePickerComponent>
              </el-form-item>
              <el-form-item :label="granularity.name">
                <selectComponent :name="granularity.name" :options="granularity.options" v-model="timeDimension" width="100px"></selectComponent>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="search" :loading="chartLoading && tableLoading">搜索</el-button>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="chartLoading">
      <div class="selectBox">
        <el-form :inline="true">
          <el-form-item label="维度显示" v-if="defaulted.fromWhere !== 'ERPdebt'">
            <selectComponent name="维度显示" size="small" :options="chartDimensions" v-model="chartDimension" @change="refreshChart" multiple collapseTags propValue="self" propLebel="self"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="defaulted.fromWhere === 'ERP'">
            <selectComponent size="small" :options="dimension.ERP" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="defaulted.fromWhere === 'ERPtype'">
            <selectComponent size="small" :options="dimension.ERPtype" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
        </el-form>
      </div>
      <echarts :option="chartOptionData" height="400px"></echarts>
    </div>
    <div class="main-box" v-loading="tableLoading">
      <div v-if="defaulted.chartTable === false">
        <ul class="table-all" v-if="defaulted.fromWhere === 'ERP'">
          <li class="all-item">
            <span>{{dimension.ERP[0].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERP[0].value)}}</span>
            <span>{{dimension.ERP[0].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERP[1].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERP[1].value)}}</span>
            <span>{{dimension.ERP[1].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERP[2].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERP[2].value)}}</span>
            <span>{{dimension.ERP[2].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERP[3].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERP[3].value)}}</span>
            <span>{{dimension.ERP[3].unit}}</span>
          </li>
        </ul>
        <ul class="table-all" v-if="defaulted.fromWhere === 'ERPtype'">
          <li class="all-item">
            <span>{{dimension.ERPtype[0].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERPtype[0].value)}}</span>
            <span>{{dimension.ERPtype[0].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERPtype[1].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERPtype[1].value)}}</span>
            <span>{{dimension.ERPtype[1].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERPtype[2].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERPtype[2].value)}}</span>
            <span>{{dimension.ERPtype[2].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERPtype[3].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERPtype[3].value)}}</span>
            <span>{{dimension.ERPtype[3].unit}}</span>
          </li>
          <li class="all-item">
            <span>{{dimension.ERPtype[4].name}}：</span>
            <span class="deepen">{{$ToThousands(dimension.ERPtype[4].value)}}</span>
            <span>{{dimension.ERPtype[4].unit}}</span>
          </li>
        </ul>
        <ul class="table-all" v-if="defaulted.fromWhere === 'ERPdebt'">
          <li class="all-item">
            <span>欠款金额：</span>
            <span class="deepen">{{$ToThousands(dimensionERPdebt[0])}}</span>
          </li>
          <li class="all-item">
            <span>回款金额：</span>
            <span class="deepen">{{$ToThousands(dimensionERPdebt[1])}}</span>
          </li>
        </ul>
        <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" from="ERP" border height="600"></tableComponent>
      </div>
      <div v-else>
        <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" border height="600"></tableComponent>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "@c/Echarts.vue";
import selectForm from "@c/SelectForm.vue";
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import { granularity, nameCodeObj } from "@utils/objArrData";
import All from "@api/all";

export default {
  components: {
    echarts,
    selectForm,
    selectComponent,
    datePickerComponent,
    tableComponent
  },
  data() {
    return {
      showHeader: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      eg: "",
      granularity: granularity(),
      nameCodeObj: nameCodeObj(),
      isSelect1: 1,
      queryRange: 2,
      fromDate: [],
      showSelect: [],
      defaultIsSelect: {},
      selectNum: [],
      queryDimension: 2,
      dimensionOrder: [],
      chartOptionData: {},
      chartOption: {
        title: {
          text: "",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res);
          },
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "rgb(0,138,205)"
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ["line", "bar", "stack", "tiled"]
            } //切换为折线图，切换为柱状图
          }
        },
        legend: {
          data: [],
          x: "center",
          y: "bottom"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          top: "24%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: `{value}`
          }
        },
        series: [
          {
            name: "",
            type: "line",
            data: [],
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2
                },
                areaStyle: {
                  color: "#f3f8ff"
                }
              }
            }
          }
        ]
      },
      headTable: [],
      dataList: [],
      timeDimension: 2,
      chartLoading: false,
      tableLoading: false,
      showPage: true,
      isSelected: {},
      haveSelect: false,
      mapObj: {
        customerCounts: "客户数量",
        incomeOfTax: "含税收入",
        incomeOfNoneTax: "不含税收入",
        costOfTax: "含税成本",
        costOfNoneTax: "不含税成本",
        medicineCount: "品种数量"
      },
      ERPArr: [
        "customerCounts",
        "incomeOfTax",
        "incomeOfNoneTax",
        "costOfTax",
        "costOfNoneTax"
      ],
      ERPtypeArr: [
        "medicineCount",
        "incomeOfTax",
        "incomeOfNoneTax",
        "costOfTax",
        "costOfNoneTax"
      ],
      ERPCode: {
        i1: "saleChannel",
        i2: "erpRegion",
        i3: "customerType",
        i4: "supplierType",
        i5: "purchaseChannel",
        i6: "dept"
      },
      ERPtypeCode: {
        i1: "saleChannel",
        i2: "medicineType",
        i3: "profitLevel"
      },
      ERPdebtCode: {
        i1: "dept",
        i2: "erpZhiyzl"
      },
      chartDimensions: [],
      chartDimension: [],
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
      chartData: {},
      dimensionERPdebt: [],
      hasSelect: [],
      nowPageNum: undefined,
      hide: false
    };
  },
  computed: {
    dimension() {
      return this.$store.state.dimension;
    },
    defaulted() {
      return this.$store.state.defaulted;
    },
    optionsDisabled() {
      return this.selectName.optionsDisabled;
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
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectedArr = [];
      this.dimensionOrder = [];
      this.selected = {};
      let timeArr = this.$GetStorage("erpTime");
      timeArr
        ? (this.fromDate = timeArr)
        : (this.fromDate = this.$store.state.defaultTime);
      this.getData();
      this.getSelected();
      this.getChart();
      this.getTotal();
      this.getTable();
    },
    getData() {
      let num = this.$route.query.analysis;
      this.nowPageNum = +num;
      let e = this.$store.state.ERPlistData[num];
      // e.chartTable = false;
      this.$store.commit("setDefaulted", e);
      this.hide = this.$route.query.hide;
    },
    getChart() {
      this.chartLoading = true;
      this.chartOption.title.text = this.defaulted.chart.name;
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        timeDimension: this.timeDimension,
        queryDimension: this.queryDimension,
        ...this.isSelected
      };
      if (this.defaulted.fromWhere !== "ERPdebt") {
        params.dimensionOrder = this.dimensionOrder;
        params.queryRange = this.queryRange;
      }
      All.postAPI({
        method: this.defaulted.chart.method,
        params: params
      })
        .then(res => {
          this.chartData = res;
          this.chartOption.title.text = this.defaulted.chart.name;
          if (this.defaulted.fromWhere !== "ERPdebt") {
            let options = res.chartDimensions;
            this.chartDimensions = options;
            this.chartDimension = [options[0]];
            this.refreshChart();
          } else {
            let xAxisData = [];
            let debt = [];
            let income = [];
            for (let i = 0; i < res.length; i++) {
              debt.push(res[i].debt);
              income.push(res[i].income);
              xAxisData.push(res[i].time);
            }
            this.chartOption.series = [
              {
                name: "欠款",
                type: "bar",
                data: debt
              },
              {
                name: "回款",
                type: "bar",
                data: income
              }
            ];
            this.chartOption.legend.data = ["欠款", "回款"];
            this.chartOption.xAxis.data = xAxisData;
            this.chartOption.xAxis.boundaryGap = true;
            this.chartOptionData = this.chartOption;
          }
        })
        .finally(() => {
          this.chartLoading = false;
        });
    },
    refreshChart() {
      let res = this.chartData;
      let xAxisData = [];
      let key;
      if (this.defaulted.fromWhere === "ERP") {
        key = this.ERPArr[this.queryDimension - 1];
      } else if (this.defaulted.fromWhere === "ERPtype") {
        key = this.ERPtypeArr[this.queryDimension - 1];
      }
      this.chartOption.series = [];
      this.chartOption.xAxis.data = [];
      this.chartOption.legend.data = [];
      let series = [];
      let legend = [];
      this.chartDimension.forEach((item, index) => {
        let resData = res.result[item];
        let data = [];
        legend.push(item + "," + this.mapObj[key]);
        for (let j = 0; j < resData.length; j++) {
          data.push({
            dimension: item,
            value: resData[j][key]
          });
          if (xAxisData.length < resData.length) {
            xAxisData.push(resData[j].date);
          }
        }
        series[index] = {
          name: item + "," + this.mapObj[key],
          type: "line",
          data: data,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              },
              areaStyle: {
                color: "#f3f8ff"
              }
            }
          }
        };
      });
      this.chartOption.legend.data = legend;
      this.chartOption.series = series;
      this.chartOption.xAxis.data = xAxisData;
      this.chartOptionData = this.chartOption;
      // console.log(this.chartOptionData);
    },
    getTotal() {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        timeDimension: this.timeDimension,
        queryDimension: this.queryDimension,
        ...this.isSelected
      };
      All.postAPI({
        method: this.defaulted.total.method,
        params: params
      }).then(res => {
        let dim = this.dimension;
        dim.ERP[0].value = res[this.ERPArr[0]];
        dim.ERP[1].value = res[this.ERPArr[1]];
        dim.ERP[2].value = res[this.ERPArr[2]];
        dim.ERP[3].value = res[this.ERPArr[3]];
        dim.ERPtype[0].value = res[this.ERPtypeArr[0]];
        dim.ERPtype[1].value = res[this.ERPtypeArr[1]];
        dim.ERPtype[2].value = res[this.ERPtypeArr[2]];
        dim.ERPtype[3].value = res[this.ERPtypeArr[3]];
        dim.ERPtype[4].value = res[this.ERPtypeArr[4]];
        this.dimensionERPdebt[0] = res.totalDebt;
        this.dimensionERPdebt[1] = res.totalIncome;
        this.$store.commit("setDimension", dim);
      });
    },
    getTable() {
      if (!this.defaulted.chartTable) {
        this.tableLoading = true;
        let params = {
          startDate: this.$GetApiTime(this.fromDate[0]),
          endDate: this.$GetApiTime(this.fromDate[1]),
          timeDimension: this.timeDimension,
          queryDimension: this.queryDimension,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          eg: this.eg,
          ...this.isSelected
        };
        if (this.defaulted.fromWhere !== "ERPdebt") {
          params.dimensionOrder = this.dimensionOrder;
          params.queryRange = this.queryRange;
        }
        All.postAPI({
          method: this.defaulted.table.method,
          params: params
        })
          .then(res => {
            this.total = res.total;
            let headTable = [
              {
                text: "日期",
                field: "date",
                sortable: "date"
              }
            ];
            let result = res.list;
            if (result.length) {
              Object.keys(result[0]).forEach(i => {
                let text = this.$MapStr(i, this.nameCodeObj);
                let obj = {
                  text: text,
                  field: i,
                  sortable: i
                };

                if (
                  text !== "-" &&
                  text !== "日期" &&
                  i !== "incomeOfTax" &&
                  i !== "incomeOfNoneTax" &&
                  i !== "costOfTax" &&
                  i !== "costOfNoneTax" &&
                  i !== "customerCounts"
                ) {
                  headTable.push(obj);
                }
              });
              if (this.defaulted.fromWhere !== "ERPdebt") {
                if (this.defaulted.chart.name === "客户销售") {
                  headTable.push({
                    text: "客户数量(个)",
                    field: "customerCounts",
                    sortable: "customerCounts"
                  });
                }
                if (this.nowPageNum === 3 || this.nowPageNum === 4) {
                  if (this.hide) {
                    headTable.push(
                      {
                        text: "含税收入(元)",
                        field: "incomeOfTax",
                        sortable: "incomeOfTax"
                      },
                      {
                        text: "不含税收入(元)",
                        field: "incomeOfNoneTax",
                        sortable: "incomeOfNoneTax"
                      },
                      {
                        text: "含税成本(元)",
                        field: "costOfTax",
                        sortable: "costOfTax"
                      },
                      {
                        text: "不含税成本(元)",
                        field: "costOfNoneTax",
                        sortable: "costOfNoneTax"
                      }
                    );
                  } else {
                    headTable.push(
                      {
                        text: "含税收入(元)",
                        field: "incomeOfTax",
                        sortable: "incomeOfTax"
                      },
                      {
                        text: "不含税收入(元)",
                        field: "incomeOfNoneTax",
                        sortable: "incomeOfNoneTax"
                      },
                      {
                        text: "含税成本(元)",
                        field: "costOfTax",
                        sortable: "costOfTax"
                      },
                      {
                        text: "真实成本(元)",
                        field: "realCost",
                        sortable: "realCost"
                      },
                      {
                        text: "不含税成本(元)",
                        field: "costOfNoneTax",
                        sortable: "costOfNoneTax"
                      },
                      {
                        text: "毛利(元)",
                        field: "ml",
                        sortable: "ml"
                      }
                    );
                  }
                } else {
                  headTable.push(
                    {
                      text: "含税收入(元)",
                      field: "incomeOfTax",
                      sortable: "incomeOfTax"
                    },
                    {
                      text: "不含税收入(元)",
                      field: "incomeOfNoneTax",
                      sortable: "incomeOfNoneTax"
                    },
                    {
                      text: "含税成本(元)",
                      field: "costOfTax",
                      sortable: "costOfTax"
                    },
                    {
                      text: "不含税成本(元)",
                      field: "costOfNoneTax",
                      sortable: "costOfNoneTax"
                    }
                  );
                }
              }
              if (this.defaulted.chart.name === "客户销售") {
                headTable.forEach(i => {
                  i.link = "/sale/customerDetail"; // 外层地址
                });
              } else if (this.defaulted.chart.name === "品种销售") {
                headTable.forEach(i => {
                  i.link = "/sale/categoryDetail"; // 外层地址
                });
              }
              this.headTable = headTable;
              this.dataList = result;
            } else {
              this.dataList = [];
              this.$Notif({
                title: "提示",
                message: `当前筛选条件下列表暂无数据`,
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
        this.selected = {};
        this.dimensionOrder.splice(index, 1);
        this.hasSelect.splice(index, 1);
        this.dimensionOrder = this.dimensionOrder.filter(Boolean);
      }
      let str = item.split(",")[0];
    },
    getIsSelected() {
      let obj = {};
      this.selectedArr.forEach(item => {
        if (item) {
          Object.keys(item).forEach(i => {
            let key;
            if (this.defaulted.fromWhere === "ERP") {
              key = this.ERPCode[i];
            } else if (this.defaulted.fromWhere === "ERPtype") {
              key = this.ERPtypeCode[i];
            } else if (this.defaulted.fromWhere === "ERPdebt") {
              key = this.ERPdebtCode[i];
            }
            this.selected[key] = item[i];
          });
        }
      });
      console.log(this.selected);
      Object.keys(this.selected).forEach(i => {
        if (
          (this.selected[i] && typeof this.selected[i] === "string") ||
          typeof this.selected[i] === "number" ||
          this.selected[i] === 0
        ) {
          if (i === "erpRegion") {
            obj.province = this.selected[i];
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
              obj.primaryType = arr[0];
            } else if (arr.length === 2) {
              obj.primaryType = arr[0];
              obj.subType = arr[1];
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
      // console.log(this.hasSelect);
      if (new Set(this.hasSelect).size !== this.hasSelect.length) {
        this.$Notif({
          title: "提示",
          message: `不能选择相同维度`,
          type: "warning"
        });
        return;
      }
      this.getIsSelected();
      this.getChart();
      this.getTotal();
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
    downLoad() {
      let method;
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        timeDimension: this.timeDimension,
        queryDimension: this.queryDimension,
        dimensionOrder: this.dimensionOrder,
        queryRange: this.queryRange,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg,
        ...this.isSelected
      };
      if (this.defaulted.chart.name === "客户销售") {
        method = All.erpExport0();
      } else if (this.defaulted.chart.name === "品种销售") {
        method = All.erpExport1();
      } else if (this.defaulted.chart.name === "部门欠款&回款") {
        method = All.erpExport2();
        delete params.dimensionOrder;
        delete params.queryRange;
      }
      console.log(params)
      this.$GetDownload(method, params);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>