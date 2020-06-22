<template>
  <div id="SelectForm">
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ERP'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 销售渠道 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
      </el-form-item>
      <!-- 销售区域 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion" firstOption="四川省"></selectComponent>
      </el-form-item>
      <!-- 客户类型 -->
      <el-form-item v-show="isSelect && isSelect === selectArr[2].code">
        <cascaderComponent v-model="selected.customerType" :props="lazy(All.codeCustomerType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 供应商类型 -->
      <el-form-item v-show="isSelect && isSelect === selectArr[3].code">
        <cascaderComponent v-model="selected.supplierType" :props="lazy(All.codeSupplierType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 采购渠道 -->
      <el-form-item v-show="isSelect && isSelect === selectArr[4].code">
        <cascaderComponent v-model="selected.purchaseChannel" :props="lazy(All.codePurchaseChannel())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 部门 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[5].code">
        <selectComponent v-model="selected.dept" :options="selectOptions.dept"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ERPtype'">
      <el-form-item label="按" v-if="isSelect">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect" v-if="isSelect"></selectComponent>
      </el-form-item>
      <!-- 销售渠道 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
      </el-form-item>
      <!-- 品种 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 利润等级 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[2].code">
        <selectComponent v-model="selected.profitLevel" :options="selectOptions.profitLevel"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ERPdebt'">
      <el-form-item label="按" v-if="isSelect">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect" v-if="isSelect"></selectComponent>
      </el-form-item>
      <!-- 部门 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.dept" :options="selectOptions.dept"></selectComponent>
      </el-form-item>
      <!-- 人员 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <selectComponent v-model="selected.erpZhiyzl" :options="selectOptions.erpZhiyzl"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ECS'">
      <el-form-item label="按" v-if="isSelect">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect" v-if="isSelect"></selectComponent>
      </el-form-item>
      <!-- 电商销售区域 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.ecsRegion" :props="lazy(All.codeEcsRegion())" multiple :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 会员等级 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <selectComponent v-model="selected.ecsUserRank" :options="selectOptions.ecsUserRank"></selectComponent>
      </el-form-item>
      <!-- 部门 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[2].code">
        <selectComponent v-model="selected.ecsDept" :options="selectOptions.ecsDept"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ECSCategory'">
      <el-form-item label="按" v-if="isSelect">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect" v-if="isSelect"></selectComponent>
      </el-form-item>
      <!-- 品种 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.ecsCategory" :props="lazy(All.codeEcsCategory())" multiple :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'ECSPayment'">
      <el-form-item label="按" v-if="isSelect">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect" v-if="isSelect"></selectComponent>
      </el-form-item>
      <!-- 支付类型 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.ecsPayment" :options="selectOptions.ecsPayment"></selectComponent>
      </el-form-item>
      <!-- 电商销售区域 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <cascaderComponent v-model="selected.ecsRegion" :props="lazy(All.codeEcsRegion())" multiple :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO0'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 销售渠道 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
      </el-form-item>
      <!-- 销售区域 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion" firstOption="四川省"></selectComponent>
      </el-form-item>
      <!-- 客户类型 -->
      <el-form-item v-show="isSelect && isSelect === selectArr[2].code">
        <cascaderComponent v-model="selected.customerType" :props="lazy(All.codeCustomerType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 采购渠道 -->
      <!-- <el-form-item v-show="isSelect && isSelect === selectArr[3].code">
        <cascaderComponent v-model="selected.purchaseChannel" :props="lazy(All.codePurchaseChannel())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item> -->
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO1'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 销售渠道 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <selectComponent v-model="selected.saleChannel" :options="selectOptions.saleChannel"></selectComponent>
      </el-form-item>
      <!-- 品种 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 利润等级 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[2].code">
        <selectComponent v-model="selected.profitLevel" :options="selectOptions.profitLevel"></selectComponent>
      </el-form-item>
      <!-- OTC类型 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[3].code">
        <selectComponent v-model="selected.medicineOtcType" :options="selectOptions.medicineOtcType"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO2'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 供应商类型 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.supplierType" :props="lazy(All.codeSupplierType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
      <!-- 销售区域 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[1].code">
        <selectComponent v-model="selected.erpRegion" :options="selectOptions.erpRegion" firstOption="四川省"></selectComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO3'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 品种 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO4'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 采购渠道 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.purchaseChannel" :props="lazy(All.codePurchaseChannel())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'CFO5'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <!-- 品种 -->
      <el-form-item v-if="isSelect && isSelect === selectArr[0].code">
        <cascaderComponent v-model="selected.medicineType" :props="lazy(All.codeMedicineType())" :otherProps="{checkStrictly : true}"></cascaderComponent>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-if="defaulted.fromWhere === 'GSP7'">
      <el-form-item label="按">
        <selectComponent v-model="isSelect" :options="selectArr" @change="changeSelect"></selectComponent>
      </el-form-item>
      <el-form-item v-if="isSelect === selectArr[0].code">
        <el-select v-model="selected.wldwId" filterable remote placeholder="请输入往来单位" :remote-method="remoteMethod" :loading="selectLoading">
          <el-option v-for="item in selectOptions.wldwId" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isSelect === selectArr[1].code">
        <selectComponent v-model="selected.reason" :options="selectOptions.reason" propLebel="label" propValue="value"></selectComponent>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapSelect } from "@/utils/index";
import selectComponent from "@c/SelectComponent.vue";
import cascaderComponent from "@c/CascaderComponent.vue";
import All from "@api/all";
export default {
  components: {
    selectComponent,
    cascaderComponent
  },
  props: {
    defaultIsSelect: {
      type: Object,
      default: () => ({})
    },
    index: Number
  },
  data() {
    return {
      All: All,
      selectLoading: false,
      isSelect: "",
      mapSelect: mapSelect,
      ERPIndex: [
        "saleChannel",
        "erpRegion",
        "customerType",
        "supplierType",
        "purchaseChannel",
        "dept"
      ],
      ERPtypeIndex: ["saleChannel", "medicineType", "profitLevel"],
      ERPdebtIndex: ["dept", "erpZhiyzl"],
      ECSIndex: ["ecsRegion", "ecsUserRank", "ecsDept"],
      ECSCategoryIndex: ["ecsCategory"],
      ECSPaymentIndex: ["ecsPayment", "ecsRegion"],
      CFO0Index: [
        "saleChannel",
        "erpRegion",
        "customerType",
        "purchaseChannel"
      ],
      CFO1Index: ["saleChannel", "medicineType", "profitLevel", "medicineOtcType"],
      CFO2Index: ["supplierType", "erpRegion"],
      CFO3Index: ["medicineType"],
      CFO4Index: ["purchaseChannel"],
      CFO5Index: ["medicineType"],
      GSP7Index: ["wldwId", "reason"],
      selectOptions: {
        saleChannel: [],
        dept: [],
        ecsUserRank: [], // 会员等级
        ecsDept: [], // (电商)部门
        ecsPayment: [],
        erpRegion: [], // ERP区域
        profitLevel: [], // ERP利润等级
        medicineOtcType: [], // otc类型
        erpZhiyzl: [], // 人员
        wldwId: [],
        reason: [],
      },
      selected: {
        saleChannel: -1,
        dept: -1,
        profitLevel: -1,
        medicineOtcType: -1,
        ecsUserRank: -1,
        ecsDept: -1,
        ecsPayment: -1,
        erpZhiyzl: -1,
        erpRegion: -1,
        wldwId: -1,
        reason: -1,
        ecsRegion: [-1],
        customerType: [-1],
        supplierType: [-1],
        purchaseChannel: [-1],
        medicineType: [-1],
        ecsCategory: [-1]
      },
      hasSelect: []
    };
  },

  computed: {
    selectArr() {
      return this.$store.state.defaulted.selectArr;
    },
    defaulted() {
      return this.$store.state.defaulted;
    }
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        this.getSelected();
      },
      deep: true
    },
    isSelect() {
      this.getSelected();
    }
  },
  mounted() {
    this.isSelect = this.defaultIsSelect.code;
    this.$parent.hasSelect[this.index] = this.isSelect;
    this.getSelected();
    if (this.selectArr.length) {
      if (this.defaulted.fromWhere === "ERP") {
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeErpRegion());
        this.getSelectOptions(All.codeDept());
      } else if (this.defaulted.fromWhere === "ERPtype") {
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeProfitLevel());
      } else if (this.defaulted.fromWhere === "ERPdebt") {
        this.getSelectOptions(All.codeDept());
        this.getSelectOptions(All.codeErpZhiyzl());
      } else if (this.defaulted.fromWhere === "ECS") {
        this.getSelectOptions(All.codeEcsUserRank());
        this.getSelectOptions(All.codeEcsDept());
      } else if (this.defaulted.fromWhere === "ECSPayment") {
        this.getSelectOptions(All.codeEcsPayment());
      } else if (this.defaulted.fromWhere === "CFO0") {
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeErpRegion());
      } else if (this.defaulted.fromWhere === "CFO1") {
        this.getSelectOptions(All.codeAaleChannel());
        this.getSelectOptions(All.codeProfitLevel());
        this.getSelectOptions(All.codeMedicineOtcType());
      } else if (this.defaulted.fromWhere === "CFO2") {
        this.getSelectOptions(All.codeErpRegion());
      } else if (this.defaulted.fromWhere === "GSP7") {
        let wldwIdOption = this.$GetStorage("type3Code");
        let reasonOption = this.$GetStorage("gspPageCode7");
        if (wldwIdOption) {
          this.selectOptions.wldwId = wldwIdOption;
        } else {
          this.getSelectOptions(All.gspCode3(), 3);
        }
        if (reasonOption) {
          this.selectOptions.reason = reasonOption;
        } else {
          this.getSelectOptions(All.gspCode6());
        }
      }
      // console.log(this.selectOptions)
      this.$store.commit("setSelectOptions", this.selectOptions);
    }
  },
  methods: {
    getSelected() {
      let index;
      if (this.defaulted.fromWhere === "ERP") {
        index = this.ERPIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "ERPtype") {
        index = this.ERPtypeIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "ERPdebt") {
        index = this.ERPdebtIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "ECS") {
        index = this.ECSIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "ECSCategory") {
        index = this.ECSCategoryIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "ECSPayment") {
        index = this.ECSPaymentIndex.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO0") {
        index = this.CFO0Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO1") {
        index = this.CFO1Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO2") {
        index = this.CFO2Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO3") {
        index = this.CFO3Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO4") {
        index = this.CFO4Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "CFO5") {
        index = this.CFO5Index.indexOf(this.isSelect) + 1;
      } else if (this.defaulted.fromWhere === "GSP7") {
        index = this.GSP7Index.indexOf(this.isSelect) + 1;
      }
      this.$parent.dimensionOrder[this.index] = index;
      this.$parent.selectedArr[this.index] = {};
      this.$parent.selectedArr[this.index]["i" + index] = this.selected[
        this.isSelect
      ];
    },
    getSelectOptions(str, type = null) {
      let str1 = All.gspCode3();
      let str2 = All.gspCode6();
      let arr = str.split(".");
      let name = arr[arr.length - 1];
      if (str !== str1 && str !== str2) {
        this.selectOptions[name] = [{ name: "全部", code: -1 }];
      }
      let data;
      if (type) {
        data = {
          method: str,
          params: {
            type: type
          }
        };
      } else {
        data = {
          method: str
        };
      }
      All.postAPI(data).then(res => {
        if (str === str1) {
          this.selectOptions.wldwId = res;
          this.selectOptions.wldwId.unshift({
            label: "全部",
            value: -1
          });
          this.$SetStorage("type3Code", this.selectOptions.wldwId);
        } else if (str === str2) {
          this.selectOptions.reason = res;
          this.selectOptions.reason.unshift({
            label: "全部",
            value: -1
          });
          this.$SetStorage("gspPageCode7", this.selectOptions.reason);
        } else {
          this.selectOptions[name].push(...res);
        }
      });
    },
    lazy(str) {
      return {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            if (level == 0) {
              let nodes = [{ value: -1, label: "全部", leaf: true }];
              All.postAPI({
                method: str,
                params:
                  str === "basic.code.ecsRegion" ||
                  str === "basic.code.erpRegion"
                    ? { code: 1 }
                    : { code: 0 }
              }).then(res => {
                if (str === "basic.code.ecsRegion") {
                  let len = res.length;
                  for (let i = 0; i < len; i++) {
                    if (res[i].name === "四川") {
                      let op = res[i];
                      res.splice(i, 1);
                      res.splice(0, 0, op);
                      break;
                    }
                  }
                }
                let arr = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.push(...arr);
                resolve(nodes);
              });
            } else {
              let nodes = [{ value: -1, label: "全部", leaf: true }];
              All.postAPI({
                method: str,
                params: { code: node.value }
              }).then(res => {
                let nodes = [];
                if (res.length) {
                  nodes = [{ value: -1, label: "全部", leaf: true }];
                }
                let arr = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: level >= 1 && value.code == 0
                }));
                nodes.push(...arr);
                resolve(nodes);
              });
            }
          }, 1000);
        }
      };
    },
    changeSelect(e) {
      this.$parent.hasSelect[this.index] = e;
      this.$parent.selected = {};
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
            this.selectOptions.wldwId = res;
            this.selectOptions.wldwId.unshift({
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
#SelectForm {
  #Select {
    width: 150px;
    float: left;
  }
  .el-cascader {
    margin-right: 10px;
  }
  .mg-left10 {
    margin-left: 10px;
  }
}
</style>


