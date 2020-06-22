<template>
  <div>
    <!-- <el-select v-model="selectValue" @change="changeSelect" :placeholder="placeholder" :collapse-tags="collapseTags" :multiple="multiple" :filterable="filterable" :style="`width: ${width}`" :disabled="disabled" :size="size" v-el-select-loadmore="loadmore" :remote-method="remoteMethod">
      <el-option v-for="(item, index) in optionsItem" :key="index" :label="propLebel === 'self' ? item : item[propLebel]" :value="propValue === 'self' ? item : item[propValue]" :disabled="(propLebel ? item[propLebel] : item) === optionsDisabled"></el-option>
    </el-select> -->
    <el-select v-model="selectValue" filterable remote placeholder="请输入往来单位" :remote-method="remoteMethod" :loading="selectLoading">
      <el-option v-for="item in optionsItem" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import All from "@api/all";
export default {
  props: {
    vmodel: [String, Array, Number],
    options: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      selectValue: "",
      optionsItem: [],
      dataLen: 0,
      lazyNum: 200,
      selectLoading: false
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
          this.optionsItem = this.options;
        }
      }
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
            this.optionsItem = res;
            this.optionsItem.unshift({
              label: "全部",
              value: -1
            });
          })
          .finally(() => {
            this.selectLoading = false;
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


