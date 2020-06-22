<template>
  <div id="monitor">
    <div class="header">
      <div class="left">
        <h5>电商实时监控</h5>
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
      <listBox v-loading="listBoxLoading" title="会员整体指标" :time="listBoxLoading ? {range: '',time: ''} : time()" :select="select()" :listData="listData"></listBox>
    </div>
    <div class="main-box">
      <chartBox v-loading="chartLoading" :title="chartTitle[0]" from="ECS" :islink="true" :time="chartLoading ? {range: '',time: ''} : time()" :select="select()" boxType="echartFrom" :chartOption="chart" :fromData="fromData" @changeSelect="changeSelect"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading1" :title="chartTitle[1]" from="ECS" :islink="true" :time="chartLoading1 ? {range: '',time: ''} : time()" :select="select1()" :chartOption="chart1" @changeSelect="changeSelect" clickType="map" class="min"></chartBox>
      <chartBox v-loading="chartLoading2" :title="chartTitle[2]" from="ECS" :islink="true" :time="chartLoading2 ? {range: '',time: ''} : time()" :select="select1()" :chartOption="chart2" @changeSelect="changeSelect" class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading3" :title="chartTitle[3]" from="ECS" :islink="true" :time="chartLoading3 ? {range: '',time: ''} : time()" :select="select1()" boxType="table" :headTable="headTable" :tableData="tableData" @changeSelect="changeSelect"
        :showPage="false" class="min">
      </chartBox>
      <chartBox v-loading="chartLoading4" :title="chartTitle[4]" from="ECS" :islink="true" :time="chartLoading4 ? {range: '',time: ''} : time()" :chartOption="chart4" @changeSelect="changeSelect" class="min"></chartBox>
    </div>
    <div class="main-box" style="height: 478px">
      <chartBox v-loading="chartLoading5" :title="chartTitle[5]" from="ECS" :islink="true" :time="chartLoading5 ? {range: '',time: ''} : time()" :select="select()" :chartOption="chart5" @changeSelect="changeSelect" class="min"></chartBox>
      <chartBox v-loading="chartLoading6" :title="chartTitle[6]" from="ECS" :islink="true" :time="chartLoading6 ? {range: '',time: ''} : time()" :select="select2()" :chartOption="chart6" @changeSelect="changeSelect" class="min"></chartBox>
    </div>
  </div>
</template>

<script>
import chartBox from "@c/ChartBox.vue";
import listBox from "./ListBox.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import { dateDifference } from "@utils/index";
import All from "@api/all";
export default {
  components: {
    chartBox,
    listBox,
    datePickerComponent
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
      fromDate: [],
      timeDimension: [2,2,2,2,2,2,2],
      queryDimension: [2,2,2,2,2,2,2],
      chartTitle: [
        "电商客户整体销售情况",
        "区域销售",
        "会员等级销售",
        "品种销售",
        "复购次数",
        "部门销售",
        "支付统计"
      ],
      listData: [
        {
          name: "注册会员数(个)",
          code: 0,
          icon: "#icon-huiyuan",
          link: "/ecs/register",
          color: "#40c9c6",
          tips: "所选的这段时间内，注册的会员总数（剔除了无效会员）",
          method: All.registerMembersChart()
        },
        {
          name: "审核会员数(个)",
          code: 0,
          icon: "#icon-huiyuan",
          link: "/ecs/check",
          color: "#36a3f7",
          tips: "所选的这段时间内，审核通过的会员总数",
          method: All.auditMembersChart()
        },
        {
          name: "下单会员数(个)",
          code: 0,
          icon: "#icon-xiadan",
          link: "/ecs/bought",
          color: "#34bfa3",
          tips: "所选的这段时间内，线上下单的会员总数（会员去重）",
          method: All.orderMembersChart()
        },
        {
          name: "整体会员购买率",
          code: 0,
          icon: "#icon-qianbi",
          link: "/ecs/totalbuyrate",
          color: "#f4516c",
          tips: "所选的这段时间内，下单会员数/注册会员数",
          method: All.allMembersChartBuyRate(),
          unit: "%"
        },
        {
          name: "准会员数购买率",
          code: 0,
          icon: "#icon-qianbi",
          link: "/ecs/membuyrate",
          color: "#f4516c",
          tips: "所选的这段时间内，下单会员数/审核通过的会员数",
          method: All.associateMembersChartBuyRate()
        },
        {
          name: "会员复购率",
          code: 0,
          icon: "#icon-qianbi",
          link: "/ecs/rebuyrate",
          color: "#34bfa3",
          tips: "所选的这段时间内，订单大于等于2的会员数/注册会员数",
          method: All.membersAgainSaleChart()
        },
        {
          name: "订单均价(元)",
          code: 0,
          icon: "#icon-xiadan",
          link: "/ecs/orderavg",
          color: "#36a3f7",
          tips: "所选的这段时间内，销售总额/订单数",
          method: All.orderAvgPriceChart()
        },
        {
          name: "客单价(元)",
          code: 0,
          icon: "#icon-qianbi",
          link: "/ecs/ordermem",
          color: "#40c9c6",
          tips: "所选的这段时间内，销售总额/下单会员数",
          method: All.customerAvgPriceChart()
        }
      ],
      headTable: [],
      tableData: [],
      fromData: [
        {
          label: "会员数量(个)",
          value: 0,
          tips: "所选的这段时间内，购买过的会员总数"
        },
        {
          label: "销售总额(万)",
          value: 0,
          tips: "所选的这段时间内，所有订单的出库金额之和"
        }
      ],
      mapObj: {
        memberCounts: "会员数量",
        totalSum: "销售总额"
      },
      chart: {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            let str;
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "电商客户整体销售情况") {
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
      chart1: {
        tooltip: {
          trigger: "item",
          formatter: res => {
            let str;
            let unit = "万";
            [res].forEach(i => {
              if (this.selectTitle === "区域销售") {
                this.queryDimension[1] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}${i.name}<br><div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[1] === 1) + unit}`;
            });
            return `${str}`;
          }
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            // dataView: { readOnly: false }
            // restore: {},
            // saveAsImage: {}
          }
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
      chart2: {
        tooltip: {
          trigger: "item",
          formatter: res => {
            let str;
            let unit = "万";
            [res].forEach(i => {
              if (this.selectTitle === "会员等级销售") {
                this.queryDimension[2] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[2] === 1) + unit}`;
            });
            return `${res.name} <br> ${str}(${res.percent}%)`;
          }
        },
        legend: {
          bottom: 10,
          left: "center",
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            // roseType: 'area',
            radius: "70%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      chart4: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
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
          type: "value"
        },
        series: [
          {
            name: "会员数",
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            barWidth: "60%",
            data: []
          }
        ]
      },
      chart5: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: res => {
            let str;
            let unit = "万";
            res.forEach(i => {
              if (this.selectTitle === "部门销售") {
                this.queryDimension[5] === 1 ? (unit = "个") : (unit = "万");
              }
              str = `${str ? str + '<br>' : ''}<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value, this.queryDimension[5] === 1) + unit}`;
            });
            return `${str}`;
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
          trigger: "item",
          formatter: res => {
            let str;
            let unit = "万";
            [res].forEach(i => {
              str = `<div style="background: ${
                i.color
              }" class="chart-dot"></div>${
                i.seriesName ? i.seriesName + " :" : i.seriesName
              } ${this.$ToThousands(i.value) + unit}`;
            });
            return `${res.name} <br> ${str}(${res.percent}%)`;
          }
        },
        legend: {
          bottom: 10,
          left: "center",
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "70%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
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
      this.$SetStorage("ecsTime", this.fromDate)
      this.getListData();
      this.getSimple();
      this.chartLoading = this.chartLoading1 = this.chartLoading2 = this.chartLoading3 = this.chartLoading4 = this.chartLoading5 = this.chartLoading6 = true;
      this.getChart(All.ecsTotalChart(), 0);
      this.getChart(All.ecsArea(), 1);
      this.getChart(All.ecsUserrank(), 2);
      this.getChart(All.ecsCategory(), 3);
      this.getChart(All.ecsBoughts(), 4);
      this.getChart(All.ecsDept(), 5);
      this.getChart(All.ecsPay(), 6);
    },
    time() {
      if (
        this.$GetStorage("ecsTime").length
      ) {
        let timeArr = this.$GetStorage("ecsTime");
        let arr = dateDifference(timeArr[0], timeArr[1])
        return {
          range: `${timeArr[0].split(" ")[0]} - ${timeArr[1].split(" ")[0]}`,
          days: arr[0],
          hours: arr[1]
        }
      } else {
        let arr = dateDifference(this.$store.state.defaultTime[0], this.$store.state.defaultTime[1])
        return {
          range: `${this.$store.state.defaultTime[0].split(" ")[0]} - ${this.$store.state.defaultTime[1].split(" ")[0]}`,
          days: arr[0],
          hours: arr[1]
        }
      }
    },
    getListData() {
      this.listBoxLoading = true;
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1])
      };
      All.postAPI({
        method: All.ecsTotalSum(),
        params: params
      })
        .then(res => {
          this.listData[0].code = res.registerCounts; // 注册会员数
          this.listData[1].code = res.auditedCounts; // 审核会员数
          this.listData[2].code = res.boughtCounts; // 下单会员数
          this.listData[3].code = res.purchaseRateOfAll; // 整体会员购买率
          this.listData[4].code = res.purchaseRateOfInformal; // 准会员购买率
          this.listData[5].code = res.purchaseRateOfReBought; // 会员复购率
          this.listData[6].code = res.averageOfOrder; // 订单均价
          this.listData[7].code = res.averageOfCustomer; // 客单数
        })
        .finally(() => {
          this.listBoxLoading = false;
        });
    },
    getSimple() {
      let params = {
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1])
      };
      All.postAPI({
        method: All.ecsTotalSimple(),
        params: params
      }).then(res => {
        this.fromData[0].value = res.memberCounts;
        this.fromData[1].value = res.totalSum;
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
            let data = [];
            let time = [];
            let key;
            if (this.queryDimension[num] == 2) {
              key = "totalSum"
            } else if (this.queryDimension[num] == 1) {
              key = "memberCounts"
            }
            for (let i = 0; i < res.length; i++) {
              time.push(this.$ToTime(res[i].time));
              data.push(res[i][key]);
            }
            this.chart.xAxis.data = time;
            this.chart.series[0].name = this.mapObj[key];
            this.chart.series[0].data = data;
          } else if (num === 1) {
            let data = [];
            let max = 0;
            let key;
            Object.keys(res[0]).forEach(i => {
              if (i in this.mapObj) {
                key = i;
              }
            });
            for (let i = 0; i < res.length; i++) {
              let value = res[i][key];
              if (max < value) {
                max = value;
              }
              data.push({
                value: value || 0,
                name: res[i].provinceName
              });
            }
            this.chart1.visualMap.max = max;
            this.chart1.series[0].name = this.mapObj[key];
            this.chart1.series[0].data = data;
          } else if (num === 2) {
            let userRank = [];
            let data = [];
            let key;
            Object.keys(res[0]).forEach(i => {
              if (i in this.mapObj) {
                key = i;
              }
            });
            for (let i = 0; i < res.length; i++) {
              userRank.push(res[i].userRank);
              let value = res[i][key];
              data.push({
                value: value,
                name: res[i].userRank
              });
            }
            // this.chart2.legend.data = userRank;
            this.chart2.series[0].name = this.mapObj[key];
            this.chart2.series[0].data = data;
          } else if (num === 3) {
            let key;
            Object.keys(res[0]).forEach(i => {
              if (i in this.mapObj) {
                key = i;
              }
            });
            if (key === "memberCounts") {
              this.headTable = [
                {
                  text: "排名",
                  minWidth: 50,
                  field: "no"
                },
                {
                  text: "药品类别",
                  minWidth: 100,
                  field: "firstTypeName"
                },
                {
                  text: "会员数量(个)",
                  minWidth: 100,
                  field: "memberCounts"
                },
                {
                  text: "会员数量占比",
                  minWidth: 100,
                  field: "memberCountsProportion",
                  unit: "%"
                }
              ];
            } else {
              this.headTable = [
                {
                  text: "排名",
                  minWidth: 50,
                  field: "no"
                },
                {
                  text: "药品类别",
                  minWidth: 100,
                  field: "firstTypeName"
                },
                {
                  text: "销售额(万)",
                  minWidth: 100,
                  field: "totalSum"
                },
                {
                  text: "销售额占比",
                  minWidth: 100,
                  field: "totalSumProportion",
                  unit: "%"
                }
              ];
            }
            res.forEach((item, index) => {
              item.no = index + 1;
            });
            this.tableData = res;
          } else if (num === 4) {
            let data = [];
            let arr = ["1次", "2-4次", "4-8次", "8次以上"];
            for (let i = 0; i < res.length; i++) {
              data.push({
                value: res[i].boughts,
                per: res[i].proportion
              });
            }
            this.chart4.xAxis.data = arr;
            this.chart4.series[0].data = data;
          } else if (num === 5) {
            let time = [];
            let deptName = [];
            this.chart5.series = [];
            for (let i = 0; i < res.length; i++) {
              this.chart5.series[i] = {
                name: "",
                type: "bar",
                stack: "总量",
                barWidth: "60%",
                data: []
              };
              deptName.push(res[i].deptName);
              this.chart5.series[i].name = res[i].deptName;
              for (let j = 0; j < res[i].reports.length; j++) {
                let obj = res[i].reports[j];
                if (i === 0) {
                  time.push(this.$ToTime(obj.time));
                }
                if ("memberCounts" in obj) {
                  this.chart5.series[i].data.push(
                    obj.memberCounts
                  );
                } else {
                  this.chart5.series[i].data.push(obj.totalSum);
                }
              }
            }
            // this.chart5.legend.data = deptName;
            this.chart5.xAxis.data = time;
          } else if (num === 6) {
            let name = [];
            let data = [];
            let key;
            Object.keys(res[0]).forEach(i => {
              if (i in this.mapObj) {
                key = i;
              }
            });
            for (let i = 0; i < res.length; i++) {
              name.push(res[i].name);
              data.push({
                value: res[i][key],
                name: res[i].name,
                per: res[i].proportion
              });
            }
            // this.chart6.legend.data = name;
            this.chart6.series[0].name = this.mapObj[key];
            this.chart6.series[0].data = data;
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
      this.$SetStorage("ecsTime", this.fromDate)
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
              code: 2,
              name: "销售总额"
            },
            {
              code: 1,
              name: "会员数量"
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
              name: "会员数量"
            },
            {
              code: 2,
              name: "销售总额"
            }
          ]
        }
      ];
    },
    select2: () => {
      return [
        {
          name: "指标",
          default: 2,
          options: [
            {
              code: 2,
              name: "订单支付类型"
            },
            {
              code: 1,
              name: "支付方式"
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
        this.getChart(All.ecsTotalChart(), 0);
      } else if (title === this.chartTitle[1]) {
        this.chartLoading1 = true;
        this.getChart(All.ecsArea(), 1);
      } else if (title === this.chartTitle[2]) {
        this.chartLoading2 = true;
        this.getChart(All.ecsUserrank(), 2);
      } else if (title === this.chartTitle[3]) {
        this.chartLoading3 = true;
        this.getChart(All.ecsCategory(), 3);
      } else if (title === this.chartTitle[4]) {
        this.chartLoading4 = true;
        this.getChart(All.ecsBoughts(), 4);
      } else if (title === this.chartTitle[5]) {
        this.chartLoading5 = true;
        this.getChart(All.ecsDept(), 5);
      } else if (title === this.chartTitle[6]) {
        this.chartLoading6 = true;
        this.getChart(All.ecsPay(), 6);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
