<template>
  <div id="app">
    <el-row :gutter="0" class="maxheight">
      <div class="right-col maxheight left0">
        <div class="right maxheight">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </div>
    </el-row>
  </div>
</template>


<script>
export default {
};
</script>
<style lang="scss" scoped>
.maxheight {
  height: 100%;
  background-color: rgb(245, 245, 245);
}
.right {
  overflow-y: auto;
  width: 100%;
}
.left-col {
  width: 201px;
}
.right-col {
  background: #f0f2f5;
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  transition: 0.3s;
}
.left0 {
  left: 0;
}
.left180 {
  left: 200px;
}
.disable-btn {
  border-radius: 0;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  color: #000;
}
</style>
<style lang="scss">
.disable-btn {
  border-radius: 0;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  color: #000;
}
.tab-head {
  .tab-head {
    padding-left: 0 !important;
  }
  .el-input {
    padding-left: 0 !important;
    .el-input__inner {
      color: #4e5c79;
      font-weight: bold;
      padding: 0;
      border-color: transparent !important;
      background-color: transparent;
    }
    &:hover,
    &:focus {
      .el-input__inner {
        border-color: transparent;
      }
    }
  }
  .el-input__suffix {
    display: none;
  }
}
</style>
