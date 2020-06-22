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
          <div>
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
        <div v-if="defaulted.show.time">
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item>
                <datePickerComponent v-model="fromDate"></datePickerComponent>
              </el-form-item>
              <el-form-item :label="granularity.name" v-if="defaulted.chart.name !== '复购次数'">
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
          <el-form-item label="维度显示" v-if="defaulted.chartTable === false && defaulted.chart.name !== '复购次数'">
            <selectComponent name="维度显示" size="small" :options="chartDimensions" v-model="chartDimension" @change="refreshChart" multiple collapseTags propValue="key" propLebel="value" v-if="defaulted.chart.name === '品种销售'"></selectComponent>
            <selectComponent name="维度显示" size="small" :options="chartDimensions" v-model="chartDimension" @change="refreshChart" multiple collapseTags propValue="self" propLebel="self" v-else></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="defaulted.fromWhere === 'ECS'">
            <selectComponent size="small" :options="dimension.ECS" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="defaulted.fromWhere === 'ECSCategory'">
            <selectComponent size="small" :options="dimension.ECSCategory" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="defaulted.fromWhere === 'ECSPayment'">
            <selectComponent size="small" :options="dimension.ECSPayment" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
        </el-form>
      </div>
      <echarts :option="chartOptionData" height="400px"></echarts>
    </div>
    <div class="main-box" v-loading="tableLoading">
      <div v-if="defaulted.chartTable === false">
        <div class="table-all">
          <ul v-if="defaulted.fromWhere === 'ECS'">
            <li class="all-item">
              <span>{{dimension.ECS[0].name}}：</span>
              <span class="deepen">{{dimension.ECS[0].value}}</span>
              <span>{{dimension.ECS[0].unit}}</span>
            </li>
            <li class="all-item">
              <span>{{dimension.ECS[1].name}}：</span>
              <span class="deepen">{{dimension.ECS[1].value}}</span>
              <span>{{dimension.ECS[1].unit}}</span>
            </li>
          </ul>
          <ul v-if="defaulted.fromWhere === 'ECSCategory'">
            <li class="all-item">
              <span>{{dimension.ECSCategory[0].name}}：</span>
              <span class="deepen">{{dimension.ECSCategory[0].value}}</span>
              <span>{{dimension.ECSCategory[0].unit}}</span>
            </li>
            <li class="all-item">
              <span>{{dimension.ECSCategory[1].name}}：</span>
              <span class="deepen">{{dimension.ECSCategory[1].value}}</span>
              <span>{{dimension.ECSCategory[1].unit}}</span>
            </li>
            <li class="all-item">
              <span>{{dimension.ECSCategory[2].name}}：</span>
              <span class="deepen">{{dimension.ECSCategory[2].value}}</span>
              <span>{{dimension.ECSCategory[2].unit}}</span>
            </li>
          </ul>
          <ul v-if="defaulted.fromWhere === 'ECSPayment'">
            <li class="all-item">
              <span>{{dimension.ECSPayment[0].name}}：</span>
              <span class="deepen">{{dimension.ECSPayment[0].value}}</span>
              <span>{{dimension.ECSPayment[0].unit}}</span>
            </li>
            <li class="all-item">
              <span>{{dimension.ECSPayment[1].name}}：</span>
              <span class="deepen">{{dimension.ECSPayment[1].value}}</span>
              <span>{{dimension.ECSPayment[1].unit}}</span>
            </li>
          </ul>
          <span v-if="defaulted.chart.name === '品种销售'">
            <i class="el-icon-info tips"></i>注：由于药品分类不唯一，销售总额和销售数量存在重复计算
          </span>
        </div>
        <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" from="ECS" border height="600"></tableComponent>
      </div>
      <div v-else>
        <div class="table-all" v-if="defaulted.chart.name === '注册会员数' || defaulted.chart.name === '审核会员数' || defaulted.chart.name === '下单会员数'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”对会员进行了去重处理</span>
        </div>
        <div class="table-all" v-if="defaulted.chart.name === '整体会员购买率'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”为这段时间内，下单会员数/注册会员数</span>
        </div>
        <div class="table-all" v-if="defaulted.chart.name === '准会员购买率'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”为这段时间内，下单会员数/审核通过的会员数</span>
        </div>
        <div class="table-all" v-if="defaulted.chart.name === '会员复购率'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”为这段时间内，订单大于等于2的会员数/注册会员数</span>
        </div>
        <div class="table-all" v-if="defaulted.chart.name === '订单均价'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”为这段时间内，销售总额/订单数</span>
        </div>
        <div class="table-all" v-if="defaulted.chart.name === '客单价'">
          <i class="el-icon-info tips"></i>
          <span>注：“合计”为这段时间内，销售总额/下单会员数</span>
        </div>
        <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" :autoSort="defaulted.chart.name !== '复购次数'" border height="600"></tableComponent>
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
      eg: "", // 排序
      granularity: granularity(),
      nameCodeObj: nameCodeObj(),
      isSelect1: 1,
      isSelect2: 1,
      fromDate: [],
      showSelect: [],
      defaultSelected: {
        ecsUserRank: -1,
        ecsDept: -1,
        ecsRegion: [-1],
        ecsCategory: [-1],
        ecsPayment: -1
      },
      defaultIsSelect: {},
      selectNum: [],
      queryDimension: 2,
      chartOption: {},
      chartOptionData: {},
      headTable: [],
      dataList: [],
      timeDimension: 2,
      chartLoading: false,
      tableLoading: false,
      showPage: false,
      isSelected: {},
      haveSelect: false,
      dimensionOrder: [],
      chartDimensions: [],
      chartDimension: [],
      selected: {},
      selectedArr: [],
      chartData: {},
      mapObj: {
        memberNum: "会员数量",
        countMoney: "销售总额",
        saleNum: "销售数量",
        costOfTax: "含税成本",
        costOfNoneTax: "不含税成本",
        medicineCount: "品种数量",
        orderNum: "订单数量",
        payMoney: "总金额",
        totalMoney: "销售总额",
        totalBuyNum: "购买家数",
        totalNum: "销售数量"
      },
      ECSArr: ["memberNum", "countMoney"],
      ECSCategoryArr: ["totalMoney", "totalBuyNum", "totalNum"],
      ECSPaymentArr: ["orderNum", "payMoney"],
      ECSCode: {
        i1: "ecsRegion",
        i2: "ecsUserRank",
        i3: "ecsDept"
      },
      ECSCategoryCode: {
        i1: "ecsCategory"
      },
      ECSPaymentCode: {
        i1: "ecsPayment",
        i2: "ecsRegion"
      },
      hasSelect: [],
      nowPageNum: undefined
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
    $route(to, from) {
      if (
        to.query.member != from.query.member ||
        to.query.sale != from.query.sale
      ) {
        this.getData();
      }
    }
  },
  created() {
    let timeArr = this.$GetStorage("ecsTime");
    timeArr
      ? (this.fromDate = timeArr)
      : (this.fromDate = this.$store.state.defaultTime);
    this.getData();
  },
  methods: {
    init() {
      this.chartOption = {
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
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: `{value}${this.defaulted.chart.unit || ""}`
          }
        },
        series: []
      };
    },
    getData() {
      this.selected = {};
      this.selectedArr = [];
      this.dimensionOrder = [];
      if ("member" in this.$route.query) {
        let num = this.$route.query.member;
        let defaulted = this.$store.state.defaulted;
        let e = this.$store.state.listData;
        defaulted.chart = {
          name: e[num].name,
          method: e[num].method,
          unit: e[num].unit || ""
        };
        defaulted.selectArr = [];
        defaulted.show = {
          dimension: false,
          scope: false,
          time: true
        };
        defaulted.chartTable = true;
        this.$store.commit("setDefaulted", defaulted);
      }
      if ("sale" in this.$route.query) {
        let num = this.$route.query.sale;
        let e = this.$store.state.listData1[num];
        this.nowPageNum = num;
        // e.chartTable = false;
        this.$store.commit("setDefaulted", e);
      }
      this.init();
      this.getSelected();
      if (
        this.defaulted.chartTable ||
        this.defaulted.chart.name === "复购次数"
      ) {
        this.getChartTable();
      } else {
        this.getChart();
        if ("total" in this.defaulted) {
          this.getTotal();
        }
        this.getTable();
      }
    },
    getChartTable() {
      this.chartLoading = true;
      this.tableLoading = true;
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        ...this.isSelected
      };
      if (this.defaulted.chart.name !== "复购次数") {
        params.timeDimension = this.timeDimension;
        params.queryDimension = this.queryDimension;
      }
      All.postAPI({
        method: this.defaulted.chart.method,
        params: params
      })
        .then(res => {
          this.init();
          this.chartOption.title.text = this.defaulted.chart.name;
          let legendArr = [];
          let xAxisData = [];
          let headTable = [];
          let nameObj = res[0];
          let other = res.slice(1, res.length - 1);
          let dataList = res.slice(1, res.length);
          let keyArr = Object.keys(nameObj);
          if (this.defaulted.chart.name === "复购次数") {
            this.chartOption.series[0] = {
              name: "会员数量",
              type: "bar",
              data: []
            };
            for (let i = 0; i < dataList.length; i++) {
              xAxisData.push(dataList[i].name1);
              this.chartOption.series[0].data.push(dataList[i].name2);
              for (let j = 0; j < keyArr.length; j++) {
                if (headTable.length < keyArr.length) {
                  let str = keyArr[j];
                  let obj = {
                    text: nameObj[str],
                    field: str
                  };
                  headTable.push(obj);
                }
              }
            }
          } else {
            for (let i = 0; i < keyArr.length; i++) {
              legendArr[i] = nameObj[keyArr[i]];
              this.chartOption.series[i] = {
                name: nameObj[keyArr[i]],
                type:
                  this.defaulted.chart.name.indexOf("会员数") != -1
                    ? "bar"
                    : "line",
                data: []
              };
            }
            for (let i = 0; i < other.length; i++) {
              xAxisData.push(other[i].time);
              for (let j = 0; j < keyArr.length; j++) {
                let str = keyArr[j];
                this.chartOption.series[j].data.push(other[i][str]);
                if (headTable.length < keyArr.length) {
                  let text = nameObj[str];
                  if (
                    text.indexOf("客单价") != -1 ||
                    text.indexOf("订单均价") != -1
                  ) {
                    text = text + "(元)";
                  }
                  let obj = {
                    text: text,
                    field: str,
                    sortable: str // === "日期" ? false : true
                  };
                  headTable.push(obj);
                }
              }
            }
            if (this.defaulted.chart.name.indexOf("会员数") === -1) {
              this.chartOption.xAxis.boundaryGap = false;
            }
          }
          let reverseList = [];
          for (let j = dataList.length; j > -1; j--) {
            if (j < dataList.length) {
              reverseList.push(dataList[j]);
            }
          }
          // reverseList.push(dataList[dataList.length - 1]);
          this.showPage = false;
          this.chartOption.xAxis.data = xAxisData;
          this.chartOption.legend.data = legendArr;
          this.chartOptionData = this.chartOption;
          if (
            this.defaulted.chart.name === "审核会员数" ||
            this.defaulted.chart.name === "下单会员数"
          ) {
            let item = headTable.pop();
            headTable.unshift(item);
          }
          if (this.defaulted.chart.name !== "复购次数") {
            headTable.unshift({ text: "日期", field: "time" });
            this.dataList = reverseList;
          } else {
            this.dataList = dataList;
          }
          this.headTable = headTable;
        })
        .finally(() => {
          this.chartLoading = false;
          this.tableLoading = false;
        });
    },
    getChart() {
      this.chartLoading = true;
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        timeDimension: this.timeDimension,
        queryDimension: this.queryDimension,
        dimensionOrder: this.dimensionOrder,
        ...this.isSelected
      };
      All.postAPI({
        method: this.defaulted.chart.method,
        params: params
      })
        .then(res => {
          this.init();
          this.chartData = res;
          let options = res.chartDimensions;
          this.chartOption.title.text = this.defaulted.chart.name;
          this.chartDimensions = options;
          if (this.defaulted.chart.name === "品种销售") {
            this.chartDimension = [options[0].key];
          } else {
            this.chartDimension = [options[0]];
          }
          this.refreshChart();
        })
        .catch(() => {
          this.chartOption = {};
        })
        .finally(() => {
          this.chartLoading = false;
        });
    },
    refreshChart() {
      let res = this.chartData;
      let xAxisData = [];
      let data = [];
      let key;
      if (this.defaulted.fromWhere === "ECS") {
        key = this.ECSArr[this.queryDimension - 1];
      } else if (this.defaulted.fromWhere === "ECSCategory") {
        key = this.ECSCategoryArr[this.queryDimension - 1];
      } else if (this.defaulted.fromWhere === "ECSPayment") {
        key = this.ECSPaymentArr[this.queryDimension - 1];
      }
      this.chartOption.series = [];
      this.chartOption.xAxis.data = [];
      this.chartOption.legend.data = [];
      let series = [];
      let legend = [];
      this.chartDimension.forEach((item, index) => {
        let resData = res.result[item];
        if (this.defaulted.chart.name === "品种销售") {
          this.chartDimensions.forEach(element => {
            if (element.key === item) {
              item = element.value;
            }
          });
        }
        let data = [];
        legend.push(item + "," + this.mapObj[key]);
        for (let j = 0; j < resData.length; j++) {
          data.push({
            dimension: item,
            value: resData[j][key]
          });
          if (xAxisData.length < resData.length) {
            xAxisData.push(resData[j].time);
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
      this.chartOption.xAxis.boundaryGap = false;
      this.chartOption.legend.data = legend;
      this.chartOption.series = series;
      this.chartOption.xAxis.data = xAxisData;
      this.chartOptionData = this.chartOption;
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
        dim.ECSCategory[0].value = this.$ToThousands(res.totalMoney);
        dim.ECSCategory[1].value = this.$ToThousands(res.totalBuyNum);
        dim.ECSCategory[2].value = this.$ToThousands(res.totalNum);
        dim.ECSPayment[0].value = this.$ToThousands(res.totalNum);
        dim.ECSPayment[1].value = this.$ToThousands(res.totalMoney);
        dim.ECS[0].value = this.$ToThousands(res.totalMoney);
        dim.ECS[1].value = this.$ToThousands(res.totalNum);
        this.$store.commit("setDimension", dim);
      });
    },
    getTable() {
      if (!this.defaulted.chartTable) {
        this.tableLoading = true;
        this.showPage = true;
        let params = {
          startDate: this.$GetApiTime(this.fromDate[0]),
          endDate: this.$GetApiTime(this.fromDate[1]),
          timeDimension: this.timeDimension,
          queryDimension: this.queryDimension,
          dimensionOrder: this.dimensionOrder,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          eg: this.eg,
          ...this.isSelected
        };
        All.postAPI({
          method: this.defaulted.table.method,
          params: params
        })
          .then(res => {
            this.total = res.total;
            let result = res.list;
            let headTable = [];
            if (result.length) {
              Object.keys(result[0]).forEach(i => {
                let text = this.$MapStr(i, this.nameCodeObj);
                let obj = {
                  text: text,
                  field: i,
                  sortable: i
                };
                if (this.defaulted.chart.name === "品种销售") {
                  obj.link = "/ecs/salectgyDetail";   // 外层地址
                }
                if (text !== "-") {
                  headTable.push(obj);
                }
              });
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
        Object.keys(this.defaulted.select).length &&
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
            if (this.defaulted.fromWhere === "ECS") {
              key = this.ECSCode[i];
            } else if (this.defaulted.fromWhere === "ECSCategory") {
              key = this.ECSCategoryCode[i];
            } else if (this.defaulted.fromWhere === "ECSPayment") {
              key = this.ECSPaymentCode[i];
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
      this.getIsSelected();
      if (this.defaulted.chartTable) {
        this.getChartTable();
      } else {
        this.getChart();
        if ("total" in this.defaulted) {
          this.getTotal();
        }
        this.getTable();
      }
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
      }
      let params1 = {
        dimensionOrder: this.dimensionOrder,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg,
        ...this.isSelected
      }
      if (this.defaulted.chart.name === "注册会员数") {
        method = All.ecsExport0();
      } else if (this.defaulted.chart.name === "审核会员数") {
        method = All.ecsExport1();
      } else if (this.defaulted.chart.name === "下单会员数") {
        method = All.ecsExport2();
      } else if (this.defaulted.chart.name === "整体会员购买率") {
        method = All.ecsExport3();
      } else if (this.defaulted.chart.name === "准会员购买率") {
        method = All.ecsExport4();
      } else if (this.defaulted.chart.name === "会员复购率") {
        method = All.ecsExport5();
      } else if (this.defaulted.chart.name === "订单均价") {
        method = All.ecsExport6();
      } else if (this.defaulted.chart.name === "客单价") {
        method = All.ecsExport7();
      } else if (this.defaulted.chart.name === "客户销售") {
        method = All.ecsExport8();
        params = {...params,...params1};
      } else if (this.defaulted.chart.name === "品种销售") {
        method = All.ecsExport9();
        params = {...params,...params1};
      } else if (this.defaulted.chart.name === "复购次数") {
        method = All.ecsExport10();
        delete params.timeDimension;
        delete params.queryDimension;
      } else if (this.defaulted.chart.name === "支付统计") {
        method = All.ecsExport11();
        params = {...params,...params1};
      }
      this.$GetDownload(method, params);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>