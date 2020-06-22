<template>
  <div id="Dialog">
  </div>
</template>

<script>
export default {
  props: {
    width: String,
    vmodel: [String, Array, Number],
    options: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({ label: "name", value: "code" })
    },
    otherProps: Object,
    placeholder: {
      type: String,
      default: "请选择"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    firstOption: {
      // 选项放前面
      type: String,
      default: ""
    }
  },
  watch: {
    vmodel: {
      handler: 'getValue',
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      selectValue: ""
    };
  },
  model: {
    prop: "vmodel",
    event: "change"
  },
  methods: {
    getValue() {
      this.selectValue = this.vmodel;
    },
    changeSelect(e) {
      this.$emit("change", e);
    }
  }
};
</script>
<style lang="scss">

</style>


