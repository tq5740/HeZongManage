<template>
  <div id="monitor">
    <div class="header">
      <div class="left">
        <h5>销售数据监控</h5>
      </div>
      <div class="right">
        <el-form :inline="true" label-position="right" class="selectBox">
          <el-form-item label="时间">
            <datePickerComponent v-model="fromDate" style="float: left; margin-right: 13px"></datePickerComponent>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading" :title="chartTitle[0]" from="ERP" :islink="true" :time="chartLoading ? {range: '',time: ''} : time()" :select="select()" boxType="echartFrom" :chartOption="chart"
        :fromData="fromData" @changeSelect="changeSelect">
      </chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading1" :title="chartTitle[1]" from="ERP" :islink="true" :time="chartLoading1 ? {range: '',time: ''} : time()" :select="select()" :chartOption="chart1" @changeSelect="changeSelect"
        class="min"></chartBox>
      <chartBox v-loading="chartLoading2" :title="chartTitle[2]" from="ERP" :islink="true" :time="chartLoading2 ? {range: '',time: ''} : time()" :select="select1()" :chartOption="chart2" @changeSelect="changeSelect"
        class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading3" :title="chartTitle[3]" from="ERP" :islink="true" :time="chartLoading3 ? {range: '',time: ''} : time()" :select="select1()" :chartOption="chart3" @changeSelect="changeSelect"
        class="min"></chartBox>
      <chartBox v-loading="chartLoading4" :title="chartTitle[4]" from="ERP" :islink="true" :time="chartLoading4 ? {range: '',time: ''} : time()" :select="select1()" boxType="table" :headTable="headTable"
        :tableData="tableData" @changeSelect="changeSelect" :showPage="false" class="min">
      </chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading5" :title="chartTitle[5]" from="ERP" :islink="true" :time="chartLoading5 ? {range: '',time: ''} : time()" :select="select()" :chartOption="chart5" @changeSelect="changeSelect"
        class="min"></chartBox>
      <chartBox v-loading="chartLoading6" :title="chartTitle[6]" from="ERP" :islink="true" :time="chartLoading6 ? {range: '',time: ''} : time()" :select="select2()" :chartOption="chart6" @changeSelect="changeSelect"
        class="min"></chartBox>
    </div>
  </div>
</template>

<script>
import chartBox from "@c/ChartBox.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import All from "@api/all";
import { dateDifference } from "@utils/index";

export default {
  components: {
    chartBox,
    datePickerComponent
  },
  data() {
    return {
      chartLoading: true,
      chartLoading1: true,
      chartLoading2: true,
      chartLoading3: true,
      chartLoading4: true,
      chartLoading5: true,
      chartLoading6: true,
      fromDate: [],
      timeDimension: [2,2,2,2,2,2,2],
      queryDimension: [2,2,2,2,2,2,2],
      chartTitle: [
        "客户整体销售情况",
        "渠道销售",
        "区域销售",
        "客户类型销售",
        "品种销售",
        "部门销售",
        "部门欠款&回款"
      ],
      headTable: [],
      tableData: [],
      fromData: [
        {
          label: "客户数量（家）",
          value: 0
        },
        {
          label: "含税收入（万元）",
          value: 0
        },
        {
          label: "不含税收入（万元）",
          value: 0
        },
        {
          label: "含税成本（万元）",
          value: 0
        },
        {
          label: "不含税成本（万元）",
          value: 0
        }
      ],
      mapObj: {
        customerCounts: "客户数量",
        incomeOfTax: "含税收入",
        incomeOfNoneTax: "不含税收入",
        costOfTax: "含税成本",
        costOfNoneTax: "不含税成本"
      },
      mapArr: [
        "customerCounts",
        "incomeOfTax",
        "incomeOfNoneTax",
        "costOfTax",
        "costOfNoneTax"
      ],
      chart: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            let str;
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "客户整体销售情况") {
                this.queryDimension[0] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[0] === 1) + unit}`;
            });
            return `${res[0].name} <br> ${str}`;
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
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: res => {
            let str;
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "渠道销售") {
                this.queryDimension[1] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[1] === 1) + unit}`;
            });
            return `${res[0].name} <br> ${str}`;
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
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: []
      },
      chart2: {
        tooltip: {
          trigger: "item",
          formatter: res => {
            let str;
            let unit = "万";
            [res].forEach(i => {
              if (this.selectTitle === "区域销售") {
                this.queryDimension[2] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}${i.name}<br><div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[2] === 1) + unit}`;
            });
            return `${str}`;
          }
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          // feature: {
          //   dataView: { readOnly: true }
          // }
        },
        visualMap: {
          min: 0,
          max: 5000000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          show: false
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
      chart3: {
        tooltip: {
          trigger: "item",
          formatter: res => {
            let str;
            let unit = "万";
            [res].forEach(i => {
              if (this.selectTitle === "客户类型销售") {
                this.queryDimension[3] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[3] === 1) + unit}`;
            });
            return `${res.name} <br> ${str}(${res.percent}%)`;
          }
        },
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: []
        },
        series: [
          {
            name: '',
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
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            data: []
          }
        ]
      },
      chart5: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            let str = "";
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "部门销售") {
                this.queryDimension[5] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.data, this.queryDimension[5] === 1) + unit}`;
            });
            return `${res[0].name} <br> ${str}`;
          },
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
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: []
      },
      chart6: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            let str;
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "部门欠款&回款") {
                this.queryDimension[6] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[6] === 1) + unit}`;
            });
            return `${res[0].name} <br> ${str}`;
          },
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
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: [
          {
            name: "欠款",
            type: "bar",
            barWidth: "40%",
            data: []
          },
          {
            name: "回款",
            type: "bar",
            barWidth: "40%",
            data: []
          }
        ]
      },
      selectTitle: ""
    };
  },
  created() {
    this.init();
    this.search();
  },
  methods: {
    search() {
      this.$SetStorage("erpTime", this.fromDate)
      this.getSimple();
      this.chartLoading = this.chartLoading1 = this.chartLoading2 = this.chartLoading3 = this.chartLoading4 = this.chartLoading5 = this.chartLoading6 = true;
      this.getChart(All.erpTotal(), 0);
      this.getChart(All.erpChannel(), 1);
      this.getChart(All.erpArea(), 2);
      this.getChart(All.erpCustomerType(), 3);
      this.getChart(All.erpCategory(), 4);
      this.getChart(All.erpDept(), 5);
      this.getChart(All.erpDeptAndIncome(), 6);
    },
    time() {
      if (
        this.$GetStorage("erpTime").length
      ) {
        let timeArr = this.$GetStorage("erpTime");
        let arr = dateDifference(
          timeArr[0],
          timeArr[1]
        );
        return {
          range: `${timeArr[0].split(" ")[0]} - ${
            timeArr[1].split(" ")[0]
          }`,
          days: arr[0],
          hours: arr[1]
        };
      } else {
        let arr = dateDifference(
          this.$store.state.defaultTime[0],
          this.$store.state.defaultTime[1]
        );
        return {
          range: `${this.$store.state.defaultTime[0].split(" ")[0]} - ${
            this.$store.state.defaultTime[1].split(" ")[0]
          }`,
          days: arr[0],
          hours: arr[1]
        };
      }
    },
    getSimple() {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        timeDimension: this.timeDimension[0],
        queryDimension: this.queryDimension[0]
      };
      All.postAPI({
        method: All.erpSum(),
        params: params
      }).then(res => {
        this.fromData[0].value = res.customerCounts;
        this.fromData[1].value = res.incomeOfTax;
        this.fromData[2].value = res.incomeOfNoneTax;
        this.fromData[3].value = res.costOfTax;
        this.fromData[4].value = res.costOfNoneTax;
      });
    },
    getChart(str, num) {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1])
      };
      params.timeDimension = this.timeDimension[num];
      params.queryDimension = this.queryDimension[num];
      All.postAPI({
        method: str,
        params: params
      })
        .then(res => {
          if (num === 0) {
            let time = [];
            let data = [];
            let key = this.mapArr[this.queryDimension[num] - 1];
            this.chart.series[0] = {
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
            };
            for (let i = 0; i < res.length; i++) {
              let str = res[i].time;
              time.push(this.$ToTime(str));
              data.push(res[i][key]);
            }
            this.chart.xAxis.data = time;
            this.chart.series[0].name = this.mapObj[key];
            this.chart.series[0].data = data;
          } else if (num === 1) {
            let time = [];
            let legend = [];
            let arr = res.slice(1);
            let len = arr.length;
            let obj = res[0];
            Object.keys(obj).forEach((e, i) => {
              legend.push(obj[e]);
              this.chart1.series[i] = {
                name: "",
                type: "bar",
                stack: "总量",
                barWidth: "60%",
                data: []
              };
              this.chart1.series[i].name = obj[e];
              for (let j = 0; j < len; j++) {
                this.chart1.series[i].data.push(arr[j][e]);
                if (i === 0) {
                  let str = arr[j].time;
                  time.push(this.$ToTime(str));
                }
              }
            });
            // this.chart1.legend.data = legend;
            this.chart1.xAxis.data = time;
          } else if (num === 2) {
            let data = [];
            let max = 0;
            let key = this.mapArr[this.queryDimension[num] - 1];
            for (let i = 0; i < res.length; i++) {
              let value = res[i][key];
              if (max < value) {
                max = value;
              }
              data.push({
                value: value || 0,
                name: res[i].area
                  .replace("省", "")
                  .replace("自治区", "")
                  .replace("维吾尔", "")
                  .replace("壮族", "")
                  .replace("回族", "")
                  .replace("市", "")
              });
            }
            this.chart2.visualMap.max = max;
            this.chart2.series[0].name = this.mapObj[key];
            this.chart2.series[0].data = data;
          } else if (num === 3) {
            let len = res.length;
            let legend = [];
            let data0 = [];
            let data1 = [];
            for (let i = 0; i < len; i++) {
              let item = res[i];
              legend.push(item.customerTypeName);
              data0.push({
                value: item.saleMoney,
                name: item.customerTypeName
              });
              if ("children" in item) {
                let children = item.children;
                children.forEach(item => {
                  data1.push({
                    value: item.saleMoney,
                    name: item.customerTypeName
                  });
                })
              }
            }
            // this.chart3.legend.data = legend;
            this.chart3.series[0].data = data0;
            this.chart3.series[1].data = data1;
          } else if (num === 4) {
            if (this.queryDimension[num] === 1) {
              this.headTable = [
                {
                  text: "排名",
                  field: "no"
                },
                {
                  text: "药品类别",
                  field: "categoryName"
                },
                {
                  text: "客户数量",
                  field: "saleMoney"
                },
                {
                  text: "客户数量占比",
                  field: "saleShare"
                }
              ];
            } else if (this.queryDimension[num] === 2) {
              this.headTable = [
                {
                  text: "排名",
                  field: "no"
                },
                {
                  text: "药品类别",
                  field: "categoryName"
                },
                {
                  text: "含税收入(万)",
                  field: "saleMoney"
                },
                {
                  text: "含税收入占比",
                  field: "saleShare"
                }
              ];
            } else if (this.queryDimension[num] === 3) {
              this.headTable = [
                {
                  text: "排名",
                  field: "no"
                },
                {
                  text: "药品类别",
                  field: "categoryName"
                },
                {
                  text: "不含税收入",
                  field: "saleMoney"
                },
                {
                  text: "不含税收入占比",
                  field: "saleShare"
                }
              ];
            } else if (this.queryDimension[num] === 4) {
              this.headTable = [
                {
                  text: "排名",
                  field: "no"
                },
                {
                  text: "药品类别",
                  field: "categoryName"
                },
                {
                  text: "含税成本",
                  field: "saleMoney"
                },
                {
                  text: "含税成本占比",
                  field: "saleShare"
                }
              ];
            } else if (this.queryDimension[num] === 5) {
              this.headTable = [
                {
                  text: "排名",
                  field: "no"
                },
                {
                  text: "药品类别",
                  field: "categoryName"
                },
                {
                  text: "不含税成本",
                  field: "saleMoney"
                },
                {
                  text: "不含税成本占比",
                  field: "saleShare"
                }
              ];
            }
            res.forEach((item, index) => {
              item.no = index + 1;
            });
            this.tableData = res;
          } else if (num === 5) {
            let time = [];
            let legend = [];
            let arr = res.slice(1);
            let len = arr.length;
            let obj = res[0];
            Object.keys(obj).forEach((e, i) => {
              legend.push(obj[e]);
              this.chart5.series[i] = {
                name: "",
                type: "bar",
                stack: "总量",
                barWidth: "60%",
                data: []
              };
              this.chart5.series[i].name = obj[e];
              for (let j = 0; j < len; j++) {
                this.chart5.series[i].data.push(arr[j][e][0]);
                if (i === 0) {
                  let str = arr[j].time;
                  time.push(this.$ToTime(str));
                }
              }
            });
            // this.chart5.legend.data = legend;
            this.chart5.xAxis.data = time;
          } else if (num === 6) {
            let time = [];
            let debt = [];
            let income = [];
            for (let i = 0; i < res.length; i++) {
              let str = res[i].time;
              time.push(this.$ToTime(str));
              debt.push({
                value: res[i].debt,
                name: res[i].name
              });
              income.push({ value: res[i].income, name: res[i].name });
            }
            // this.chart6.legend.data = ["欠款", "回款"];
            this.chart6.series[0].name = "欠款";
            this.chart6.series[0].data = debt;
            this.chart6.series[1].name = "回款";
            this.chart6.series[1].data = income;
            this.chart6.xAxis.data = time;
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
      this.fromDate = this.$store.state.defaultTime;
      this.$SetStorage("erpTime", this.fromDate)
    },
    select: () => {
      return [
        {
          name: "粒度",
          default: 2,
          options: [
            {
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
        },
        {
          name: "指标",
          default: 2,
          options: [
            {
              code: 1,
              name: "客户数量"
            },
            {
              code: 2,
              name: "含税收入"
            },
            {
              code: 3,
              name: "不含税收入"
            },
            {
              code: 4,
              name: "含税成本"
            },
            {
              code: 5,
              name: "不含税成本"
            }
          ]
        }
      ];
    },
    select1: () => {
      return [
        {
          name: "指标",
          default: 2,
          options: [
            {
              code: 1,
              name: "客户数量"
            },
            {
              code: 2,
              name: "含税收入"
            },
            {
              code: 3,
              name: "不含税收入"
            },
            {
              code: 4,
              name: "含税成本"
            },
            {
              code: 5,
              name: "不含税成本"
            }
          ]
        }
      ];
    },
    select2: () => {
      return [
        {
          name: "粒度",
          default: 2,
          options: [
            {
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
        }
      ];
    },
    changeSelect(e, name, title) {
      this.selectTitle = title;
      let num = this.chartTitle.indexOf(title);
      if (name === "粒度") {
        this.timeDimension[num] = e;
      } else if (name === "指标") {
        this.queryDimension[num] = e;
      }
      if (title === this.chartTitle[0]) {
        this.chartLoading = true;
        this.getSimple();
        this.getChart(All.erpTotal(), 0);
      } else if (title === this.chartTitle[1]) {
        this.chartLoading1 = true;
        this.getChart(All.erpChannel(), 1);
      } else if (title === this.chartTitle[2]) {
        this.chartLoading2 = true;
        this.getChart(All.erpArea(), 2);
      } else if (title === this.chartTitle[3]) {
        this.chartLoading3 = true;
        this.getChart(All.erpCustomerType(), 3);
      } else if (title === this.chartTitle[4]) {
        this.chartLoading4 = true;
        this.getChart(All.erpCategory(), 4);
      } else if (title === this.chartTitle[5]) {
        this.chartLoading5 = true;
        this.getChart(All.erpDept(), 5);
      } else if (title === this.chartTitle[6]) {
        this.chartLoading6 = true;
        this.getChart(All.erpDeptAndIncome(), 6);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
