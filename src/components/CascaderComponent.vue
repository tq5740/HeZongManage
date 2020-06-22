<template>
  <div id="Cascader">
    <el-cascader v-model="selectValue" @change="changeSelect" :placeholder="placeholder" :options="optionsArr" :props="{...props, ...otherProps}" :multiple="multiple" :filterable="filterable" :style="`width: ${width}`"></el-cascader>
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
    },
    filterable: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    vmodel: {
      handler: 'getValue',
      deep: true,
      immediate: true
    },
    options: {
      handler: "getOption",
      immediate: true
    }
  },
  data() {
    return {
      selectValue: "",
      optionsArr: []
    };
  },
  model: {
    prop: "vmodel",
    event: "change"
  },
  mounted() {
	//点击文本就让它自动点击前面的input就可以触发选择。但是因组件阻止了冒泡，暂时想不到好方法来触发。
	//这种比较耗性能，暂时想不到其他的，能实现效果了。
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    getValue() {
      this.selectValue = this.vmodel;
    },
    changeSelect(e) {
      this.$emit("change", e);
    },
    getOption() {
      if (this.firstOption !== "") {

      }
      this.optionsArr = this.options;
    }
  }
};
</script>
<style lang="scss">

</style>


