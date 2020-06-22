<template>
  <div>
    <ul class="list-row">
      <li v-for="(item, index) in dataArr" :key="index">
        <p class="title">{{item.name}}</p>
        <p class="content">
          <span class="value1">{{item.value1}}</span>
          <span class="value2" v-if="item.value2 && item.value2 !== ''">/ {{item.value2}}</span>
          {{item.unit}}
          <span class="change" v-if="item.change && item.change !== ''">
            <el-icon :class="item.change.includes('-') ? 'state1 el-icon-bottom' : 'state3 el-icon-top'"></el-icon>
            {{item.change}}
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    dataArr: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.list-row {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  li {
    width: 100%;
    text-align: center;
    position: relative;
    .title {
      font-size: 14px;
      color: $font2;
    }
    .content {
      color: $font2;
      .value1 {
        font-size: 30px;
        color: $black;
      }
      .value2 {
        color: $font1;
        font-size: 20px;
      }
      .change {
        position: absolute;
        margin-left: 10px;
      }
    }
  }
  li:not(:first-child)::after {
    content: " ";
    width: 1px;
    height: 40px;
    background: $boder2;
    display: block;
    position: absolute;
    left: 0px;
    top: 10px;
  }
}
.state1 {
    color: $state1;
}
.state2 {
    color: $state2;
}
.state3 {
    color: $state3;
}
.state4 {
    color: $state4;
}
</style>