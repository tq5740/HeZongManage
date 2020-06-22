<template>
  <div class="all">
    <div class="tabs">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
  }
};
</script>
<style lang="scss" scoped>
.all {
  position: relative;
}
.tabs {
  padding: 20px 20px 0px 20px;
  box-sizing: border-box;
  background-color: #f0f2f5 !important;
}
</style>
