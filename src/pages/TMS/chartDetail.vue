<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <!-- <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button> -->
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <div>
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item>
                <datePickerComponent v-model="fromDate"></datePickerComponent>
              </el-form-item>
              <el-form-item :label="granularity.name" v-if="nowPageNum !== 3 && nowPageNum !== 4">
                <selectComponent :options="[...granularity.options, {code: 4, name: '按小时'}]" v-model="timeDimension" width="100px"></selectComponent>
              </el-form-item>
              <el-form-item label="选择区域" v-if="nowPageNum === 4">
                <cascaderComponent v-model="region" :options="tmsRegionCode" multiple :otherProps="{checkStrictly : true}" firstOption="四川省"></cascaderComponent>
              </el-form-item>
              <el-form-item :label="selectOptionsName" v-if="nowPageNum === 2 || nowPageNum === 3 || nowPageNum === 4 || nowPageNum === 5">
                <selectComponent :options="selectOptions" v-model="typeDimension" width="130px"></selectComponent>
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="typeDimension" @change="change0" v-if="nowPageNum === 0">
                  <el-radio-button :label="item.code" v-for="item in typeOptions" :key="item.code">{{item.name}}</el-radio-button>
                </el-radio-group>
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
          <el-form-item label="维度显示" v-if="nowPageNum === 2">
            <selectComponent name="维度显示" size="small" :options="chartDimensions" v-model="chartDimension" @change="refreshChart" multiple collapseTags propValue="self" propLebel="self"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示" v-if="nowPageNum === 2">
            <selectComponent size="small" :options="dimension.tms" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
        </el-form>
      </div>
      <echarts :option="chartOption" height="400px"></echarts>
    </div>
    <div class="main-box" v-loading="tableLoading">
      <tableComponent :headTable="headTable" :dataList="dataList" :showPage="showPage" border height="580px" :from="nowPageNum === 2 ? 'TMS2' : ''"></tableComponent>
    </div>
  </div>
</template>

<script>
import echarts from "@c/Echarts.vue";
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import { granularity, TMScode } from "@utils/objArrData";
import { getDaysBefore } from "@utils/index";
import cascaderComponent from "@c/CascaderComponent.vue";
import All from "@api/all";

export default {
  components: {
    echarts,
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
      eg: "", // 排序
      granularity: granularity(),
      region: [-1],
      params: {},
      dimension: {
        tms: [
          {
            code: 1,
            name: "件数"
          },
          {
            code: 2,
            name: "客户数"
          }
        ]
      },
      typeOptions: [
        {
          code: 1,
          name: "网点"
        },
        {
          code: 2,
          name: "合纵货物数"
        }
      ],
      mapObj: {
        value: "件数",
        customerCount: "客户数"
      },
      TMSArr: ["value", "customerCount"],
      selectOptionsName: "",
      tmsRegionCode: [],
      selectOptions: [],
      queryDimension: 1,
      typeDimension: 1,
      TMScode: TMScode(),
      fromDate: [],
      chartOption: {},
      headTable: [],
      dataList: [],
      timeDimension: 3,
      chartLoading: false,
      tableLoading: false,
      showPage: false,
      nowPageNum: null,
      chartData: {},
      chartDimensions: [],
      chartDimension: [],
      listData: [
        {
          name: "接货量",
          method: All.tmsDetail0()
        },
        {
          name: "出库及时率",
          method: All.tmsDetail1()
        },
        {
          name: "个人效率",
          method: All.tmsDetail2()
        },
        {
          name: "出库时效",
          method: All.tmsDetail3()
        },
        {
          name: "区域送货量",
          method: All.tmsDetail4()
        },
        {
          name: "客户投诉",
          method: All.tmsDetail5(),
          tableMethod: All.tmsDetail5a()
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
        this.initData();
        this.getChartTable();
      }
    }
  },
  created() {
    this.getData();
    this.init();
    this.initData();
    this.getChartTable();
  },
  methods: {
    init() {
      if ("timeDimension" in this.$route.query) {
        this.timeDimension = +this.$route.query.timeDimension;
      }
      this.pageSize = 10;
      this.pageNum = 1;
      if (this.nowPageNum === 0) {
        this.timeDimension = 3;
      }
      this.fromDate = this.$store.state.defaultTime1;
    },
    initData() {
      this.headTable = [];
      this.dataList = [];
      this.chartOption = {
        tooltip: {
          trigger: "axis",
          formatter: res => {
            return this.$ChartFormatter(res, true);
          }
        },
        legend: {
          data: [],
          x: "center",
          y: "bottom"
        },
        title: {
          text: "",
          left: "center"
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
          type: "value"
        },
        series: []
      };
      if (this.nowPageNum === 1) {
        this.chartOption.yAxis = [
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
        ];
        this.chartOption.xAxis.boundaryGap = true;
      } else if (this.nowPageNum === 2) {
        this.selectOptionsName = "人员类型";
        this.selectOptions = [
          {
            name: "司机",
            code: 1
          },
          {
            name: "备货员",
            code: 2
          },
          {
            name: "装卸员",
            code: 3
          }
        ];
      } else if (this.nowPageNum === 3) {
        this.selectOptionsName = "出库类型";
        this.selectOptions = [
          {
            name: "直配",
            code: 1
          },
          {
            name: "干线",
            code: 2
          }
        ];
      } else if (this.nowPageNum === 4) {
        this.tmsRegionCode = [];
        const tmsRegionCode = this.$GetStorage("tmsRegionCode");
        if (tmsRegionCode) {
          this.tmsRegionCode = tmsRegionCode;
        } else {
          this.getCode();
        }
        this.selectOptionsName = "发货方";
        this.selectOptions = [
          {
            name: "合纵",
            code: 1
          },
          {
            name: "金仁",
            code: 2
          }
        ];
        this.chartOption = {
          tooltip: {
            trigger: "item"
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center"
          },
          title: {
            text: "",
            left: "center"
          },
          visualMap: {
            min: 0,
            max: 50000,
            text: ["High", "Low"],
            realtime: false,
            calculable: false,
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
        };
      } else if (this.nowPageNum === 5) {
        this.showPage = true;
        this.selectOptionsName = "分析内容";
        this.selectOptions = [
          {
            name: "投诉类型",
            code: 1
          },
          {
            name: "处理状态",
            code: 2
          },
          {
            name: "处理时长",
            code: 3
          }
        ];
      }
    },
    getCode() {
      All.postAPI({
        method: All.tmsCode0()
      }).then(res => {
        this.tmsRegionCode = res;
        this.tmsRegionCode.unshift({
          name: "全部",
          code: -1
        });
        this.$SetStorage("tmsRegionCode", this.tmsRegionCode);
      });
    },
    getData() {
      let num = this.$route.query.analysis;
      this.nowPageNum = +num;
    },
    getTable() {
      let params = this.params;
      params.pageNum = this.pageNum;
      params.pageSize = this.pageSize;
      All.postAPI({
        method: this.listData[this.nowPageNum].tableMethod,
        params: params
      })
        .then(res => {
          this.total = res.total;
          let headTable = [
            {
              text: "日期",
              field: "time",
              sortable: "date"
            }
          ];
          let dataList = [];
          let data = res.result;
          let nameArr = Object.keys(data);
          for (let i = 0; i < nameArr.length; i++) {
            let item = nameArr[i];
            let obj = data[item];
            let arr = Object.keys(obj);
            for (let j = 0; j < arr.length; j++) {
              let el = arr[j];
              if (i === 0) {
                headTable.push({
                  text: el,
                  field: el
                });
              }
              obj[el] = obj[el] + "%";
            }
            dataList[i] = {
              time: item,
              ...obj
            };
          }
          let obj1 = {};
          Object.keys(res.whole).forEach(item => {
            obj1[item] = res.whole[item] + "%";
          });
          if (dataList.length) {
            dataList.unshift({
              time: "合计",
              ...obj1
            });
          }
          this.headTable = headTable;
          this.dataList = dataList;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    getChartTable() {
      this.chartLoading = true;
      this.tableLoading = true;
      this.initData();
      this.chartOption.title.text = this.listData[this.nowPageNum].name;
      let params = {};
      params.dimension = this.timeDimension;
      params.startDate = this.$GetApiTime(this.fromDate[0]);
      params.endDate = this.$GetApiTime(this.fromDate[1]);
      if (this.nowPageNum === 2) {
        params.staffType = this.typeDimension;
      } else if (this.nowPageNum === 3) {
        params.stockOutType = this.typeDimension;
        delete params.dimension;
      } else if (this.nowPageNum === 4) {
        if (this.region.length === 1) {
          params.province = this.region[0];
        } else if (this.region.length === 2) {
          params.province = this.region[0];
          params.city = this.region[1];
        } else if (this.region.length === 3) {
          params.province = this.region[0];
          params.city = this.region[1];
          params.county = this.region[2];
        }
        params.distributor = this.typeDimension;
      } else if (this.nowPageNum === 5) {
        params.analysisType = this.typeDimension;
      }
      this.params = params;
      if (this.nowPageNum === 5) {
        this.getTable();
      }
      All.postAPI({
        method: this.listData[this.nowPageNum].method,
        params: params
      })
        .then(res => {
          this.initData();
          this.chartOption.title.text = this.listData[this.nowPageNum].name;
          this.chartData = res;
          if (this.nowPageNum === 0) {
            this.getChartData0();
          } else if (this.nowPageNum === 1) {
            this.getChartData1();
          } else if (this.nowPageNum === 2) {
            this.getChartData2();
          } else if (this.nowPageNum === 3) {
            this.getChartData3();
          } else if (this.nowPageNum === 4) {
            this.getChartData4();
          } else if (this.nowPageNum === 5) {
            this.getChartData5();
          }
        })
        .finally(() => {
          this.chartLoading = false;
          this.nowPageNum === 5 ? "" : (this.tableLoading = false);
        });
    },
    change0() {
      this.initData();
      this.getChartData0();
    },
    getChartData0() {
      let labelArr;
      let dataArr;
      let dataObj;
      if (this.typeDimension == 1) {
        labelArr = this.chartData.departments;
        dataArr = Object.keys(this.chartData.departmentChartData);
        dataObj = this.chartData.departmentChartData;
        this.headTable = [
          {
            text: "网点",
            field: "departments",
            minWidth: "170"
          }
        ];
      } else if (this.typeDimension == 2) {
        labelArr = this.chartData.cargos;
        dataArr = Object.keys(this.chartData.cargoChartData);
        dataObj = this.chartData.cargoChartData;
        this.headTable = [
          {
            text: "合纵货物数",
            field: "cargos"
          }
        ];
      }
      let xAxis = [];
      let value = [];
      let headTable = [];
      for (let i = 0; i < labelArr.length; i++) {
        let label = labelArr[i];
        value[i] = [];
        let obj = {};
        for (let j = 0; j < dataArr.length; j++) {
          let time = this.$ToTime(dataArr[j]) || "合计";
          if (headTable.length < dataArr.length) {
            headTable.push({
              text: time,
              field: time
            });
          }
          if (xAxis.length < dataArr.length - 1) {
            xAxis.push(time);
          }
          let arr = dataObj[dataArr[j]];
          for (let k = 0; k < arr.length; k++) {
            if (arr[k].label === label) {
              if (time !== "合计") {
                value[i].push(arr[k].value);
              }
              obj[time] = arr[k].value;
            }
          }
        }
        if (this.typeDimension == 1) {
          this.dataList[i] = { departments: label, ...obj };
        } else if (this.typeDimension == 2) {
          this.dataList[i] = { cargos: label, ...obj };
        }
        this.chartOption.series[i] = {
          name: label,
          type: "line",
          data: value[i]
        };
      }
      this.headTable = this.headTable.concat(headTable.reverse());
      this.chartOption.legend.data = labelArr;
      this.chartOption.xAxis.data = xAxis;
    },
    getChartData1() {
      let xAxis = [];
      let data0 = [];
      let data1 = [];
      let headTable = [];
      let nameArr0 = Object.keys(this.chartData.timelyRateChartData);
      let nameArr1 = Object.keys(this.chartData.notDistributeChartData);
      let arr = [...nameArr0, ...nameArr1];
      this.headTable = [
        {
          text: "指标",
          field: "name",
          minWidth: "150"
        }
      ];
      for (let i = 0; i < nameArr0.length; i++) {
        let name = nameArr0[i];
        let dataArr = this.chartData.timelyRateChartData[name];
        data0[i] = [];
        let obj = {};
        for (let j = 0; j < dataArr.length; j++) {
          let time = dataArr[j].label;
          if (xAxis.length < dataArr.length) {
            xAxis.push(time);
            headTable.push({
              text: time,
              field: time
            });
          }
          data0[i].push(dataArr[j].value);
          obj[time] = dataArr[j].value + "%";
        }
        this.dataList[i] = { name: name, ...obj };
        this.chartOption.series[i] = {
          name: name,
          type: "line",
          data: data0[i]
        };
      }
      for (let i = 0; i < nameArr1.length; i++) {
        let name = nameArr1[i];
        let dataArr = this.chartData.notDistributeChartData[name];
        data1[i] = [];
        let obj = {};
        for (let j = 0; j < dataArr.length; j++) {
          let time = dataArr[j].label;
          data1[i].push(dataArr[j].value);
          obj[time] = dataArr[j].value;
        }
        this.dataList[i + nameArr0.length] = { name: name, ...obj };
        this.chartOption.series[i + nameArr0.length] = {
          name: name,
          type: "bar",
          stack: "bar",
          yAxisIndex: 1,
          data: data1[i]
        };
      }
      this.headTable = this.headTable.concat(headTable.reverse());
      this.chartOption.xAxis.data = xAxis;
      this.chartOption.legend.data = arr;
    },
    getChartData2() {
      let keyArr = Object.keys(this.chartData.result);
      this.chartDimension = [keyArr[0]];
      this.chartDimensions = this.chartData.dimensions;
      this.headTable = [
        {
          text: this.selectOptions[this.typeDimension - 1].name,
          field: "name"
        },
        {
          text: "指标",
          field: "dimensions"
        }
      ];
      let headTable = [];
      let data = this.chartData.result;
      let arr = Object.keys(data);
      let obj = [];
      arr.forEach((item, index) => {
        let arr1 = data[item];
        obj[index * 2] = {
          name: item,
          dimensions: "件数"
        };
        obj[index * 2 + 1] = {
          name: item,
          dimensions: "客户数"
        };
        for (let i = 0; i < arr1.length; i++) {
          let el = arr1[i];
          let time = this.$ToTime(el.label) || "合计";
          obj[index * 2][time] = el.value;
          obj[index * 2 + 1][time] = el.customerCount;
          if (headTable.length < arr1.length) {
            headTable.push({
              text: time,
              field: time
            });
          }
        }
      });
      this.headTable = this.headTable.concat(headTable.reverse());
      this.dataList = obj;
      this.refreshChart();
    },
    getChartData3() {
      this.headTable = [
        {
          text: "出库时效",
          field: "label"
        },
        {
          text: "配送量",
          field: "value"
        },
        {
          text: "占比",
          field: "rate"
        }
      ];
      let dataArr = this.chartData.report;
      let data = [];
      let xAxisData = [];
      dataArr.forEach((item, index) => {
        data.push({
          value: item.value,
          per: item.rate
        });
        xAxisData.push(item.label);
        this.dataList.push({
          label: item.label,
          value: item.value,
          rate: item.rate
        });
      });
      let series = {
        name: "配送量",
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
      this.chartOption.series[0] = series;
      this.chartOption.xAxis.data = xAxisData;
    },
    getChartData4() {
      let headTable = [];
      let data = [];
      let max = 0;
      let arr = this.chartData.regionData;
      let mapArr = this.chartData.map;
      for (let i = 0; i < arr.length; i++) {
        arr[i].date = this.$ToTime(arr[i].date);
        if (i === 0) {
          Object.keys(arr[i]).forEach(item => {
            let text = this.$MapStr(item, this.TMScode);
            let obj = {
              text: text,
              field: item
            };
            if (text !== "-") {
              headTable.push(obj);
            }
          });
        }
      }
      mapArr.forEach(item => {
        let value = item.amount;
        if (max < value) {
          max = value;
        }
        data.push({
          value: value || 0,
          name: item.provinceName.replace(/省|壮族自治区|回族自治区|维吾尔自治区|特别行政区|自治区/g, "")
        });
      })
      this.chartOption.visualMap.max = max;
      this.chartOption.series[0].name = "送货量";
      this.chartOption.series[0].data = data;
      this.headTable = headTable;
      this.dataList = arr;
    },
    getChartData5() {
      let data = [];
      let legend = [];
      let series = [];
      let xAxis = [];
      let arr = Object.keys(this.chartData.chartData);
      let dataArr = this.chartData.chartData;
      arr.forEach((item, index) => {
        let arr1 = dataArr[item];
        let obj = {};
        arr1.forEach((el, ind) => {
          if (el.label !== "投诉总数") {
            if (legend.length < arr1.length - 1) {
              legend.push(el.label);
              series[ind] = {
                name: el.label,
                type: "bar",
                stack: "bar",
                data: []
              };
            }
            obj[el.label] = el.value;
            if (el.label === series[ind].name) {
              series[ind].data.push(el.value);
            }
          }
        });
        obj.time = this.$ToTime(item);
        xAxis.push(obj.time);
      });
      this.chartOption.xAxis.boundaryGap = false;
      this.chartOption.legend.data = legend;
      this.chartOption.series = series;
      this.chartOption.xAxis.data = xAxis;
      this.chartOption.xAxis.boundaryGap = true;
    },
    refreshChart() {
      let res = this.chartData;
      let xAxisData = [];
      let data = [];
      let key;
      if (this.nowPageNum === 2) {
        key = this.TMSArr[this.queryDimension - 1];
      }
      this.chartOption.series = [];
      this.chartOption.xAxis.data = [];
      this.chartOption.legend.data = [];
      let series = [];
      let legend = [];
      this.chartDimension.forEach((item, index) => {
        let resData = res.result[item] || [];
        let data = [];
        legend.push(item + "," + this.mapObj[key]);
        for (let j = 1; j < resData.length; j++) {
          data.push({
            dimension: item,
            value: resData[j][key]
          });
          let label = resData[j].label;
          if (label !== "合计" && xAxisData.length < resData.length - 1) {
            let time = this.$ToTime(label);
            xAxisData.push(time);
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
      console.log(xAxisData);
      this.chartOption.xAxis.boundaryGap = false;
      this.chartOption.legend.data = legend;
      this.chartOption.series = series;
      this.chartOption.xAxis.data = xAxisData;
    },
    search() {
      this.getChartTable();
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
        eg: this.eg
      };
      let params1 = {
        queryDimension: this.queryDimension
      };
      let params2 = {
        date: this.$GetApiTime(this.fromDate[0]),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        eg: this.eg
      };
      if (this.nowPageNum === 0) {
        method = All.wmsExport0();
      } else if (this.nowPageNum === 1) {
        method = All.wmsExport1();
      } else if (this.nowPageNum === 2) {
        method = All.wmsExport2();
      } else if (this.nowPageNum === 3) {
        method = All.wmsExport3();
      } else if (this.nowPageNum === 4) {
        method = All.wmsExport4();
      } else if (this.nowPageNum === 5) {
        method = All.wmsExport5();
        params = { ...params, ...params1 };
      } else if (this.nowPageNum === 6) {
        method = All.wmsExport6();
        params = params2;
      }
      this.$GetDownload(method, params);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>