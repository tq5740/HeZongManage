<template>
  <div id="ChartBox">
    <div class="header">
      <div class="left" @click="link" :class="islink ? 'islink' : ''">
        <h5 class="title" :style="{marginTop: (time.range ?  '' : '18px'),fontWeight: (time.range ?  '' : 'bold')}">{{title}}</h5>
        <span class="time" v-if="from !== 'WMS' && time.range">(过去
          <count-to style="color: #000" :start-val="0" :end-val="+time.days || 0" :duration="3600" />天
          <count-to style="color: #000" :start-val="0" :end-val="+time.hours || 0" :duration="3600" />时)
        </span>
        <br>
        <span class="time">{{time.range}}</span>
      </div>
      <div class="right">
        <el-form :inline="true" label-position="right" class="form-item-bottom0">
          <el-form-item :label="el.name" v-for="(el, key) in select" :key="key" class="radio-btn">
            <selectComponent v-model="el.default" :placeholder="el.placeholder" :options="el.options" @change="changeSelect(el.default, el.name)" :width="el.name == '粒度' ? '80px': '100px'"
              size="small" v-if="'name' in el && el.name" :multiple="multiple">
            </selectComponent>
            <el-radio-group v-model="dataArr[el.default]" @change="changeSelect(dataArr[el.default], el.name)" v-else size="small">
              <el-radio-button :label="item.code" v-for="item in el.options" :key="item.code">{{item.name}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main">
      <div class="from" v-if="boxType === 'echartFrom'">
        <ul class="fromUl">
          <li v-for="(el, key) in fromData" :key="key" class="fromLi">
            <p class="label">{{el.label}}
              <el-tooltip effect="dark" :content="el.tips" placement="top" v-if="el.tips">
                <i class="el-icon-info tips"></i>
              </el-tooltip>
            </p>
            <p class="value" :title="el.value"><count-to :start-val="0" :end-val="el.value || 0" :duration="3600" :decimals="el.unit === '%' ? 2 : 0" :suffix="el.unit" /></p>
          </li>
        </ul>
      </div>
      <div class="chart" :class="{'haveTable': boxType === 'echartFrom'}" v-if="boxType !== 'table'">
        <echarts :option="option" :clickType="cliType" :height="chartHeight"></echarts>
        <div class="chart8alldata" v-if="totalTitle">
          <p class="title">{{totalTitle}}</p>
          <p class="data">{{totalData}}</p>
        </div>
      </div>
      <div class="table" v-if="boxType === 'table'">
        <tableComponent :headTable="headTable" :dataList="tableData" :showPage="showPage" from="tmsChartBox" height="360px"></tableComponent>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "@c/Echarts.vue";
import tableComponent from "@c/TableComponent.vue";
import selectComponent from "@c/SelectComponent.vue";
import All from "@api/all";
import CountTo from "vue-count-to";
export default {
  components: {
    echarts,
    tableComponent,
    selectComponent,
    CountTo
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "380px"
    },
    from: {
      type: String,
      default: ""
    },
    time: {
      type: Object,
      default: () => ({})
    },
    select: {
      type: Array,
      default: () => []
    },
    boxType: {
      type: String,
      default: "echart" // echart | tabel | echart&from
    },
    fromData: {
      type: Array,
      default: () => []
    },
    headTable: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    chartOption: {
      type: Object,
      default: () => ({})
    },
    totalTitle: String,
    totalData: String,
    showPage: {
      type: Boolean,
      default: true
    },
    islink: {
      type: Boolean,
      default: true
    },
    clickType: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartHeight: this.height,
      cliType: this.clickType,
      timeDimension: 2,
      queryDimension: 2,
      dataArr: [0,1,2,3,4,5,6],
      option: {}
    };
  },
  computed: {
    ERPlistData() {
      return this.$store.state.ERPlistData;
    }
  },
  watch: {
    //观察option的变化
    chartOption: {
      handler(newVal, oldVal) {
        this.option = newVal;
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  methods: {
    startFn() {

    },
    link() {
      let defaulted = this.$store.state.defaulted;
      if (this.from === "ERP") {
        if (this.title === "客户整体销售情况") {
          defaulted = this.ERPlistData[0];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage(
            { url: "/sale/customer?analysis=0" },
            "*"
          );
        } else if (this.title === "渠道销售") {
          defaulted = this.ERPlistData[1];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage(
            { url: "/sale/customer?analysis=1" },
            "*"
          );
        } else if (this.title === "区域销售") {
          defaulted = this.ERPlistData[2];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage(
            { url: "/sale/customer?analysis=2" },
            "*"
          );
        } else if (this.title === "客户类型销售") {
          defaulted = this.ERPlistData[3];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage({ url: "/sale/customer" }, "*");
        } else if (this.title === "品种销售") {
          defaulted = this.ERPlistData[4];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage({ url: "/sale/category" }, "*");
        } else if (this.title === "部门销售") {
          defaulted = this.ERPlistData[5];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage(
            { url: "/sale/customer?analysis=5" },
            "*"
          );
        } else if (this.title === "部门欠款&回款") {
          defaulted = this.ERPlistData[6];
          this.$store.commit("setDefaulted", defaulted);
          window.parent.postMessage({ url: "/sale/debt" }, "*");
        }
      } else if (this.from === "ECS") {
        if (this.title === "电商客户整体销售情况") {
          window.parent.postMessage({ url: "/ecs/salecstm" }, "*");
        } else if (this.title === "区域销售") {
          window.parent.postMessage({ url: "/ecs/salecstm?sale=1" }, "*");
        } else if (this.title === "会员等级销售") {
          window.parent.postMessage({ url: "/ecs/salecstm?sale=2" }, "*");
        } else if (this.title === "品种销售") {
          window.parent.postMessage({ url: "/ecs/salectgy" }, "*");
        } else if (this.title === "复购次数") {
          window.parent.postMessage({ url: "/ecs/rebuyct" }, "*");
        } else if (this.title === "部门销售") {
          window.parent.postMessage({ url: "/ecs/salecstm?sale=5" }, "*");
        } else if (this.title === "支付统计") {
          window.parent.postMessage({ url: "/ecs/paymentstat" }, "*");
        }
      } else if (this.from === "WMS") {
        if (this.title === "收货上架及时率") {
          window.parent.postMessage({ url: "/wms/shouhsj" }, "*");
        } else if (this.title === "出库及时率") {
          window.parent.postMessage({ url: "/wms/chukrate" }, "*");
        } else if (this.title === "破损率") {
          window.parent.postMessage({ url: "/wms/dmgrate" }, "*");
        } else if (this.title === "出库箱数") {
          window.parent.postMessage({ url: "/wms/chukn" }, "*");
        } else if (this.title === "个人小时效率") {
          window.parent.postMessage({ url: "/wms/efficiency" }, "*");
        } else if (this.title === "库存分布") {
          window.parent.postMessage({ url: "/wms/stock" }, "*");
        }
      } else if (this.from === "TMS") {
        if (this.title === "接货量") {
          window.parent.postMessage({ url: "/wms/receive" }, "*");
        } else if (this.title === "出库及时率") {
          window.parent.postMessage({ url: "/wms/timely" }, "*");
        } else if (this.title === "破损率") {
          window.parent.postMessage({ url: "/wms/efficiency" }, "*");
        } else if (this.title === "出库箱数") {
          window.parent.postMessage({ url: "/wms/aging" }, "*");
        } else if (this.title === "个人小时效率") {
          window.parent.postMessage({ url: "/wms/delivery" }, "*");
        } else if (this.title === "库存分布") {
          window.parent.postMessage({ url: "/wms/complain" }, "*");
        }
      }
    },
    changeSelect(e, name) {
      // console.log(e, name);
      if (name === "指标") {
        this.queryDimension = e;
      } else if (name === "粒度") {
        this.timeDimension = e;
      }
      this.$emit("changeSelect", e, name, this.title);
    },
    // 排序回调
    sortableChange({ order, prop }) {
      if (this.title === "个人小时效率" || this.title === "个人效率") {
        let str = "";
        switch (order) {
          case "ascending":
            this.$parent.eg = `${prop} asc`;
            break;
          case "descending":
            this.$parent.eg = `${prop} desc`;
            break;
          default:
            this.$parent.eg = "";
        }
      }
      this.$parent.sortableChange();
    }
  }
};
</script>
<style lang="scss" scoped>
#ChartBox {
  width: 100%;
  background-color: #fff;
  border: 1px solid #fff;
  &:hover {
    border: 1px solid #40c9c6;
    // box-shadow: 0 0 8px 0 rgba(232, 239, 250, 0.8),
    //   0 2px 4px 0 rgba(232, 237, 250, 0.7);
  }
  .header {
    height: 58px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    .left {
      .title {
        font-size: 14px;
        display: inline-block;
        margin-left: 10px;
        margin-top: 10px;
        color: #333;
      }
      .time {
        color: $font1;
        margin-left: 10px;
      }
    }
  }
  .islink {
    cursor: pointer;
  }
  .islink:hover {
    .title,
    .time {
      color: $hover;
    }
  }
  .main {
    width: 100%;
    height: 400px;
    position: relative;
    .from {
      // width: 180px;
      // overflow: hidden;
      float: left;
      margin: 40px 0 0 30px;
      // &:hover {
      //   overflow: inherit;
      // }
      .fromUl {
        padding-right: 20px;
        max-height: 322px;
        overflow-y: auto;
        .fromLi {
          margin-bottom: 10px;
        }
        .label {
          color: #888;
          font-size: 14px;
        }
        .value {
          color: #666;
          font-weight: 400;
          font-size: 24px;
          margin-left: 20px;
        }
      }
    }
    .chart {
      margin-top: 20px;
      .chart8alldata {
        top: 175px;
      }
    }
    .table {
      margin: 10px 30px;
      margin-top: 20px;
    }
    .haveTable {
      position: absolute;
      left: 225px;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
}
</style>
