<template>
  <div id="monitor">
    <div class="header">
      <div class="left">
        <h5>物流实时监控</h5>
      </div>
      <div class="right">
        <el-form :inline="true" label-position="right" class="selectBox">
          <el-form-item label="时间 : ">{{fromDate.substr(0, 16)}}</el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="search">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-box">
      <listBox v-loading="listBoxLoading" :listData="listData"></listBox>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading" :title="chartTitle[0]" from="TMS" :islink="true" :chartOption="chart" boxType="echartFrom" :fromData="fromData"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading1" :title="chartTitle[1]" from="TMS" :islink="false" :chartOption="chart1" class="min"></chartBox>
      <!-- :select="select" @changeSelect="changeSelect" -->
      <chartBox v-loading="chartLoading2" :title="chartTitle[2]" from="TMS" :islink="true" :chartOption="chart2" class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading3" :title="chartTitle[3]" from="TMS" :islink="true" :select="select1()" @changeSelect="changeSelect" boxType="table" :headTable="headTable" :tableData="tableData" :showPage="false" class="min"></chartBox>
      <chartBox v-loading="chartLoading4" :title="chartTitle[4]" from="TMS" :islink="true" :chartOption="chart4" :fromData="fromData1" class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading5" :title="chartTitle[5]" from="TMS" :islink="true" :chartOption="chart5" class="min"></chartBox>
      <!-- :select="select2" @changeSelect="changeSelect" -->
      <chartBox v-loading="chartLoading6" :title="chartTitle[6]" from="TMS" :islink="true" :chartOption="chart6" class="min"></chartBox>
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
      chartLoading: false,
      chartLoading1: true,
      chartLoading2: true,
      chartLoading3: true,
      chartLoading4: true,
      chartLoading5: true,
      chartLoading6: true,
      eg: "",
      fromDate: "",
      queryDimension: 1,
      chartTitle: [
        "接货量",
        "合纵货物数",
        "出库及时率",
        "个人效率",
        "区域送货量",
        "出库时效",
        "客户投诉"
      ],
      listData: [
        {
          name: "应发件数（个）",
          code: 0,
          icon: "#icon-huiyuan",
          color: "#40c9c6"
        },
        {
          name: "未传输TMS件数（个）",
          code: 0,
          icon: "#icon-huiyuan",
          color: "#36a3f7"
        },
        {
          name: "实际配送件数（个）",
          code: 0,
          icon: "#icon-xiadan",
          color: "#34bfa3"
        },
        {
          name: "未完成条目数（个）",
          code: 0,
          icon: "#icon-qianbi",
          color: "#f4516c"
        }
      ],
      headTable: [],
      tableData: [],
      fromData: [],
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
      select: [
        {
          name: "显示",
          default: 1,
          options: []
        }
      ],
      select2: [],
      chartData: {},
      chart: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res, true);
          }
        },
        legend: {
          data: [],
          left: "center"
        },
        title: {
          left: "center"
        },
        grid: {
          top: "16%",
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
        series: []
      },
      chart1: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false
          },
          formatter: res => {
            return this.$ChartFormatter(res, true);
          }
        },
        legend: {
          data: [],
          left: "center"
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
          // axisLabel: {
          //   interval: 2,
          //   rotate: -30
          // },
        },
        yAxis: [
          {
            type: "value",
            position: "left",
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        dataZoom: [
          {
            // type: "inside",
            start: 20,
            end: 80
          },
          {
            start: 20,
            end: 80
          }
        ],
        series: []
      },
      chart2: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: res => {
            return this.$ChartFormatter(res, true);
          }
        },
        legend: {
          data: []
        },
        grid: {
          top: "16%",
          left: "3%",
          right: "4%",
          bottom: "10%",
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
              formatter: "{value}%"
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
        dataZoom: [
          {
            start: 20,
            end: 80
          },
          {
            start: 20,
            end: 80
          }
        ],
        series: []
      },
      chart4: {
        tooltip: {
          trigger: "item"
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center"
        },
        visualMap: {
          min: 0,
          max: 50000,
          text: ["High", "Low"],
          realtime: false,
          calculable: false,
          show: false
          // inRange: {
          //     color: ['lightskyblue','yellow', 'orangered']
          // }
        },
        series: [
          {
            name: "",
            type: "map",
            mapType: "china",
            zoom: 1.2,
            roam: false,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false
              }
            },
            data: []
          }
        ]
      },
      chart5: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res, true);
          }
        },
        legend: {
          data: []
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
              formatter: "{value}"
            }
          }
        ],
        series: []
      },
      chart6: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
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
        series: []
      }
    };
  },
  created() {
    this.init();
    this.search();
  },
  methods: {
    search() {
      this.getListData();
      this.chartLoading = this.chartLoading1 = this.chartLoading2 = this.chartLoading3 = this.chartLoading4 = this.chartLoading5 = this.chartLoading6 = true;
      this.getChart(All.tmsHome1(), 0);
      this.getChart(All.tmsHome2(), 1);
      this.getChart(All.tmsHome3(), 2);
      this.getChart(All.tmsHome4(), 3);
      this.getChart(All.tmsHome5(), 4);
      this.getChart(All.tmsHome6(), 5);
      this.getChart(All.tmsHome7(), 6);
    },
    getListData() {
      this.listBoxLoading = true;
      let params = {
        date: this.$GetApiTime(this.fromDate)
      };
      All.postAPI({
        method: All.tmsHome0(),
        params: params
      })
        .then(res => {
          this.listData[0].code = res.shouldSend;
          this.listData[1].code = res.notTransmit;
          this.listData[2].code = res.delivered;
          this.listData[3].code = res.notCompleteItem;
        })
        .finally(() => {
          this.listBoxLoading = false;
        });
    },
    getChart(str, num, type = null) {
      let params = {
        // date: this.$GetApiTime(this.fromDate)
        date: "20200401"
      };
      if (num === 3) {
        params.eg = this.eg;
      }
      All.postAPI({
        method: str,
        params: params
      })
        .then(res => {
          if (num === 0) {
            let labelArr = Object.keys(res.departmentReceived);
            let dataArr = Object.keys(res.departmentChartData);
            let xAxis = [];
            let value = [];
            for (let i = 0; i < labelArr.length; i++) {
              let label = labelArr[i];
              let total = res.departmentReceived[labelArr[i]];
              this.fromData[i] = {
                label: label,
                value: total
              };
              value[i] = [];
              for (let j = 0; j < dataArr.length; j++) {
                if (xAxis.length < dataArr.length) {
                  xAxis.push(this.$ToTime(dataArr[j]).substr(11));
                }
                let arr = res.departmentChartData[dataArr[j]];
                for (let k = 0; k < arr.length; k++) {
                  if (arr[k].label === label) {
                    value[i].push(arr[k].value);
                  }
                }
              }
              this.chart.series[i] = {
                name: label,
                type: "line",
                smooth: true,
                symbol: "none",
                sampling: "average",
                data: value[i]
              };
            }
            this.chart.legend.data = labelArr;
            this.chart.xAxis.data = xAxis;
            console.log(this.chart);
          } else if (num === 1) {
            this.chartData = res;
            this.select[0].default = res.dimensions[0];
            let xAxis = [];
            let data = [];
            let dataArr = Object.keys(res.dimensionChartData);
            let arr = res.dimensions;
            // arr.forEach((item, index) => {
            //   this.select[0].options[index] = {
            //     name: item,
            //     code: item
            //   };
            // });
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              data[i] = [];
              for (let j = 0; j < dataArr.length; j++) {
                if (xAxis.length < dataArr.length) {
                  xAxis.push(this.$ToTime(dataArr[j]).substr(11));
                }
                let arr = res.dimensionChartData[dataArr[j]];
                for (let j = 0; j < arr.length; j++) {
                  if (arr[j].label === item) {
                    data[i].push(arr[j].value);
                  }
                }
              }
              this.chart1.series[i] = {
                name: item,
                type: "line",
                data: data[i]
              };
            }
            this.chart1.xAxis.data = xAxis;
            this.chart1.legend.data = arr;
          } else if (num === 2) {
            let xAxis = [];
            let data = [];
            let data1 = [];
            let dataArr = Object.keys(res.timelyRateChartData);
            let dataArr1 = Object.keys(res.notDistributeChartData);
            let arr = res.dimensions;
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              data[i] = [];
              for (let j = 0; j < dataArr.length; j++) {
                if (xAxis.length < dataArr.length) {
                  xAxis.push(this.$ToTime(dataArr[j]).substr(11));
                }
                let arr1 = res.timelyRateChartData[dataArr[j]];
                for (let k = 0; k < arr1.length; k++) {
                  if (arr1[k].label === item) {
                    data[i].push(arr1[k].value);
                  }
                }
              }
              this.chart2.series[i * 2 + 1] = {
                name: item,
                type: "line",
                data: data[i]
              };
              data1[i] = [];
              for (let j = 0; j < dataArr1.length; j++) {
                let arr1 = res.notDistributeChartData[dataArr1[j]];
                for (let k = 0; k < arr1.length; k++) {
                  if (arr1[k].label === item) {
                    data1[i].push(arr1[k].value);
                  }
                }
              }
              this.chart2.series[i * 2] = {
                name: item,
                type: "bar",
                data: data1[i],
                yAxisIndex: 1,
                stack: "bar"
              };
            }
            this.chart2.xAxis.data = xAxis;
            this.chart2.legend.data = arr;
          } else if (num === 3) {
            this.headTable = [
              {
                text: "排名",
                field: "index",
                width: "100"
              },
              {
                text: "司机",
                field: "name"
              },
              {
                text: "件数",
                field: "itemCount",
                sortable: "itemCount"
              },
              {
                text: "客户数",
                field: "customerCount",
                sortable: "customerCount"
              }
            ];
            this.chartData = res;
            if (this.queryDimension == 1) {
              this.headTable[1].text = "司机";
              this.tableData = this.chartData.driverData;
            } else if (this.queryDimension == 2) {
              this.headTable[1].text = "备货员";
              this.tableData = this.chartData.cargoPrepperData;
            } else if (this.queryDimension == 3) {
              this.headTable[1].text = "装车员";
              this.tableData = this.chartData.loaderData;
            }
            console.log(this.tableData)
          } else if (num === 4) {
            let data = [];
            let max = 0;
            let arr = res.deliverAmount;
            for (let i = 0; i < arr.length; i++) {
              let value = arr[i].amount;
              if (max < value) {
                max = value;
              }
              data.push({
                value: value || 0,
                name: arr[i].provinceName
                // .replace("省", "")
                // .replace("自治区", "")
                // .replace("维吾尔", "")
                // .replace("壮族", "")
                // .replace("回族", "")
                // .replace("市", "")
              });
            }
            this.chart4.visualMap.max = max;
            this.chart4.series[0].name = "送货量";
            this.chart4.series[0].data = data;
          } else if (num === 5) {
            let xAxis = [];
            let data = [];
            let data1 = [];
            let dataArr = res.dimensionChartData;
            let arr = res.dimensions;
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              let arr1 = dataArr[item];
              arr1.forEach((el, ind) => {
                if (el.label === "直配") {
                  data.push({ value: el.value, per: el.rate });
                } else if (el.label === "干线") {
                  data1.push({ value: el.value, per: el.rate });
                }
              });
              xAxis.push(item + "小时");
            }
            this.chart5.series = [
              {
                name: "直配",
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
              },
              {
                name: "干线",
                type: "line",
                data: data1,
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
            ];
            this.chart5.legend.data = ["直配", "干线"];
            this.chart5.xAxis.data = xAxis;
          } else if (num === 6) {
            let xAxis = [];
            let data = [];
            let dataArr = Object.keys(res.typeChartData);
            let arr = res.dimensions;
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              data[i] = [];
              for (let j = 0; j < dataArr.length; j++) {
                if (xAxis.length < dataArr.length) {
                  xAxis.push(this.$ToTime(dataArr[j]).substr(11));
                }
                let arr1 = res.typeChartData[dataArr[j]];
                for (let k = 0; k < arr1.length; k++) {
                  if (arr1[k].label === item && item !== "投诉总量") {
                    data[i].push(arr1[k].value);
                  }
                }
              }
              this.chart6.series[i] = {
                name: item,
                type: "bar",
                data: data[i],
                stack: "bar"
              };
            }
            this.chart6.legend.data = arr.splice(1);
            this.chart6.xAxis.data = xAxis;
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
      this.$SetStorage("tmsTime", this.fromDate);
    },
    select1: () => {
      return [
        {
          default: 1,
          options: [
            {
              code: 1,
              name: "司机"
            },
            {
              code: 2,
              name: "备货员"
            },
            {
              code: 3,
              name: "装车员"
            }
          ]
        }
      ];
    },
    changeSelect(e, name, title) {
      console.log(e, name, title);
      this.queryDimension = e;
      if (title === this.chartTitle[1]) {
        this.changeChart(1, e);
      } else if (title === this.chartTitle[3]) {
        this.changeChart(3, e);
      } else if (title === this.chartTitle[8]) {
        this.chartLoading8 = true;
        this.getChart(All.tmsHome8(), 8, e);
      }
    },
    // 排序回调
    sortableChange() {
      this.chartLoading3 = true;
      this.getChart(All.tmsHome4(), 3);
    },
    changeChart(num, type) {
      switch (num) {
        case 1:
          let xAxis = [];
          let value = [];
          let dataArr = Object.keys(this.chartData.dimensionChartData);
          for (let j = 0; j < dataArr.length; j++) {
            let arr = this.chartData.dimensionChartData[dataArr[j]];
            for (let k = 0; k < arr.length; k++) {
              if (arr[k].label === type) {
                value.push(arr[k].value);
              }
            }
          }
          this.chart1.series = {
            name: type,
            type: "line",
            data: value
          };
        case 3:
          if (type == 1) {
            this.headTable[1].text = "司机";
            this.tableData = this.chartData.driverData;
          } else if (type == 2) {
            this.headTable[1].text = "备货员";
            this.tableData = this.chartData.cargoPrepperData;
          } else if (type == 3) {
            this.headTable[1].text = "装车员";
            this.tableData = this.chartData.loaderData;
          }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
