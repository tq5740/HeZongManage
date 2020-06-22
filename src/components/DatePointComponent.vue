<template>
  <div id="date-point">
    <el-date-picker v-model="selectValue" @change="changeDate" type="date" :value-format="valueFormat" format="yyyy/MM/dd HH:mm" placeholder="选择日期"></el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    vmodel: [String, Array, Number],
    valueFormat: {
      default: "yyyy/MM/dd",
      type: String
    }
  },
  watch: {
    vmodel: {
      handler(newVal, oldVal) {
        this.selectValue = newVal;
      },
      deep: true
    },
  },
  data() {
    return {
      selectValue: ""
    };
  },
  created() {
    this.selectValue = this.vmodel;
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
</style>


