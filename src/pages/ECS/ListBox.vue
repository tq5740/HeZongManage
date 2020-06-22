<template>
  <div id="ListBox">
    <div class="header">
      <div class="left">
        <h5 class="title">{{title}}</h5>
        <span class="time">(过去
          <count-to style="color: #000" :start-val="0" :end-val="+time.days || 0" :duration="3600" />天
          <count-to style="color: #000" :start-val="0" :end-val="+time.hours || 0" :duration="3600" />时)
        </span>
        <br>
        <span class="time">{{time.range}}</span>
      </div>
    </div>
    <div class="main">
      <div class="list-chunk" v-for="(item, index) in listData" :key="index" @click="link(item)" :class="item.link ? 'list-click' : ''">
        <div class="list-icon" :style="`background-color: ${item.color}`">
          <svg class="svg" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </div>
        <div class="list-text">
          <p class="name">{{item.name}}
            <el-tooltip effect="dark" :content="item.tips" placement="top" v-if="item.tips">
              <i class="el-icon-info tips"></i>
            </el-tooltip>
          </p>
          <count-to :start-val="0" :end-val="item.code" :duration="3600" class="code" />
          <span v-if="item.name.indexOf('率') != -1" class="code">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    time: {
      type: Object,
      default: () => ({})
    },
    listData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    link(e) {
      let defaulted = this.$store.state.defaulted;
      defaulted.chart = {
        name: e.name,
        method: e.method,
        unit: e.unit || ""
      };
      defaulted.selectArr = []; // 这里点过去不需要选择维度，清空下拉框
      defaulted.show = {
        // 这里点过去不需要选择维度和范围，隐藏
        dimension: false,
        scope: false,
        time: true
      };
      defaulted.chartTable = true;
      this.$store.commit("setDefaulted", defaulted);
      window.parent.postMessage({ url: e.link }, "*");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
