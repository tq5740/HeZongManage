<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <div v-if="nowPageNum === 7">
          <p class="title">分析维度</p>
          <div>
            <div v-for="(item, index) in selectNum" :key="item" class="selectBox">
              <p class="index-css index123 no">{{index+1}}</p>
              <selectForm :defaultIsSelect="defaultIsSelect" :index="index" style="float: left;"></selectForm>
              <el-form :inline="true">
                <el-form-item label="查看"></el-form-item>
                <el-form-item>
                  <el-button type="warning" plain icon="el-icon-remove" @click="delSelect(item, index)" v-if="selectNum.length > 1">减去维度</el-button>
                  <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(index)" v-if="selectNum.length < defaulted.selectArr.length && selectNum.length === index + 1">添加维度</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-button type="primary" plain icon="el-icon-circle-plus" @click="addSelect(-1)" v-if="selectNum.length === 0" style="margin-bottom: 20px; margin-left: 20px;">添加维度</el-button>
        </div>
        <div>
          <p class="title">选择时间</p>
          <div class="selectBox">
            <el-form :inline="true">
              <el-form-item>
                <datePickerComponent v-model="fromDate"></datePickerComponent>
              </el-form-item>
              <el-form-item v-if="nowPageNum !== 8 && nowPageNum !== 10" :label="granularity.name">
                <selectComponent :options="[...granularity.options, {code: 4, name: '按小时'}]" v-model="timeDimension" width="100px"></selectComponent>
              </el-form-item>
              <el-form-item v-if="nowPageNum === 8" label="选择频次 :">
                <el-input v-model="minTimes" class="input-css" type="number" min="0"></el-input>&nbsp;-
                <el-input v-model="maxTimes" class="input-css" type="number" min="0"></el-input>
              </el-form-item>
              <el-form-item :label="selectOptionsName + ' :'" v-if="nowPageNum !== 0 && nowPageNum !== 7">
                <selectComponent v-model="valueType" :options="valueOptions" @change="changeSelect" propLebel="label" propValue="value" filterable width="130px"></selectComponent>
              </el-form-item>
              <el-form-item v-if="(nowPageNum === 1 && valueType !== 3) || nowPageNum === 8 || nowPageNum === 9 || nowPageNum === 10">
                <el-input v-model="searchValue" :placeholder="placeholderFn()" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="(nowPageNum === 1 && valueType === 3) || (nowPageNum === 3 && valueType !== 3)">
                <selectComponent v-model="selectDimension1" :options="selectOptions1" propLebel="label" propValue="value" filterable width="130px"></selectComponent>
              </el-form-item>
              <el-form-item v-if="nowPageNum === 3 && valueType === 3">
                <el-select v-model="selectDimension2" filterable remote placeholder="请输入往来单位" :remote-method="remoteMethod" :loading="selectLoading">
                  <el-option v-for="item in selectOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="nowPageNum === 0" :label="selectOptionsName + ' :'">
                <cascaderComponent v-model="typeDimensionArr" :options="typeOptions" :props="{label: 'label', value: 'value'}" filterable></cascaderComponent>
              </el-form-item>
              <el-form-item label="大客户 :" v-if="nowPageNum === 10 && valueType === 3">
                <selectComponent v-model="isBigCustomer" :options="[{code:1,name:'是'},{code:0,name:'否'}]" filterable width="90px"></selectComponent>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-search" class="search-btn" @click="search" :loading="chartLoading && tableLoading">搜索</el-button>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="chartLoading" v-if="nowPageNum !== 8 && nowPageNum !== 9 && nowPageNum !== 10">
      <div class="selectBox" v-if="nowPageNum === 7">
        <el-form :inline="true">
          <el-form-item label="维度显示">
            <selectComponent name="维度显示" size="small" :options="chartDimensions" v-model="chartDimension" @change="refreshChart" multiple collapseTags propValue="self" propLebel="self"></selectComponent>
          </el-form-item>
          <el-form-item label="指标显示">
            <selectComponent size="small" :options="dimension" v-model="queryDimension" @change="refreshChart" width="130px"></selectComponent>
          </el-form-item>
        </el-form>
      </div>
      <echarts :option="chartOption" height="400px"></echarts>
    </div>
    <div class="main-box" v-loading="tableLoading">
      <el-table v-if="lazy" :data="dataList" style="width: 100%" row-key="wldwId" stripe lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" max-height="580px">
        <el-table-column prop="consumerName" label="客户"></el-table-column>
        <el-table-column prop="buyCount" label="购买次数" width="150px" align="right">
          <template slot-scope="scope">{{$ToThousands(scope.row.buyCount).toString().replace(".00", "")}}</template>
        </el-table-column>
        <el-table-column prop="buyNumber" label="购买数量" width="150px" align="right">
          <template slot-scope="scope">{{$ToThousands(scope.row.buyNumber).toString().replace(".00", "")}}</template>
        </el-table-column>
      </el-table>
      <tableComponent v-else from="GSP" :headTable="headTable" :dataList="dataList" :showPage="showPage" :border="nowPageNum !== 8 && nowPageNum !== 9 && nowPageNum !== 10" height="580px"></tableComponent>
    </div>
  </div>
</template>

<script>
import echarts from "@c/Echarts.vue";
import selectForm from "@c/SelectForm.vue";
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import { granularity, GSPcode } from "@utils/objArrData";
import { getDaysBefore } from "@utils/index";
import cascaderComponent from "@c/CascaderComponent.vue";
import All from "@api/all";

export default {
  components: {
    echarts,
    selectForm,
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
      ecsRegion: [-1],
      params: {},
      dimension: [],
      TMSArr: ["value", "customerCount"],
      selectOptionsName: "",
      valueOptions: [],
      selectOptions1: [],
      selectOptions2: [],
      selectLoading: false,
      typeOptions: [],
      selectNum: [],
      selected: {},
      defaultSelected: {
        wldwId: -1,
        reason: -1
      },
      selectedArr: [],
      selectOptions: {},
      defaultIsSelect: {},
      queryDimension: 1,
      dimensionOrder: [],
      valueType: 1,
      selectDimension1: -1,
      selectDimension2: -1,
      searchValue: "",
      typeDimension: 1,
      typeDimensionArr: [1, -1],
      GSPcode: GSPcode(),
      fromDate: [],
      chartOption: {},
      headTable: [],
      dataList: [],
      timeDimension: 3,
      chartLoading: false,
      tableLoading: false,
      showPage: true,
      nowPageNum: "",
      chartData: {},
      chartDimensions: [],
      chartDimension: [],
      minTimes: "",
      maxTimes: "",
      hasSelect: [],
      isSelected: {},
      isBigCustomer: 1,
      lazy: false,
      GSP7Code: {
        i1: "wldwId",
        i2: "reason"
      },
      listData: [
        {
          name: "收货数据分析",
          chartMethod: All.gspChart0(),
          tableMethod: All.gspTable0()
        },
        {
          name: "拒收数据分析",
          chartMethod: All.gspChart1(),
          tableMethod: All.gspTable1()
        },
        {
          name: "验收数据分析",
          chartMethod: All.gspChart2(),
          tableMethod: All.gspTable2()
        },
        {
          name: "销售退回分析",
          chartMethod: All.gspChart3(),
          tableMethod: All.gspTable3()
        },
        {
          name: "养护数据分析",
          chartMethod: All.gspChart4(),
          tableMethod: All.gspTable4()
        },
        {
          name: "退货流向分析",
          chartMethod: All.gspChart5(),
          tableMethod: All.gspTable5()
        },
        {
          name: "不合格药品分析",
          chartMethod: All.gspChart6(),
          tableMethod: All.gspTable6()
        },
        {
          name: "采购退出数据分析",
          chartMethod: All.gspChart7(),
          tableMethod: All.gspTable7()
        },
        {
          name: "质量公告分析",
          tableMethod: All.gsp8(),
          addMethod: All.gspDetailSave8(),
          importMethod: All.gspImport8()
        },
        {
          name: "召回数据分析",
          tableMethod: All.gspTable9()
        },
        {
          name: "含麻药数据分析",
          tableMethod: All.gspTable10()
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
  methods: {
    init() {
      this.getData();
      this.clearData();
      if (this.nowPageNum === 7) {
        this.getSelected();
      }
      this.getParams();
      if (
        this.nowPageNum !== 8 &&
        this.nowPageNum !== 9 &&
        this.nowPageNum !== 10
      ) {
        this.getChart();
      }
      this.getTable();
    },
    changeSelect(e) {
      if (this.nowPageNum === 3 && e !== 3) {
        let op = this.$GetStorage("type" + e + "Code");
        if (op) {
          this.selectOptions1 = op;
        } else {
          this.getSelectOptions(All.gspCode3(), e);
        }
        this.selectDimension1 = -1;
      }
    },
    getSelectOptions(str, type = null) {
      let data;
      if (type) {
        data = {
          method: str,
          params: {
            type: type
          }
        };
      } else {
        data = {
          method: str
        };
      }
      All.postAPI(data).then(res => {
        if (this.nowPageNum === 0) {
          this.typeOptions = res.result;
          this.typeOptions.forEach(item => {
            item.children.unshift({
              label: "全部",
              value: -1
            });
          });
        } else if (this.nowPageNum === 1) {
          this.selectOptions1 = res;
          this.selectOptions1.unshift({
            label: "全部",
            value: -1
          });
          this.$SetStorage("gspPageCode1", this.selectOptions1);
        } else if (
          this.nowPageNum === 2 ||
          this.nowPageNum === 4 ||
          this.nowPageNum === 6
        ) {
          this.valueOptions = res;
          this.valueOptions.unshift({
            label: "全部",
            value: -1
          });
          if (this.nowPageNum === 6) {
            this.$SetStorage("gspPageCode6", this.valueOptions);
          }
        } else if (this.nowPageNum === 3) {
          this.selectOptions1 = res;
          this.selectOptions1.unshift({
            label: "全部",
            value: -1
          });
          if (type === 1) {
            this.$SetStorage("type1Code", this.selectOptions1);
          } else if (type === 2) {
            this.$SetStorage("type2Code", this.selectOptions1);
          } else if (type === 4) {
            this.$SetStorage("type4Code", this.selectOptions1);
          } else if (type === 5) {
            this.$SetStorage("type5Code", this.selectOptions1);
          }
        } else if (this.nowPageNum === 7) {
          if (str === All.gspCode3()) {
            this.selectOptions.wldwId = res;
            this.selectOptions.wldwId.unshift({
              label: "全部",
              value: -1
            });
            this.$SetStorage("type3Code", this.selectOptions.wldwId);
          }
          if (str === All.gspCode6()) {
            this.selectOptions.reason = res;
            this.selectOptions.reason.unshift({
              label: "全部",
              value: -1
            });
            this.$SetStorage("gspPageCode7", this.selectOptions.reason);
          }
        }
      });
    },
    clearData() {
      this.headTable = [];
      this.dataList = [];
      this.total = 0;
      if (this.nowPageNum === 5 && this.valueType === 2) {
        this.chartOption = {
          tooltip: {
            trigger: "item",
            formatter: res => {
              let str;
              [res].forEach(i => {
                str = `<div style="background: ${
                  i.color
                }" class="chart-dot"></div>${
                  i.seriesName ? i.seriesName + " :" : i.seriesName
                } ${this.$ToThousands(i.value)}`;
              });
              return `${res.name} <br> ${str}(${res.percent}%)`;
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
        };
      } else {
        this.chartOption = {
          tooltip: {
            trigger: "axis"
            // formatter: res => {
            //   return this.$ChartFormatter(res, true);
            // }
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
      }
    },
    getData() {
      this.selected = {};
      this.selectedArr = [];
      this.dimension = [];
      this.dimensionOrder = [];
      let num = this.$route.query.analysis;
      this.nowPageNum = +num;
      this.pageSize = 10;
      this.pageNum = 1;
      this.fromDate = this.$store.state.defaultTime1;
      let time = getDaysBefore(true, undefined, 0);
      if (this.nowPageNum === 0) {
        this.selectOptionsName = "类型";
        this.getSelectOptions(All.gspCode0());
      } else if (this.nowPageNum === 1) {
        this.valueType = 1;
        this.selectOptionsName = "类型";
        this.valueOptions = [
          {
            label: "往来单位",
            value: 1
          },
          {
            label: "药品",
            value: 2
          },
          {
            label: "拒收原因",
            value: 3
          }
        ];
        let op = this.$GetStorage("gspPageCode1");
        if (op) {
          this.selectOptions1 = op;
        } else {
          this.getSelectOptions(All.gspCode1());
        }
      } else if (this.nowPageNum === 2) {
        this.valueType = -1;
        this.selectOptionsName = "人员";
        this.getSelectOptions(All.gspCode2());
      } else if (this.nowPageNum === 3) {
        this.selectOptionsName = "类型";
        this.valueOptions = [
          {
            label: "操作员",
            value: 1
          },
          {
            label: "业务员",
            value: 2
          },
          {
            label: "往来单位",
            value: 3
          },
          {
            label: "仓库",
            value: 4
          },
          {
            label: "销退原因",
            value: 5
          }
        ];
        this.getSelectOptions(All.gspCode3(), 1);
        this.selectOptions2 = [
          {
            label: "全部",
            value: -1
          }
        ];
      } else if (this.nowPageNum === 4) {
        this.valueType = -1;
        this.selectOptionsName = "人员";
        this.getSelectOptions(All.gspCode4());
      } else if (this.nowPageNum === 5) {
        this.valueType = 1;
        this.selectOptionsName = "类型";
        this.valueOptions = [
          {
            label: "在库时长",
            value: 1
          },
          {
            label: "在库来源",
            value: 2
          }
        ];
      } else if (this.nowPageNum === 6) {
        this.valueType = -1;
        this.selectOptionsName = "不合格原因";
        let op = this.$GetStorage("gspPageCode6");
        if (op) {
          this.valueOptions = op;
        } else {
          this.getSelectOptions(All.gspCode5());
        }
      } else if (this.nowPageNum === 7) {
        this.fromDate = ["2020/01/01 00:00:00", time + " 23:59:59"];
        let e = {};
        e.selectArr = [
          {
            name: "往来单位",
            code: "wldwId"
          },
          {
            name: "退回原因",
            code: "reason"
          }
        ];
        e.select = {
          name: "往来单位",
          code: "wldwId"
        };
        e.fromWhere = "GSP7";
        this.$store.commit("setDefaulted", e);
      } else if (this.nowPageNum === 8) {
        this.selectOptionsName = "选择类型";
        this.valueOptions = [
          {
            label: "厂家",
            value: 1
          },
          {
            label: "药品",
            value: 2
          }
        ];
      } else if (this.nowPageNum === 9) {
        this.fromDate = ["2020/01/01 00:00:00", time + " 23:59:59"]
        this.selectOptionsName = "选择类型";
        this.valueOptions = [
          {
            label: "品种",
            value: 1
          },
          {
            label: "客户",
            value: 2
          },
          {
            label: "地区",
            value: 3
          }
        ];
      } else if (this.nowPageNum === 10) {
        this.selectOptionsName = "选择类型";
        this.valueOptions = [
          {
            label: "品种",
            value: 1
          },
          {
            label: "客户类型",
            value: 2
          },
          {
            label: "客户",
            value: 3
          }
        ];
      }
    },
    getParams() {
      this.params = {};
      if (this.nowPageNum !== 10) {
        this.params.dimension = this.timeDimension;
      }
      this.params.startDate = this.$GetApiTime(this.fromDate[0]);
      this.params.endDate = this.$GetApiTime(this.fromDate[1]);
      if (this.nowPageNum === 0) {
        if (this.typeDimensionArr.length) {
          this.params.type = this.typeDimensionArr[0];
          this.params.type === 1
            ? (this.params.staffId = this.typeDimensionArr[1])
            : (this.params.medicineType = this.typeDimensionArr[1]);
        }
      } else if (this.nowPageNum === 1) {
        this.params.type = this.valueType;
        if (this.valueType === 3) {
          this.params.rejectReason = this.selectDimension1;
        } else {
          this.params.value = this.searchValue;
        }
      } else if (this.nowPageNum === 2 || this.nowPageNum === 4) {
        this.params.staffId = this.valueType;
      } else if (this.nowPageNum === 3) {
        if (this.valueType === 1) {
          this.params.operator = this.selectDimension1;
        } else if (this.valueType === 2) {
          this.params.salesman = this.selectDimension1;
        } else if (this.valueType === 3) {
          this.params.wldw = this.selectDimension2;
        } else if (this.valueType === 4) {
          this.params.warehouse = this.selectDimension1;
        } else if (this.valueType === 5) {
          this.params.returnSaledReason = this.selectDimension1;
        }
      } else if (this.nowPageNum === 5) {
        this.params.type = this.valueType;
      } else if (this.nowPageNum === 6) {
        this.params.reason = this.valueType;
      } else if (this.nowPageNum === 7) {
        this.params.dimensionOrder = this.dimensionOrder;
        this.params = { ...this.params, ...this.isSelected };
      } else if (this.nowPageNum === 8) {
        this.params.type = this.valueType;
        this.params.minTimes = this.minTimes;
        this.params.maxTimes = this.maxTimes;
        this.params.keyWord = this.searchValue;
      } else if (this.nowPageNum === 9) {
        this.params.type = this.valueType;
        this.params.keyWord = this.searchValue;
      } else if (this.nowPageNum === 10) {
        this.params.type = this.valueType;
        this.params.keyWord = this.searchValue;
        this.params.isBigCustomer = this.isBigCustomer;
      }
    },
    getChart() {
      this.chartLoading = true;
      this.chartOption.title.text = this.listData[this.nowPageNum].name;
      All.postAPI({
        method: this.listData[this.nowPageNum].chartMethod,
        params: this.params
      })
        .then(res => {
          this.chartOption.title.text = this.listData[this.nowPageNum].name;
          this.chartData = res;
          if (
            this.nowPageNum === 0 ||
            this.nowPageNum === 3 ||
            this.nowPageNum === 4 ||
            (this.nowPageNum === 5 && this.valueType === 1) ||
            this.nowPageNum === 6
          ) {
            let dimensions = this.chartData.dimensions;
            let nameArr = Object.keys(dimensions);
            let data = [];
            let xAxis = [];
            let legend = [];
            nameArr.forEach((item, index) => {
              data[index] = [];
              this.chartData[item].forEach((el, ind) => {
                data[index].push(el.value);
                if (index === 0) {
                  xAxis.push(el.label);
                }
              });
              this.chartOption.series[index] = {
                name: dimensions[item],
                type: "line",
                data: data[index],
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
              legend.push(dimensions[item]);
            });
            this.chartOption.xAxis.data = xAxis;
            this.chartOption.legend.data = legend;
          } else if (this.nowPageNum === 1) {
            let dimensions = {
              rejectTimesData: "拒收次数",
              rejectCountData: "拒收数量"
            };
            let nameArr = ["rejectTimesData", "rejectCountData"];
            let data = [];
            let xAxis = [];
            let legend = [];
            nameArr.forEach((item, index) => {
              data[index] = [];
              this.chartData[item].forEach((el, ind) => {
                data[index].push(el.value);
                if (index === 0) {
                  xAxis.push(el.label);
                }
              });
              this.chartOption.series[index] = {
                name: dimensions[item],
                type: "line",
                data: data[index]
              };
              legend.push(dimensions[item]);
            });
            this.chartOption.xAxis.data = xAxis;
            this.chartOption.legend.data = legend;
          } else if (this.nowPageNum === 2) {
            let dimensions = {
              scatteredItemList: "验收散件条目",
              intactPackItemList: "验收整件条目",
              intactPackList: "验收整件件数"
            };
            let nameArr = [
              "scatteredItemList",
              "intactPackItemList",
              "intactPackList"
            ];
            let data = [];
            let xAxis = [];
            let legend = [];
            nameArr.forEach((item, index) => {
              data[index] = [];
              this.chartData[item].forEach((el, ind) => {
                data[index].push(el.value);
                if (index === 0) {
                  xAxis.push(el.label);
                }
              });
              this.chartOption.series[index] = {
                name: dimensions[item],
                type: "line",
                data: data[index]
              };
              legend.push(dimensions[item]);
            });
            this.chartOption.xAxis.data = xAxis;
            this.chartOption.legend.data = legend;
          } else if (this.nowPageNum === 5 && this.valueType === 2) {
            let data = [];
            let legend = [];
            this.chartData.returnStockData.forEach(item => {
              data.push({
                value: item.value,
                name: item.label
              });
              legend.push(item.label);
            });
            this.chartOption.legend.data = legend;
            this.chartOption.series[0].name = "数量";
            this.chartOption.series[0].data = data;
          } else if (this.nowPageNum === 7) {
            let options = this.chartData.dimensions;
            this.chartDimensions = options;
            this.chartDimension = [options[0]];
            let obj = this.chartData.purIndex;
            let arr = Object.keys(obj);
            let dim = [];
            arr.forEach((item, index) => {
              dim[index] = {
                name: obj[item],
                code: index + 1
              };
            });
            this.dimension = dim;
            this.refreshChart();
          }
        })
        .finally(() => {
          this.chartLoading = false;
        });
    },
    getTable() {
      this.tableLoading = true;
      All.postAPI({
        method: this.listData[this.nowPageNum].tableMethod,
        params: {
          ...this.params,
          eg: this.eg,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      })
        .then(res => {
          let resData = {};
          if (this.nowPageNum === 9) {
            resData = res.result;
          } else if (this.nowPageNum === 10 && this.valueType !== 3) {
            resData = res.pageInfo;
          } else {
            resData = res;
          }
          this.total = resData.total;
          let headTable = [];
          let dataList = [];
          let data = resData.result || resData.list;
          if (data.length) {
            let nameArr = Object.keys(data);
            for (let i = 0; i < nameArr.length; i++) {
              let item = nameArr[i];
              let obj = data[item];
              let arr = Object.keys(obj);
              for (let j = 0; j < arr.length; j++) {
                let el = arr[j];
                let text = this.$MapStr(el, this.GSPcode);
                if (text !== "-") {
                  if (i === 0) {
                    let obj1 = {};
                    if (
                      el === "problemTimes" ||
                      (this.nowPageNum === 9 &&
                        this.valueType !== 1 &&
                        (el === "salesNumber" ||
                          el === "recallNumber" ||
                          el === "recallSpCount" ||
                          el === "recallAvgDuration"))
                    ) {
                      obj1 = {
                        text: text,
                        field: el,
                        width: "160px"
                      };
                    } else {
                      obj1 = {
                        text: text,
                        field: el
                      };
                    }
                    if (
                      text === "收货散件条目数" ||
                      text === "收货整件件数" ||
                      text === "收货整件条目数" ||
                      text === "拒收次数" ||
                      text === "拒收数量" ||
                      text === "验收散件条目" ||
                      text === "验收整件条目" ||
                      text === "验收整件件数" ||
                      text === "整件件数" ||
                      text === "条目数" ||
                      text === "整件条目数" ||
                      text === "散件条目数" ||
                      text === "品种数量" ||
                      text === "在库时长" ||
                      text === "品种数" ||
                      text === "数量" ||
                      text === "退出次数" ||
                      text === "含税金额" ||
                      text === "出现质量问题次数" ||
                      text === "购进数量" ||
                      text === "库存数量" ||
                      text === "购买次数" ||
                      text === "购买数量" ||
                      text === "频次" ||
                      (this.nowPageNum === 9 && text === "销售数量") ||
                      text === "召回数量" ||
                      text === "召回耗时" ||
                      text === "召回品种" ||
                      text === "召回平均时间"
                    ) {
                      obj1.sortable = el;
                    }
                    if (this.nowPageNum === 1) {
                      obj1.link = "/gsp/rejectionDetail"; // 外层地址
                    } else if (this.nowPageNum === 3) {
                      if (this.valueType !== 1 && this.valueType !== 2) {
                        obj1.link = "/gsp/saleReturnsDetail";
                      }
                    } else if (this.nowPageNum === 5) {
                      obj1.link = "/gsp/returnsDirectionDetail";
                    } else if (this.nowPageNum === 6) {
                      obj1.link = "/gsp/unqualifiedDetail";
                    } else if (this.nowPageNum === 7) {
                      obj1.link = "/gsp/cancelDetail";
                    } else if (this.nowPageNum === 8) {
                      obj1.link = "/gsp/qualityDetail";
                    }
                    if (this.nowPageNum === 10 && text === "购买次数") {
                      continue;
                    }
                    headTable.push(obj1);
                  }
                }
              }
            }
            data.forEach((item, index) => {
              if ("children" in item) {
                if (this.nowPageNum === 0) {
                  item.code = item.staffId || item.medicineTypeCode;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.medicineTypeName = el.staffName = el.date;
                  });
                } else if (this.nowPageNum === 1) {
                  item.code = item.wldw || item.jusyyId;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    this.valueType === 1
                      ? (el.wldw = el.date)
                      : (el.jusyy = el.date);
                  });
                } else if (this.nowPageNum === 2 || this.nowPageNum === 4) {
                  item.code = item.staffName;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.staffName = el.date;
                  });
                } else if (this.nowPageNum === 3) {
                  item.code =
                    item.operatorId ||
                    item.salesmanId ||
                    item.wldwName ||
                    item.warehouseId ||
                    item.reasonId;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    if (this.valueType === 1) {
                      el.operatorName = el.date;
                    } else if (this.valueType === 2) {
                      el.salesmanName = el.date;
                    } else if (this.valueType === 3) {
                      el.wldw = el.wldwName;
                      el.wldwName = el.date;
                    } else if (this.valueType === 4) {
                      el.warehouseName = el.date;
                    } else {
                      el.reasonName = el.date;
                    }
                  });
                } else if (this.nowPageNum === 5) {
                  item.code = item.warehouseId;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.warehouseName = el.date;
                  });
                } else if (this.nowPageNum === 6) {
                  item.code = item.substandardReasonId;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.substandardReason = el.date;
                  });
                } else if (this.nowPageNum === 8) {
                  item.code = item.producer;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.producer =
                      el.time +
                      "ㅤ" +
                      el.spName +
                      "ㅤ" +
                      el.spStandard +
                      "ㅤ" +
                      el.pihao +
                      "ㅤ" +
                      el.spType +
                      "ㅤ" +
                      el.testFailedItem +
                      "ㅤ" +
                      el.testBasis +
                      "ㅤ" +
                      el.producer +
                      "ㅤ" +
                      el.testDepartment;
                    el.problemTimes = el.announcement;
                  });
                } else if (this.nowPageNum === 9) {
                  item.code = item.customerId || item.regionCode;
                  item.children.forEach((el, ind) => {
                    el.code = item.code + "-" + ind;
                    el.customerName =
                      el.date +
                      "ㅤ" +
                      el.spId +
                      "ㅤ" +
                      el.spName +
                      "ㅤ" +
                      el.spStandard +
                      "ㅤ" +
                      el.pihao +
                      "ㅤ" +
                      el.recallUnit;
                  });
                }
              }
              if (this.nowPageNum === 10) {
                this.lazy = false;
                if (this.valueType === 3) {
                  item.hasChildren = true;
                  this.lazy = true;
                }
              }
            });
            let total = resData.whole;
            switch (this.nowPageNum) {
              case 0:
                let name =
                  this.params.type === 1 ? "staffName" : "medicineTypeName";
                data.unshift({
                  [name]: "合计",
                  intactPack: total.intactPack,
                  intactPackItem: total.intactPackItem,
                  scatteredItem: total.scatteredItem
                });
                break;
              case 1:
                if (this.params.type !== 2) {
                  let name = this.params.type === 3 ? "jusyy" : "wldw";
                  data.unshift({
                    [name]: "合计",
                    times: total.times,
                    num: total.num
                  });
                }
                break;
              case 2:
                data.unshift({
                  staffName: "合计",
                  intactPackCount: total.intactPackCount,
                  intactPackItemCount: total.intactPackItemCount,
                  scatteredItemCount: total.scatteredItemCount
                });
                break;
              case 3:
                if (this.valueType === 1) {
                  data.unshift({
                    operatorName: "合计",
                    jianshu: total.jianshu,
                    pack: total.pack
                  });
                } else if (this.valueType === 2) {
                  data.unshift({
                    salesmanName: "合计",
                    frequency: total.frequency,
                    shul: total.shul,
                    hansje: total.hansje
                  });
                } else if (this.valueType === 3) {
                  data.unshift({
                    wldwName: "合计",
                    frequency: total.frequency,
                    shul: total.shul,
                    hansje: total.hansje
                  });
                } else if (this.valueType === 4) {
                  data.unshift({
                    warehouseName: "合计",
                    breed: total.breed,
                    shul: total.shul
                  });
                } else if (this.valueType === 5) {
                  data.unshift({
                    reasonName: "合计",
                    frequency: total.frequency,
                    shul: total.shul,
                    hansje: total.hansje
                  });
                }
                break;
              case 4:
                data.unshift({
                  staffName: "合计",
                  yanshouSjtm: total.yanshouSjtm,
                  yanshouZjtm: total.yanshouZjtm
                });
                break;
              case 6:
                data.unshift({
                  substandardReason: "合计",
                  spCount: total.spCount,
                  number: total.number
                });
                break;
            }
          } else {
            this.dataList = [];
            this.$Notif({
              title: "提示",
              message: `当前筛选条件下列表暂无数据`,
              type: "warning"
            });
          }
          this.headTable = headTable;
          this.dataList = data;
          // console.log(this.dataList)
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    placeholderFn() {
      if (this.nowPageNum === 3) {
        return this.valueType === 1 ? "请输入往来单位" : "请输入药品名称";
      } else if (this.nowPageNum === 8) {
        return this.valueType === 1 ? "请输入厂家名称" : "请输入药品名称";
      } else if (this.nowPageNum === 9) {
        return this.valueType === 1
          ? "请输入商品名称"
          : this.valueType === 2
          ? "请输入客户名称"
          : "请输入地区";
      } else if (this.nowPageNum === 10) {
        return this.valueType === 1
          ? "请输入品种名称"
          : this.valueType === 2
          ? "请输入客户类型"
          : "请输入客户名称";
      }
    },
    search() {
      if (this.nowPageNum === 7) {
        if (new Set(this.hasSelect).size !== this.hasSelect.length) {
          this.$Notif({
            title: "提示",
            message: `不能选择相同维度`,
            type: "warning"
          });
          return;
        }
        this.getIsSelected();
      }
      this.clearData();
      this.getParams();
      if (
        this.nowPageNum !== 8 &&
        this.nowPageNum !== 9 &&
        this.nowPageNum !== 10
      ) {
        this.getChart();
      }
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
    getSelected() {
      if (
        JSON.stringify(this.defaulted.select) !== "{}" &&
        this.defaulted.selectArr.length
      ) {
        this.defaultIsSelect = this.defaulted.select;
        let code = this.defaultIsSelect.code;
        this.selected[code] = this.defaultSelected[code];
        this.selectNum = [this.defaulted.select.name + "," + Date.now()];
      } else {
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
            key = this.GSP7Code[i];
            this.selected[key] = item[i];
          });
        }
      });
      console.log(this.selected);
      Object.keys(this.selected).forEach(i => {
        obj[i] = this.selected[i];
      });
      this.isSelected = obj;
      console.log(this.isSelected);
    },
    refreshChart() {
      let res = this.chartData;
      let xAxisData = [];
      let keyObj = res.purIndex;
      let keyArr = Object.keys(keyObj);
      let key = keyArr[this.queryDimension - 1];
      this.chartOption.series = [];
      this.chartOption.xAxis.data = [];
      this.chartOption.legend.data = [];
      let series = [];
      let legend = [];
      if (this.chartDimensions.length) {
        this.chartDimension.forEach((item, index) => {
          let resData = res.result[item];
          let data = [];
          legend.push(item + "," + keyObj[key]);
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
            name: item + "," + keyObj[key],
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
      }
      this.chartOption.legend.data = legend;
      this.chartOption.series = series;
      this.chartOption.xAxis.data = xAxisData;
    },
    remoteMethod(str) {
      if (str !== "") {
        this.selectLoading = true;
        All.postAPI({
          method: All.gspCode3(),
          params: {
            type: 3,
            keyWord: str
          }
        })
          .then(res => {
            this.selectOptions2 = res;
            this.selectOptions2.unshift({
              label: "全部",
              value: -1
            });
          })
          .finally(() => {
            this.selectLoading = false;
          });
      }
    },
    load(tree, treeNode, resolve) {
      let wldwId = tree.wldwId;
      if (tree.level == 2) {
        wldwId = wldwId.split("-")[0];
      }
      let params = {
        wldwId: wldwId,
        ...this.params,
        eg: this.eg,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (tree.level == 2) {
        params.date = this.$GetApiTime(tree.date);
      }
      All.postAPI({
        method: this.listData[this.nowPageNum].tableMethod,
        params: params
      })
        .then(res => {
          let arr = [];
          if (tree.level == 2) {
            arr = res.list[0].children[0].children;
          } else {
            arr = res.list[0].children;
          }
          arr.forEach(el => {
            if (el.level == 2) {
              el.consumerName = el.date;
              el.hasChildren = true;
            }
            if (el.level == 3) {
              el.consumerName =
                el.date +
                "ㅤ" +
                el.spId +
                "ㅤ" +
                el.spName +
                "ㅤ" +
                el.spStandard;
            }
          });
          resolve(arr);
        })
        .finally(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.input-css {
  width: 60px;
  /deep/ {
    input {
      text-align: center;
    }
  }
}
</style>