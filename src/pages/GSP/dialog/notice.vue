<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="类别 :">
        <el-input v-model="params.spType" placeholder="请输入类别" clearable class="w80per"></el-input>
        <span class="must">*</span>
      </el-form-item>
      <el-form-item label="序号 :">
        <el-input v-model="params.index" placeholder="请输入序号" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="药品品名 :">
        <el-input v-model="params.spName" placeholder="请输入药品品名" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="标示生产企业 :">
        <el-input v-model="params.producer" placeholder="请输入标示生产企业" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="药品规格 :">
        <el-input v-model="params.spStandard" placeholder="请输入药品规格" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="生产批号 :">
        <el-input v-model="params.pihao" placeholder="请输入生产批号" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="检品来源 :">
        <el-input v-model="params.sampleSource" placeholder="请输入检品来源" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="检验依据 :">
        <el-input v-model="params.testBasis" placeholder="请输入检验依据" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="检验结果 :">
        <el-input v-model="params.testResult" placeholder="请输入检验结果" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="不合格项目 :">
        <el-input v-model="params.testFailedItem" placeholder="请输入不合格项目" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="检验机构名称 :">
        <el-input v-model="params.testDepartment" placeholder="请输入检验机构名称" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="公告 :">
        <el-input v-model="params.announcement" placeholder="请输入公告" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="日期 :">
        <datePointComponent v-model="params.time" class="w80per"></datePointComponent>
      </el-form-item>
      <el-form-item label="备注 :">
        <el-input v-model="params.remark" placeholder="请输入备注" clearable class="w80per"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(All.gspDetailSave8())">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import datePointComponent from "@c/DatePointComponent.vue";
import All from "@api/all";
export default {
  components: {
    datePointComponent
  },
  data() {
    return {
      All: All,
      params: {
        spType: "",
        index: "",
        spName: "",
        producer: "",
        spStandard: "",
        pihao: "",
        sampleSource: "",
        testBasis: "",
        testResult: "",
        testFailedItem: "",
        testDepartment: "",
        announcement: "",
        remark: "",
        time: ""
      }
    };
  },
  methods: {
    onSubmit(str) {
      for (let key in this.params) {
        if (key!== "remark" && this.params[key] === "") {
          this.$Notif({
            title: "提示",
            message: "请完整填写",
            type: "warning"
          });
          return;
        }
      }
      this.params.time = this.$GetApiTime(this.params.time);
      let data = {
        method: str,
        params: this.params
      };
      All.postAPI(data).then(res => {
        if (res == 1) {
          this.$parent.showCreate = false
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>