<template>
  <div id="monitor">
    <div class="header">
      <div class="left">
        <h5>仓库数据监控</h5>
      </div>
      <div class="right">
        <el-form :inline="true" label-position="right" class="selectBox">
          <!-- <el-form-item label="时间 : ">
            {{fromDate.substr(0, 16)}}
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="search">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-box">
      <listBox v-loading="listBoxLoading" :listData="listData"></listBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading" :title="chartTitle[0]" from="WMS" :islink="false" :time="{range:fromDate}" :chartOption="chart" class="min"></chartBox>
      <chartBox v-loading="chartLoading1" :title="chartTitle[1]" from="WMS" :islink="false" :time="{range:fromDate}" :chartOption="chart1" class="min"></chartBox>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading2" :title="chartTitle[2]" from="WMS" :islink="false" :time="{range:fromDate}" :chartOption="chart2" :select="select()"
        @changeSelect="changeSelect"></chartBox>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading3" :title="chartTitle[3]" from="WMS" :islink="true" :time="{range:fromDate}" :chartOption="chart3" boxType="echartFrom" :fromData="fromData">
      </chartBox>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading4" :title="chartTitle[4]" from="WMS" :islink="true" :time="{range:fromDate}" :chartOption="chart4" boxType="echartFrom"
        :fromData="fromData1"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading5" :title="chartTitle[5]" from="WMS" :islink="true" :time="{range:fromDate}" :chartOption="chart5" class="min"></chartBox>
      <chartBox v-loading="chartLoading6" :title="chartTitle[6]" from="WMS" :islink="true" :time="{range:fromDate}" :chartOption="chart6" class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading7" :title="chartTitle[7]" from="WMS" :islink="true" :time="{range:fromDate}" :select="select1()" @changeSelect="changeSelect" boxType="table"
        :headTable="headTable" :tableData="tableData" :showPage="false" class="min"></chartBox>
      <chartBox v-loading="chartLoading8" :title="chartTitle[8]" from="WMS" :islink="true" :time="{range:fromDate}" :select="select2()" @changeSelect="changeSelect" :chartOption="queryDimension == 2 ? chart8a : chart8" :totalData="chart8Data"
        :totalTitle="chart8Title" class="min"></chartBox>
    </div>
  </div>
</template>

<script>
import chartBox from "@c/ChartBox.vue";
import listBox from "./ListBox.vue";
import { getDaysBefore } from "@utils/index";
import All from "@api/all";
const echarts = require("echarts");
export default {
  components: {
    chartBox,
    listBox
  },
  data() {
    return {
      listBoxLoading: true,
      chartLoading: true,
      chartLoading1: true,
      chartLoading2: true,
      chartLoading3: true,
      chartLoading4: true,
      chartLoading5: true,
      chartLoading6: true,
      chartLoading7: true,
      chartLoading8: true,
      eg: "",
      fromDate: "",
      queryDimension: 1,
      chartTitle: [
        "小时接单量",
        "复核小时产能",
        "拣货小时产能",
        "收货上架及时率",
        "出库及时率",
        "破损率",
        "出库箱数",
        "个人小时效率",
        "库存分布"
      ],
      listData: [
        {
          name: "应发条目数（个）",
          code: 0,
          icon: "#icon-huiyuan",
          color: "#40c9c6"
        },
        {
          name: "未审核条目数（个）",
          code: 0,
          icon: "#icon-huiyuan",
          color: "#36a3f7"
        },
        {
          name: "未下发条目数（个）",
          code: 0,
          icon: "#icon-xiadan",
          color: "#34bfa3"
        },
        {
          name: "实发条目数（个）",
          code: 0,
          icon: "#icon-qianbi",
          color: "#f4516c"
        },
        {
          name: "未完成条目数（个）",
          code: 0,
          icon: "#icon-qianbi",
          color: "#f4516c"
        },
        {
          name: "每日库存量（件）",
          code: 0,
          icon: "#icon-qianbi",
          color: "#34bfa3"
        },
        {
          name: "月度日均条目数（个）",
          code: 0,
          icon: "#icon-xiadan",
          color: "#36a3f7",
          link: "/wms/itembdy?timeDimension=2"
        },
        {
          name: "年度日均条目数（个）",
          code: 0,
          icon: "#icon-qianbi",
          color: "#40c9c6",
          link: "/wms/itembdy?timeDimension=1"
        }
      ],
      headTable: [],
      tableData: [],
      fromData: [
        {
          label: "最新收货上架及时率（整件）",
          value: 0,
          unit: "%"
        },
        {
          label: "最新收货上架及时率（散件）",
          value: 0,
          unit: "%"
        }
      ],
      fromData1: [
        {
          label: "最新出库及时率",
          value: 0,
          unit: "%"
        },
        {
          label: "最新已出库条目数",
          value: 0
        }
      ],
      chart: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res);
          },
          position: function (pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center"
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "小时接单量",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            data: []
          }
        ]
      },
      chart1: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false
          },
          formatter: res => {
            return this.$ChartFormatter(res);
          }
        },
        legend: {
          data: ["复核总条目", "复核总人数"],
          left: "center"
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: []
        },
        yAxis: [
          {
            type: "value",
            position: "left",
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            position: "right",
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "复核总条目",
            type: "bar",
            data: []
          },
          {
            name: "复核总人数",
            type: "bar",
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      chart2: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: res => {
            return this.$ChartFormatter(res);
          }
        },
        legend: {
          data: ["拣货人数", "拣货完成总条目"]
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: [
          {
            type: "value",
            position: "left",
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            position: "right",
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "拣货人数",
            type: "bar",
            barWidth: "40%",
            data: []
          },
          {
            name: "拣货完成总条目",
            type: "bar",
            barWidth: "40%",
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      chart3: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res);
          }
        },
        legend: {
          data: ["收货上架及时率(散件)", "收货上架及时率(整件)"]
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
          // splitLine: {
          //   lineStyle: {
          //     type: "dashed"
          //   }
          // }
        },
        series: [
          {
            name: "收货上架及时率(散件)",
            type: "line",
            data: []
          },
          {
            name: "收货上架及时率(整件)",
            type: "line",
            data: []
          }
        ]
      },
      chart4: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res);
          },
          axisPointer: {
            type: "cross"
          }
        },
        legend: {
          data: ["出库及时率", "已出库条目数"]
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          data: []
        },
        yAxis: [
          {
            type: "value",
            // name: '已出库条目数',
            // min: 0,
            // max: 25,
            position: "left",
            // axisLine: {
            //   lineStyle: {
            //     color: colors[1]
            //   }
            // },
            axisLabel: {
              formatter: "{value} %"
            }
          },
          {
            type: "value",
            // name: '出库及时率',
            // min: 0,
            // max: 250,
            position: "right",
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "出库及时率",
            type: "line",
            data: []
          },
          {
            name: "已出库条目数",
            type: "bar",
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      chart5: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res);
          },
          position: function (pt) {
            return [pt[0], "10%"];
          }
        },
        legend: {
          data: ["破损率", "损失金额"]
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        title: {
          left: "center"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: [
          {
            type: "value",
            position: "left",
            axisLabel: {
              formatter: "{value} ‱"
            }
          },
          {
            type: "value",
            position: "right",
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "破损率",
            type: "line",
            data: []
          },
          {
            name: "损失金额",
            type: "bar",
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      chart6: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: res => {
            return this.$ChartFormatter(res);
          }
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: []
          // axisTick: {
          //   alignWithLabel: true
          // }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "出库箱数",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      },
      chart8: {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: res => {
            return this.$ChartFormatter([res]);
          }
        },
        legend: {
          // orient: "vertical",
          left: 10,
          data: []
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        series: [
          {
            name: "件数量",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            // avoidLabelOverlap: true,
            data: []
          }
        ]
      },
      chart8Title: "",
      chart8Data: "",
      chart8a: {
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
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.init();
      this.getListData();
      this.chartLoading = this.chartLoading1 = this.chartLoading2 = this.chartLoading3 = this.chartLoading4 = this.chartLoading5 = this.chartLoading6 = this.chartLoading7 = this.chartLoading8 = true;
      this.getChart(All.wmsHome0(), 0);
      this.getChart(All.wmsHome1(), 1);
      this.getChart(All.wmsHome2(), 2);
      this.getChart(All.wmsHome3(), 3);
      this.getChart(All.wmsHome4(), 4);
      this.getChart(All.wmsHome5(), 5);
      this.getChart(All.wmsHome6(), 6);
      this.getChart(All.wmsHome7(), 7);
      this.getChart(All.wmsHome8(), 8);
    },
    getListData() {
      this.listBoxLoading = true;
      let params = {
        date: this.$GetApiTime(this.fromDate)
      };
      All.postAPI({
        method: All.wmsSum(),
        params: params
      })
        .then(res => {
          this.listData[0].code = res.deliveringCounts;
          this.listData[1].code = res.unAuditingCounts;
          this.listData[2].code = res.undeliverCounts;
          this.listData[3].code = res.deliveredCounts;
          this.listData[4].code = res.uncompleteCounts;
          this.listData[5].code = res.stockOfDay;
          this.listData[6].code = res.countsOfDayByMonth;
          this.listData[7].code = res.countsOfDayByYear;
        })
        .finally(() => {
          this.listBoxLoading = false;
        });
    },
    getChart(str, num, type = null) {
      let params = {
        date: this.$GetApiTime(this.fromDate)
      };
      if (num === 2 || num === 7 || num === 8) {
        params.queryDimension = this.queryDimension;
      }
      if (num === 7) {
        params.eg = this.eg;
      }
      All.postAPI({
        method: str,
        params: params
      })
        .then(res => {
          if (num === 0) {
            let time = [];
            let counts = [];
            for (let i = 0; i < res.length; i++) {
              time.push(res[i].time);
              counts.push(res[i].counts);
            }
            this.chart.xAxis.data = time;
            this.chart.series[0].data = counts;
          } else if (num === 1) {
            let time = [];
            let items = [];
            let nums = [];
            for (let i = 0; i < res.length; i++) {
              time.push(res[i].time);
              items.push(res[i].items);
              nums.push(res[i].nums);
            }
            this.chart1.xAxis.data = time;
            this.chart1.series[0].data = items;
            this.chart1.series[1].data = nums;
          } else if (num === 2) {
            let items = [];
            let nums = [];
            let time = [];
            for (let i = 0; i < res.length; i++) {
              time.push(res[i].time);
              nums.push(res[i].nums);
              items.push(res[i].items);
            }
            this.chart2.xAxis.data = time;
            this.chart2.series[0].data = nums;
            this.chart2.series[1].data = items;
          } else if (num === 3) {
            this.fromData[0].value = res.totalRateOfWhole;
            this.fromData[1].value = res.totalRateOfSpare;
            let data0 = [];
            let data1 = [];
            let time = [];
            let arr = res.items;
            for (let i = 0; i < arr.length; i++) {
              time.push(arr[i].time);
              data0.push(arr[i].rateOfWhole);
              data1.push(arr[i].rateOfSpare);
            }
            this.chart3.xAxis.data = time;
            this.chart3.series[0].data = data0;
            this.chart3.series[1].data = data1;
          } else if (num === 4) {
            this.fromData1[0].value = res.totalRate;
            this.fromData1[1].value = res.totalCounts;
            let data0 = [];
            let data1 = [];
            let time = [];
            let arr = res.items;
            for (let i = 0; i < arr.length; i++) {
              time.push(arr[i].time);
              data0.push(arr[i].rate);
              data1.push(arr[i].counts);
            }
            this.chart4.xAxis.data = time;
            this.chart4.series[0].data = data0;
            this.chart4.series[1].data = data1;
          } else if (num === 5) {
            let time = [];
            let data = [];
            let data1 = [];
            for (let i = 0; i < res.length; i++) {
              time.push(res[i].time);
              data.push(res[i].rate);
              data1.push(res[i].damageMoney);
            }
            this.chart5.xAxis.data = time;
            this.chart5.series[0].data = data;
            this.chart5.series[1].data = data1;
          } else if (num === 6) {
            let data0 = [];
            let time = [];
            let arr = res;
            for (let i = 0; i < arr.length; i++) {
              time.push(arr[i].time);
              data0.push(arr[i].counts);
            }
            this.chart6.xAxis.data = time;
            this.chart6.series[0].data = data0;
          } else if (num === 7) {
            this.headTable = [
              {
                text: "排名",
                minWidth: 50,
                field: "no"
              },
              {
                text: type === 2 ? "复核员" : "拣货员",
                minWidth: 100,
                field: "name"
              },
              {
                text: "整件(件)",
                minWidth: 100,
                field: "countsOfWhole",
                sortable: "countsOfWhole"
              },
              {
                text: "散件(条目)",
                minWidth: 100,
                field: "countsOfSpare",
                sortable: "countsOfSpare"
              }
            ];
            this.tableData = res;
          } else if (num === 8) {
            let data0 = [];
            let data1 = [];
            let arr = res.item;
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              data0.push({
                value: item.amount,
                name: item.warehouse,
                per: item.proportion
              });
              if ("children" in item) {
                let children = item.children;
                children.forEach(item => {
                  data1.push({
                    value: item.amount,
                    name: item.warehouse
                  });
                })
              }
            }
            if (this.queryDimension == 2) {
              this.chart8Title = "";
              this.chart8Data = "";
              this.chart8a.series[0].data = data0;
              this.chart8a.series[1].data = data1;
            } else {
              this.chart8Title = res.title;
              this.chart8Data = this.$ToThousands(res.totalAmount);
              this.chart8.series[0].data = data0;
            }
          }
        })
        .finally(() => {
          switch (num) {
            case 0:
              this.chartLoading = false;
            case 1:
              this.chartLoading1 = false;
            case 2:
              this.chartLoading2 = false;
            case 3:
              this.chartLoading3 = false;
            case 4:
              this.chartLoading4 = false;
            case 5:
              this.chartLoading5 = false;
            case 6:
              this.chartLoading6 = false;
            case 7:
              this.chartLoading7 = false;
            case 8:
              this.chartLoading8 = false;
          }
        });
    },
    init() {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      this.fromDate = `${this.$store.state.datePoint} ${hours}:${minutes}`; // ${hours}:${minutes} // 12:00:00
    },
    select: () => {
      return [
        {
          default: 1,
          options: [
            {
              code: 1,
              name: "散件"
            },
            {
              code: 2,
              name: "整件"
            }
          ]
        }
      ];
    },
    select1: () => {
      return [
        {
          default: 1,
          options: [
            {
              code: 1,
              name: "拣货员"
            },
            {
              code: 2,
              name: "复核员"
            }
          ]
        }
      ];
    },
    select2: () => {
      return [
        {
          default: 1,
          options: [
            {
              code: 1,
              name: "库区分布"
            },
            {
              code: 2,
              name: "高低位分布"
            }
          ]
        }
      ];
    },
    changeSelect(e, name, title) {
      console.log(e, name, title);
      this.queryDimension = e;
      if (title === this.chartTitle[2]) {
        this.chartLoading2 = true;
        this.getChart(All.wmsHome2(), 2);
      } else if (title === this.chartTitle[7]) {
        this.chartLoading7 = true;
        this.getChart(All.wmsHome7(), 7, e);
      } else if (title === this.chartTitle[8]) {
        this.chartLoading8 = true;
        this.getChart(All.wmsHome8(), 8, e);
      }
    },
    // 排序回调
    sortableChange() {
      this.chartLoading7 = true;
      this.getChart(All.wmsHome7(), 7);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
