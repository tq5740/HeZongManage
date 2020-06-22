<template>
  <div id="ListBox">
    <div class="main">
      <div class="list-chunk" v-for="(item, index) in listData" :key="index" @click="link(item)" :class="item.link ? 'list-click' : ''">
        <div class="list-icon" :style="`background-color: ${item.color}`">
          <svg class="svg" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </div>
        <div class="list-text">
          <span class="name">{{item.name}}</span>
          <count-to :start-val="0" :end-val="item.code || 0" :duration="3600" class="code" />
          <span v-if="item.name.indexOf('率') != -1" class="code">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
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
      window.parent.postMessage({ url: e.link }, "*");
      // this.$router.push(e.link);
    }
  }
};
</script>
<style lang="scss" scoped>
#ListBox {
  background: transparent;
  .main {
    margin-top: -2%;
    padding-top: 0;
    justify-content: space-between;
    .list-chunk {
      width: 23.5%;
      margin-top: 2%;
      margin-bottom: 0;
      background: #fff;
    }
  }
}
</style>
