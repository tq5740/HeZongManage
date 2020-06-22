<template>
  <div id="Select">
    <el-select v-model="selectValue" @change="changeSelect" :placeholder="placeholder" :collapse-tags="collapseTags" :multiple="multiple" :filterable="filterable" :style="`width: ${width}`" :disabled="disabled" :size="size" v-el-select-loadmore="loadmore" :remote-method="remoteMethod">
      <el-option v-for="(item, index) in optionsItem" :key="index" :label="propLebel === 'self' ? item : item[propLebel]" :value="propValue === 'self' ? item : item[propValue]" :disabled="(propLebel ? item[propLebel] : item) === optionsDisabled"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    width: String,
    size: String,
    vmodel: [String, Array, Number],
    options: {
      type: Array,
      default: () => []
    },
    propLebel: {
      type: String,
      default: "name"
    },
    propValue: {
      type: String,
      default: "code"
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    optionsDisabled: {
      // 禁选项
      type: String,
      default: ""
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
    remoteMethod: {
      type: Function,
      default: function(str) {
        
      }
    }
  },
  data() {
    return {
      selectValue: "",
      optionsItem: [],
      dataLen: 0,
      lazyNum: 200
    };
  },
  watch: {
    vmodel: {
      handler: "getValue",
      immediate: true
    },
    options: {
      handler: "getOption",
      immediate: true
    }
  },
  model: {
    prop: "vmodel",
    event: "change"
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  methods: {
    getValue() {
      this.selectValue = this.vmodel;
    },
    getOption() {
      if (this.filterable) {
        this.optionsItem = this.options;
      } else {
        this.dataLen = this.options.length;
        if (this.dataLen > this.lazyNum) {
          this.optionsItem = this.options.slice(0, this.lazyNum);
        } else {
          if (this.firstOption !== "") {
            // 特殊处理把某个选项放在第一位，总选项个数不超过200才执行（四川省放第一）
            let arr = [...this.options];
            for (let i = 0; i < this.dataLen; i++) {
              if (arr[i].name === this.firstOption) {
                let op = arr[i];
                arr.splice(i, 1);
                arr.splice(1, 0, op);
                break;
              }
            }
            this.optionsItem = arr;
          } else {
            this.optionsItem = this.options;
          }
        }
      }
    },
    changeSelect(e) {
      this.$emit("change", e);
      this.$emit("changeSelect", e);
    },
    // 下拉加载
    loadmore() {
      if (!this.filterable) {
        let num = this.optionsItem.length;
        if (num < this.dataLen) {
          this.optionsItem = this.optionsItem.concat(
            this.options.slice(num, num + this.lazyNum)
          );
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


