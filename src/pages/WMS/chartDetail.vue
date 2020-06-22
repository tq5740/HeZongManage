<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}
      </el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <div>
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item v-if="nowPageNum == 6">
                <datePointComponent v-model="datePoint" valueFormat="yyyy/MM/dd HH:mm"></datePointComponent>
              </el-form-item>
              <el-form-item v-else>
                <datePickerComponent v-model="fromDate"></datePickerComponent>
              </el-form-item>
              <el-form-item :label="granularity.name" v-if="nowPageNum != 6">
                <selectComponent :options="nowPageNum != 0 ? [...granularity.options, {code: 4, name: '按小时'}] : granularity.options" v-model="timeDimension" width="100px"></selectComponent>
              </el-form-item>
              <el-form-item label="分布方式" v-if="nowPageNum == 6">
                <selectComponent :options="distributeOptions" v-model="queryDimension" width="130px"></selectComponent>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="search" :loading="chartLoading && tableLoading">搜索</el-button>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="chartLoading" style="height: 375px;">
      <echarts :option="chart" v-if="isPie"></echarts>
      <echarts :option="chart1" v-if="isPie1"></echarts>
      <echarts :option="chartOption" v-if="isLine"></echarts>
      <div class="chart8alldata" v-if="isPie">
        <p class="title">{{chart8alldata.title}}</p>
        <p class="data">
          <count-to :start-val="0" :end-val="chart8alldata.data" :decimals="2" :duration="2600" />
        </p>
      </div>
    </div>
    <div class="main-box" v-loading="tableLoading">
      <div style="text-align: right;margin-bottom:10px;">
        <el-radio-group v-if="nowPageNum == 5" v-model="queryDimension" @change="getTable" size="small" class="radio">
          <el-radio-button :label="item.code" v-for="item in typeOptions" :key="item.code">{{item.name}}</el-radio-button>
        </el-radio-group>
      </div>
      <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" border></tableComponent>
    </div>
  </div>
</template>

<script>
import echarts from "@c/Echarts.vue";
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import datePointComponent from "@c/DatePointComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import { granularity, WMScode } from "@utils/objArrData";
import { getDaysBefore } from "@utils/index";
import CountTo from "vue-count-to";
import All from "@api/all";

export default {
  components: {
    echarts,
    selectComponent,
    datePickerComponent,
    datePointComponent,
    tableComponent,
    CountTo
  },
  data() {
    return {
      chart8alldata: {},
      showHeader: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      eg: "", // 排序
      granularity: granularity(),
      typeOptions: [
        {
          code: -1,
          name: "全部"
        },
        {
          code: 1,
          name: "拣货员"
        },
        {
          code: 2,
          name: "复核员"
        }
      ],
      distributeOptions: [
        {
          code: 1,
          name: "库区分布"
        },
        {
          code: 2,
          name: "高低位分布"
        }
      ],
      queryDimension: 1,
      WMScode: WMScode(),
      fromDate: [],
      datePoint: "",
      chartOption: {},
      chart: {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}件 ({d}%)"
        },
        legend: {
          // orient: "vertical",
          left: 10,
          data: []
        },
        series: [
          {
            name: "件数量",
            type: "pie",
            radius: ["50%", "70%"],
            // center: ['50%', '60%'],

            data: []
          }
        ]
      },
      chart1: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '件数量',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '40%'],
            label: {
              position: 'inner'
            },
            labelLine: {
                show: false
            },
            data: []
          },
          {
            name: '件数量',
            type: 'pie',
            radius: ['50%', '70%'],
            data: []
          }
        ]
      },
      headTable: [],
      dataList: [],
      timeDimension: 4,
      chartLoading: false,
      tableLoading: false,
      showPage: true,
      nowPageNum: null,
      isPie: false,
      isPie1: false,
      isLine: false,
      listData: [
        {
          name: "日均条目数",
          chartMethod: All.wmsDetailChart0(),
          tableMethod: All.wmsDetailList0()
        },
        {
          name: "收货上架及时率",
          chartMethod: All.wmsDetailChart1(),
          tableMethod: All.wmsDetailList1()
        },
        {
          name: "出库及时率",
          chartMethod: All.wmsDetailChart2(),
          tableMethod: All.wmsDetailList2()
        },
        {
          name: "破损率",
          chartMethod: All.wmsDetailChart3(),
          tableMethod: All.wmsDetailList3()
        },
        {
          name: "出库箱数",
          chartMethod: All.wmsDetailChart4(),
          tableMethod: All.wmsDetailList4()
        },
        {
          name: "个人小时效率",
          chartMethod: All.wmsDetailChart5(),
          tableMethod: All.wmsDetailList5()
        },
        {
          name: "库存分布",
          chartMethod: All.wmsDetailChart6(),
          tableMethod: All.wmsDetailList6()
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
    $route(to, from) {
      if (to.query.analysis != from.query.analysis) {
        this.getData();
        this.init();
        this.initChart();
        this.getChart();
        this.getTable();
      }
    }
  },
  created() {
    this.getData();
    this.init();
    this.initChart();
    this.getChart();
    this.getTable();
  },
  methods: {
    init() {
      if ("timeDimension" in this.$route.query) {
        this.timeDimension = +this.$route.query.timeDimension;
      }
      this.pageSize = 10;
      this.pageNum = 1;
      this.getTime();
      console.log(this.datePoint)
      if (this.nowPageNum == 0) {
        this.timeDimension = 3;
      }
      this.fromDate = this.$store.state.defaultToday;
    },
    getTime() {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      this.datePoint = `${this.$store.state.datePoint} ${hours}:${minutes}`; // ${hours}:${minutes} // 12:00:00
    },
    initChart() {
      if (this.nowPageNum == 2) {
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
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ["出库及时率", "已出库条目数"]
          },
          xAxis: {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          },
          yAxis: [
            {
              type: "value",
              name: "出库及时率",
              min: 0,
              max: 100,
              interval: 20,
              axisLabel: {
                formatter: "{value} %"
              }
            },
            {
              type: "value",
              name: "已出库条目数",
              // min: 0,
              // max: 3000000,
              interval: 600000,
              axisLabel: {
                formatter: "{value}"
              }
            }
          ],
          series: [
            {
              name: "出库及时率",
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
            },
            {
              name: "已出库条目数",
              type: "bar",
              yAxisIndex: 1,
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
        };
      } else if (this.nowPageNum == 3) {
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
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ["破损率", "损失金额"]
          },
          xAxis: {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          },
          yAxis: [
            {
              type: "value",
              name: "破损率",
              min: 0,
              // max: 100,
              interval: 20,
              axisLabel: {
                formatter: "{value} ‱"
              }
            },
            {
              type: "value",
              name: "损失金额",
              interval: 600000,
              axisLabel: {
                formatter: "{value} 元"
              }
            }
          ],
          series: [
            {
              name: "破损率",
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
            },
            {
              name: "损失金额",
              type: "bar",
              yAxisIndex: 1,
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
        };
      } else {
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
              }
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
        };
      }
    },
    getData() {
      this.isPie = false;
      this.isPie1 = false;
      this.isLine = false;
      let num = this.$route.query.analysis;
      this.nowPageNum = num;
    },
    getChart() {
      this.chartLoading = true;
      this.initChart();
      this.chartOption.title.text = this.listData[this.nowPageNum].name;
      let params = {};
      if (this.nowPageNum != 6) {
        params.timeDimension = this.timeDimension;
        params.startDate = this.$GetApiTime(this.fromDate[0]);
        params.endDate = this.$GetApiTime(this.fromDate[1]);
      } else {
        params.date = this.$GetApiTime(this.datePoint);
      }
      if (this.nowPageNum == 5 || this.nowPageNum == 6) {
        params.queryDimension = this.queryDimension;
      }
      All.postAPI({
        method: this.listData[this.nowPageNum].chartMethod,
        params: params
      })
        .then(res => {
          if (this.nowPageNum == 6) {
            let data0 = [];
            let data1 = [];
            let arr = res.item;
            for (let i = 0; i < arr.length; i++) {
              data0.push({
                value: arr[i].amount,
                name: arr[i].name
              });
              if ("children" in arr[i]) {
                let children = arr[i].children;
                children.forEach(item => {
                  console.log(item)
                  data1.push({
                    value: item.amount,
                    name: item.name
                  });
                })
              }
            }
            this.chart8alldata.title = res.title;
            this.chart8alldata.data = res.totalAmount;
            this.chart.series[0].data = data0;
            if (this.queryDimension == 2) {
              this.chart1.series[0].data = data0;
              this.chart1.series[1].data = data1;
              this.isPie1 = true;
              this.isPie = false;
            } else {
              this.isPie = true;
              this.isPie1 = false;
            }
            this.isLine = false;
          } else {
            if (this.nowPageNum == 0) {
              if (this.timeDimension === 1) {
                this.chartOption.title.text =
                  "年度" + this.listData[this.nowPageNum].name;
              } else if (this.timeDimension === 2) {
                this.chartOption.title.text =
                  "月度" + this.listData[this.nowPageNum].name;
              } else if (this.timeDimension === 3) {
                this.chartOption.title.text = this.listData[
                  this.nowPageNum
                ].name;
              }
            } else {
              this.chartOption.title.text = this.listData[this.nowPageNum].name;
            }
            let legendArr = [];
            let xAxisData = [];
            if (this.nowPageNum != 2 && this.nowPageNum != 3) {
              Object.keys(res[0]).forEach((item, index) => {
                let text = this.$MapStr(item, this.WMScode);
                if (text === "日均条目数" && this.nowPageNum == 4) {
                  text = "出库箱数";
                }
                if (text !== "-" && text !== "日期") {
                  if (this.nowPageNum == 4) {
                    this.chartOption.series = {
                      name: text,
                      type: "bar",
                      data: []
                    };
                    for (let j = 0; j < res.length; j++) {
                      this.chartOption.series.data.push(res[j][item]);
                      if (xAxisData.length < res.length) {
                        let str = res[j].time;
                        xAxisData.push(this.$ToTime(str));
                      }
                    }
                  } else {
                    this.chartOption.series[index] = {
                      name: text,
                      type: this.nowPageNum == 5 ? "bar" : "line",
                      data: []
                    };
                    for (let j = 0; j < res.length; j++) {
                      this.chartOption.series[index].data.push(res[j][item]);
                      if (xAxisData.length < res.length) {
                        let str = res[j].time;
                        xAxisData.push(this.$ToTime(str));
                      }
                    }
                  }
                }
              });
            } else if (this.nowPageNum == 2) {
              for (let j = 0; j < res.length; j++) {
                this.chartOption.series[0].data.push(res[j].rate);
                this.chartOption.series[1].data.push(res[j].counts);
                xAxisData.push(res[j].time);
              }
              this.chartOption.xAxis.boundaryGap = false;
            } else if (this.nowPageNum == 3) {
              for (let j = 0; j < res.length; j++) {
                this.chartOption.series[0].data.push(res[j].damageRate);
                this.chartOption.series[1].data.push(res[j].damageMoney);
                xAxisData.push(res[j].time);
              }
              this.chartOption.xAxis.boundaryGap = false;
            }
            if (this.nowPageNum == 5) {
              legendArr = ["个人小时效率(整件)", "个人小时效率(散件)"];
              this.chartOption.xAxis.boundaryGap = true;
            }
            if (this.nowPageNum == 4) {
              this.chartOption.xAxis.boundaryGap = true;
            }
            if (this.nowPageNum == 3) {
              this.chartOption.yAxis.axisLabel = {
                formatter: '{value} ‱'
              }
            }
            this.chartOption.xAxis.data = xAxisData;
            this.chartOption.legend.data = legendArr;
            this.isPie = false;
            this.isPie1 = false;
            this.isLine = true;
          }
        })
        .catch(() => {
          this.chartOption = {};
        })
        .finally(() => {
          this.chartLoading = false;
        });
    },
    getTable() {
      this.tableLoading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg
      };
      if (this.nowPageNum != 6) {
        params.timeDimension = this.timeDimension;
        params.startDate = this.$GetApiTime(this.fromDate[0]);
        params.endDate = this.$GetApiTime(this.fromDate[1]);
      } else {
        params.date = this.$GetApiTime(this.datePoint);
      }
      if (this.nowPageNum == 5 || this.nowPageNum == 6) {
        params.queryDimension = this.queryDimension;
      }
      All.postAPI({
        method: this.listData[this.nowPageNum].tableMethod,
        params: params
      })
        .then(res => {
          this.total = res.total;
          let result = res.list;
          let headTable = [];
          if (result.length) {
            Object.keys(result[0]).forEach(i => {
              let text = this.$MapStr(i, this.WMScode);
              if (i === "counts") {
                if (this.nowPageNum == 0) {
                  if (this.timeDimension === 1) {
                    text = "年度" + this.listData[this.nowPageNum].name;
                  } else if (this.timeDimension === 2) {
                    text = "月度" + this.listData[this.nowPageNum].name;
                  } else if (this.timeDimension === 3) {
                    text = this.listData[this.nowPageNum].name;
                  }
                } else if (this.nowPageNum == 2) {
                  text = "已出库条目数";
                } else if (this.nowPageNum == 4) {
                  text = "出库箱数";
                }
              }
              if (i === "name") {
                if (this.nowPageNum == 5) {
                  if (this.queryDimension === -1) {
                    text = "全部";
                  } else if (this.queryDimension === 1) {
                    text = "拣货员";
                  } else if (this.queryDimension === 2) {
                    text = "复核员";
                  }
                }
              }
              if (i === "amount") {
                if (this.nowPageNum == 6) {
                  text = "仓库件数量(件)";
                }
              }
              let obj = {
                text: text,
                field: i,
                sortable: text === "整件(件)" || text === "散件(条目)" ? i : ""
              };
              if (text !== "-") {
                headTable.push(obj);
              }
            });
            if (this.nowPageNum == 5) {
              headTable.unshift({
                text: "序号",
                field: "index"
              });
            }
            if ( this.nowPageNum == 6) {
              if (this.queryDimension === 1) {
                headTable.unshift({
                  text: "序号",
                  field: "no"
                });
              }
            }
            this.headTable = headTable;
            this.dataList = result;
          } else {
            this.dataList = [];
            this.$Notif({
              title: "提示",
              message: `当前筛选条件下暂无数据`,
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
      this.getChart();
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
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg,
      }
      let params1 = {
        queryDimension: this.queryDimension,
      }
      let params2 = {
        date: this.$GetApiTime(this.fromDate[0]),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg,
      }
      if (this.nowPageNum == 0) {
        method = All.wmsExport0();
      } else if (this.nowPageNum == 1) {
        method = All.wmsExport1();
      } else if (this.nowPageNum == 2) {
        method = All.wmsExport2();
      } else if (this.nowPageNum == 3) {
        method = All.wmsExport3();
      } else if (this.nowPageNum == 4) {
        method = All.wmsExport4();
      } else if (this.nowPageNum == 5) {
        method = All.wmsExport5();
        params = {...params,...params1};
      } else if (this.nowPageNum == 6) {
        method = All.wmsExport6();
        params = params2;
      }
      this.$GetDownload(method, params);
    }
  }
};
</script>
<style lang="scss" scoped>
.main-box {
  .chart8alldata {
    width: 100%;
    right: 0;
  }
}
</style>