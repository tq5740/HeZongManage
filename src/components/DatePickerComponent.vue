<template>
  <div id="dateRange">
    <el-date-picker v-model="selectValue" @change="changeDate" :value-format="valueFormat" :format="format" :type="type" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="picker" popper-class="dateRange-popper"></el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    vmodel: [String, Array, Number],
    pickerOptions: {
      type: Object,
      default: () => ({})
    },
    valueFormat: {
      type: String,
      default: "yyyy/MM/dd HH:mm:ss"
    },
    format: {
      type: String,
      default: "yyyy/MM/dd HH:mm"
    },
    type: {
      type: String,
      default: "datetimerange"
    }
  },
  watch: {
    pickerOptions: {
      handler(newVal, oldVal) {
        this.picker = newVal;
      },
      deep: true //对象内部属性的监听，关键。
    },
    vmodel: {
      handler(newVal, oldVal) {
        this.selectValue = newVal;
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  data() {
    return {
      selectValue: "",
      picker: {}
    };
  },
  created() {
    this.selectValue = this.vmodel;
    if (this.type === "datetimerange") {
      this.picker = this.$store.state.pickerOptions;
    } else {
      this.picker = {
        disabledDate: time => {
          return time.getTime() > new Date().getTime();
        }
      };
    }
  },
  model: {
    prop: "vmodel",
    event: "change"
  },
  methods: {
    changeDate(e) {
      this.$emit("change", e);
    }
  }
};
</script>
<style lang="scss">
.dateRange-popper {
  .el-button--text
  // .el-date-range-picker__time-header
 {
    display: none;
  }
}
.el-date-editor.el-input {
  width: 100%;
}
</style>


