<template>
  <div id="echarts">
    <div :style="{height:height,width:width}" ref="chart"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
require("echarts/theme/macarons"); // echarts theme
// var ecConfig = require('echarts/config');
require("echarts/map/js/china");
export default {
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "345px"
    },
    typeName: {
      type: String,
      default: "line"
    },
    title: {
      type: String,
      default: ""
    },
    option: {
      type: Object,
      default: () => ({})
    },
    clickType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  watch: {
    //观察option的变化
    option: {
      handler(newVal, oldVal) {
        if (this.myChart) {
          if (newVal) {
            this.myChart.setOption(newVal,true);
          } else {
            this.myChart.setOption(oldVal,true);
          }
        } else {
          this.init();
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.myChart = echarts.init(this.$refs.chart, "macarons");
      let myChart = this.myChart;
      if ("tooltip" in this.option) {
        this.option.tooltip.axisPointer = {
          type: "cross",
          animation: false,
          label: {
            backgroundColor: "rgb(0,138,205)"
          }
        };
      }
      if ("xAxis" in this.option) {
        if (this.option.xAxis instanceof Array) {
          this.option.xAxis[0].axisTick = {
            show: false
          };
        } else {
          this.option.xAxis.axisTick = {
            show: false
          };
        }
      }
      if ("yAxis" in this.option) {
        if (this.option.yAxis instanceof Array) {
          this.option.yAxis[0].axisTick = {
            show: false
          };
        } else {
          this.option.yAxis.axisTick = {
            show: false
          };
        }
      }
      // if ("title" in this.option) {
      //   this.option.title.textStyle = { color: "#333" }
      // } else {
      //   this.option.title = {
      //     textStyle: { color: "#333" }
      //   }
      // }
      myChart.setOption(this.option,true);
      window.addEventListener("resize", function() {
        // console.log(myChart)
        myChart.resize();
      });
      if (this.clickType && this.clickType === "map") {
        myChart.on('click',  (param) => {
          console.log(param.name)
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#echarts {
  width: 100%;
}
</style>
