<template>
  <div>
    <el-row class="main-body">
      <el-table
        @sort-change="sortChange"
        @selection-change="selectionChange"
        :border="border"
        :show-summary="showSummary"
        header-row-class-name="thead"
        :max-height="height"
        :data="listData"
        :header-cell-style="headClass"
        :cell-style="bodyclass"
        :span-method="objectSpanMethod"
        stripe
        element-loading-text="加载中..."
        :row-key="rowKey"
      >
        <template v-for="(item, index) in headData">
          <el-table-column
            show-overflow-tooltip
            style="position: relative;"
            :sortable="item.sortable === true ? true : item.sortable ? 'custom' : false"
            :prop="typeof item.sortable === 'string' && item.sortable ? item.sortable : ''"
            :key="item.text"
            :align="alignFn(item)"
            :min-width="item.minWidth"
            :width="item.width"
            :sort-by="sortMethod"
            :fixed="fixed(item)"
          >
            <template slot="header" slot-scope="scope">
              <span v-if="false">{{scope.$index}}</span>
              <template v-if="item.cascader">
                <span v-show="!item.cascader.isShowInput" @click.stop="headerClick(index)">
                  {{item.text}}
                  <svg style="width: 12px; height: 12px;" aria-hidden="true">
                    <use xlink:href="#icon-shaixuan" />
                  </svg>
                </span>
                <div v-show="item.cascader.isShowInput" style="height: auto;">
                  <el-cascader @visible-change="visibleChange($event, index)" clearable filterable style="position: absolute; height: 100%; z-index: 50000; top: 0px; left: -10px;" filterablev-model="value" :options="item.cascader.options" @change="item.cascader.changeFun" @expand-change="item.cascader.changeFun"></el-cascader>
                </div>
              </template>
              <template v-else>
                <span>{{item.text}}</span>
              </template>
            </template>
            <template slot-scope="scope">
              <template v-if="item.link">
                <el-link @click.native.stop="link(scope.row,item)">{{getField(scope.row, item)}}</el-link>
              </template>
              <template v-else>
                <span v-if="item.field === 'index' && from !== 'tmsChartBox'">{{scope.$index + 1}}</span>
                <span v-else :class="{'index-css': item.text === '排名','index1': item.text === '排名' && scope.row[item.field] == 1,'index2': item.text === '排名' && scope.row[item.field] == 2,'index3': item.text === '排名' && scope.row[item.field] == 3}">{{getField(scope.row, item)}}</span>
                <!-- <el-tooltip effect="dark" content="item.tips" placement="top-start" v-if="item.text==='日期'">
                  <i class="el-icon-info tips"></i>
                </el-tooltip>-->
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="page-num" v-if="showPage">
        <el-form :inline="true" class="pagination-text">
          <el-form-item label>
            共
            <span class="total">{{$parent.total}}</span> 条，每页显示
            <el-select placeholder v-model="$parent.pageSize" class="w65" @change="$parent.pageNum = 1;$parent.getTable()">
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>条
          </el-form-item>
        </el-form>
        <el-pagination class="pagination" :current-page.sync="$parent.pageNum" background @current-change="$parent.getTable()" :page-size="parseInt($parent.pageSize)" layout="prev, pager, next, jumper" :total="$parent.total"></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    headTable: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    },
    showPage: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: "100%"
    },
    border: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ""
    },
    rowKey: {
      type: String,
      default: "code"
    },
    autoSort: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectNumber: 0,
      presentHeight: 0,
      isShowcascader: false,
      top: 0,
      left: 0,
      headData: [],
      listData: []
    };
  },
  watch: {
    headTable: {
      handler(newVal, oldVal) {
        this.headData = newVal;
      },
      deep: true,
      immediate: true
    },
    dataList: {
      handler(newVal, oldVal) {
        this.listData = newVal;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sortMethod(row, index) {
      // console.log(row, index)
    },
    headClass() {
      return "background:rgb(249,249,249);font-weight: normal;color: #666";
    },
    bodyclass() {
      return "color: rgba(0,0,0,0.65)";
    },
    alignFn(item) {
      // console.log(item);
      if (
        item.text.indexOf("元") !== -1 ||
        item.text.indexOf("数量") !== -1 ||
        item.text.indexOf("会员数") !== -1 ||
        item.text.indexOf("家数") !== -1 ||
        item.text.indexOf("件装量") !== -1 ||
        item.text.indexOf("条目数") !== -1 ||
        item.text.indexOf("率") !== -1 ||
        item.text.indexOf("箱数") !== -1 ||
        item.text.indexOf("整件") !== -1 ||
        item.text.indexOf("散件") !== -1 ||
        item.text.indexOf("价") !== -1 ||
        item.text.indexOf("销售额") !== -1 ||
        item.text.indexOf("占比") !== -1 ||
        item.text.indexOf("金额") !== -1 ||
        item.text.indexOf("次数") !== -1 ||
        item.text === "件数" ||
        item.text === "客户数" ||
        item.text === "品种数" ||
        item.text === "配送量" ||
        item.field === "breed" ||
        item.field === "frequency" ||
        item.field === "recallAvgDuration"
      ) {
        return "right";
      } else if (
        item.field === "no" ||
        item.field === "index" ||
        item.field === "name" ||
        (item.text === "仓库" && item.field === "name") ||
        item.text === "排名" ||
        item.text === "网点" ||
        item.text === "合纵货物数" ||
        item.text === "出库时效" ||
        item.field === "stockTime" ||
        item.text.indexOf("-") !== -1 ||
        item.field === "合计"
      ) {
        return "center";
      } else {
        return "left";
      }
    },
    getField(row, item) {
      let field = item.field;
      // if (
      //   item.field === "roughProfit" ||
      //   item.field === "roughProfitProportion" ||
      //   item.field === "roughProfitRate" ||
      //   item.field === "noTaxSaleDiscount" ||
      //   item.field === "pureIncome" ||
      //   item.field === "pureIncomeProportion" ||
      //   item.field === "noTaxPurchaseBenefit" ||
      //   item.field === "pureCost" ||
      //   item.field === "purePurchaseAmount" ||
      //   item.field === "taxPurchaseBenefit" ||
      //   item.field === "noTaxCost" ||
      //   item.field === "pureBalanceAmount"
      // ) {
      //   return "";
      // }
      if (
        item.text.indexOf("率") !== -1 ||
        (item.text.indexOf("占比") !== -1 && item.text.indexOf("效率") === -1)
      ) {
        if (field === "damageRate") {
          return row[field] + "‱";
        } else if (this.from === "CFO") {
          return (row[field] * 100).toFixed(2) + "%";
        } else {
          return row[field] + "%";
        }
      }
      if (typeof row[field] === "number") {
        if (item.text === "日期" || item.text === "时间") {
          return this.$ToTime(row[field]);
        } else if (
          item.text === "排名" ||
          item.text === "序号" ||
          item.text.indexOf("类型") !== -1 ||
          item.text.indexOf("-") !== -1 ||
          item.text.indexOf("条目") !== -1 ||
          item.text.indexOf("数") !== -1 ||
          item.text === "配送量" ||
          item.field === "amount" ||
          item.field === "stockTime" ||
          item.field === "合计" ||
          item.text === "频次" ||
          item.field === "breed"
        ) {
          let num = this.$ToThousands(row[field]);
          return num.toString().replace(".00", "");
        } else {
          return this.$ToThousands(row[field]);
        }
      }
      if (typeof field == "function") {
        return field(row);
      }
      return row[field];
    },
    selectionChange(select) {
      this.$parent.selectChange(select);
      this.selectNumber = select.length;
    },
    sortChange(sort) {
      if (this.autoSort) {
        console.log(sort);
        //获取字段名称和排序类型
        var fieldName = sort.prop;
        var sortingType = sort.order;

        let firstItem = this.listData.shift(); // 合计放第一行，不参与排序

        if (sortingType == "descending") {
          this.listData = this.listData.sort(
            (a, b) => b[fieldName] - a[fieldName]
          );
        } else {
          this.listData = this.listData.sort(
            (a, b) => a[fieldName] - b[fieldName]
          );
        }

        this.listData.unshift(firstItem);
      } else {
        console.log(sort);
        this.$parent.sortableChange(sort);
      }
    },
    headerClick(index) {
      if (this.headTable[index].cascader) {
        this.$set(this.$parent.headTable[index].cascader, "isShowInput", true);
      }
    },
    visibleChange(state, index) {
      if (this.headTable[index].cascader) {
        this.$set(this.$parent.headTable[index].cascader, "isShowInput", state);
      }
    },
    fixed(item) {
      return (
        (this.from !== "tmsChartBox" &&
          this.from !== "gspDetail" &&
          (item.text === "网点" ||
            item.text === "合纵货物数" ||
            item.text === "合计" ||
            item.text === "司机" ||
            item.text === "备货员" ||
            item.text === "装卸员" ||
            item.text === "指标" ||
            item.text === "客户编号" ||
            item.text === "客户名称" ||
            item.text === "客户大类" ||
            item.text === "客户小类" ||
            item.text === "客户地区" ||
            item.text === "品种编号" ||
            item.text === "品种名称" ||
            item.text === "品种规格" ||
            item.text === "单位" ||
            item.text === "生产厂家" ||
            item.text === "供应商编号" ||
            item.text === "供应商名称")) ||
        (this.from === "CFO" && item.text === "日期")
      );
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.from === "TMS2") {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    link(row, item) {
      let selected = this.$parent.selected;
      if ("date" in row) {
        selected.date = row.date;
      }
      if ("time" in row) {
        selected.date = row.time;
      }
      let str = this.$route.fullPath.replace("mars-admin/", "");
      if (this.from === "ECS") {
        if ("firstType" in row) {
          selected.ecsCategory = [+row.firstType];
        }
        if ("secondType" in row) {
          selected.ecsCategory = [+row.firstType, +row.secondType];
        }
      } else if (this.from === "ERP") {
        if ("provinceName" in row) {
          selected.erpRegion = +row.province;
        }
        if ("primaryCategoryCode" in row) {
          selected.medicineType = [+row.primaryCategoryCode];
        }
        if ("subCategoryCode" in row) {
          selected.medicineType = [
            +row.primaryCategoryCode,
            +row.subCategoryCode
          ];
        }
        if ("profitLevelCode" in row) {
          selected.profitLevel = +row.profitLevelCode;
        }
        if ("saleChannel" in row) {
          selected.saleChannel = +row.saleChannelCode || +row.saleChannel;
        }
        if ("primaryCustomerTypeCode" in row) {
          selected.customerType = [+row.primaryCustomerTypeCode];
        }
        if ("subCustomerTypeCode" in row) {
          selected.customerType = [
            +row.primaryCustomerTypeCode,
            +row.subCustomerTypeCode
          ];
        }
        if ("primarySupplierTypeCode" in row) {
          selected.supplierType = [+row.primarySupplierTypeCode];
        }
        if ("subSupplierTypeCode" in row) {
          selected.supplierType = [
            +row.primarySupplierTypeCode,
            +row.subSupplierTypeCode
          ];
        }
        if ("primaryPurchaseChannelCode" in row) {
          selected.purchaseChannel = [+row.primaryPurchaseChannelCode];
        }
        if ("subPurchaseChannelCode" in row) {
          selected.purchaseChannel = [
            +row.primaryPurchaseChannelCode,
            +row.subPurchaseChannelCode
          ];
        }
        if ("bmId" in row) {
          selected.dept = row.bmId;
        }
      } else if (this.from === "GSP") {
        let lock = false;
        let arr = Object.keys(row);
        for (let item in arr) {
          let key = arr[item];
          if (row[key] === "合计") {
            lock = true;
            break;
          }
        }
        selected = {};
        if (!lock) {
          if ("date" in row) {
            // 第一层不含“date”，这是第二层
            selected.date = row.date;
            if ("jusyy" in row) {
              selected.selectValue = +row.code.split("-")[0];
            } else if ("wldwName" in row) {
              selected.keyWord = row.code.split("-")[0];
            } else if ("warehouseName" in row) {
              selected.selectValue1 = +row.code.split("-")[0];
              if (this.$parent.nowPageNum === 3) {
                selected.selectValue1 = +row.code.split("-")[0];
              } else if (this.$parent.nowPageNum === 5) {
                selected.selectValue = row.code.split("-")[0];
              }
            } else if ("reasonName" in row) {
              selected.selectValue = +row.code.split("-")[0];
            } else if ("substandardReason" in row) {
              selected.selectValue = +row.code.split("-")[0];
            }
          } else {
            // 第一层
            if ("time" in row) {
              selected.date = row.time;
            } else {
              selected.date = this.$parent.fromDate;
            }
            if ("wldw" in row) {
              selected.keyWord = row.wldw;
            } else if ("spName" in row) {
              selected.keyWord = row.spName;
            } else if ("jusyy" in row) {
              selected.selectValue = +row.jusyyId;
            } else if ("wldwName" in row) {
              if (this.$parent.nowPageNum === 3) {
                selected.keyWord = row.wldwName;
              } else if (this.$parent.nowPageNum === 7) {
                selected.selectValue2 = row.wldwId;
              }
            } else if ("warehouseName" in row) {
              if (this.$parent.nowPageNum === 3) {
                selected.selectValue1 = +row.warehouseId;
              } else if (this.$parent.nowPageNum === 5) {
                selected.selectValue = row.warehouseId;
              }
            } else if ("reasonName" in row) {
              selected.selectValue = +row.reasonId;
            } else if ("substandardReason" in row) {
              selected.selectValue = +row.substandardReasonId;
            } else if ("abortReasonId" in row) {
              selected.selectValue = +row.abortReasonId;
            }
          }
        }
      }
      console.log(selected);
      if (str === "/ECS/chartDetail?sale=3") {
        window.parent.postMessage({ url: "/ecs/salectgyDetail" }, "*");
        this.$SetStorage("/ECS/detail3", selected);
      } else if (str === "/ERP/chartDetail?analysis=3") {
        window.parent.postMessage({ url: "/sale/customerDetail" }, "*");
        this.$SetStorage("/ERP/detail3", selected);
      } else if (str === "/ERP/chartDetail?analysis=4") {
        window.parent.postMessage({ url: "/sale/categoryDetail" }, "*");
        this.$SetStorage("/ERP/detail4", selected);
      } else if (str === "/ERP/chartDetail?analysis=3&hide=true") {
        window.parent.postMessage({ url: "/sale/customerDetail1" }, "*");
        this.$SetStorage("/ERP/detail3?hide=true", selected);
      } else if (str === "/ERP/chartDetail?analysis=4&hide=true") {
        window.parent.postMessage({ url: "/sale/categoryDetail1" }, "*");
        this.$SetStorage("/ERP/detail4?hide=true", selected);
      } else if (str === "/GSP/chartDetail?analysis=1") {
        window.parent.postMessage({ url: "/gsp/rejectionDetail" }, "*");
        this.$SetStorage("/GSP/detail1", selected);
      } else if (str === "/GSP/chartDetail?analysis=3") {
        window.parent.postMessage({ url: "/gsp/saleReturnsDetail" }, "*");
        this.$SetStorage("/GSP/detail3", selected);
      } else if (str === "/GSP/chartDetail?analysis=5") {
        window.parent.postMessage({ url: "/gsp/returnsDirectionDetail" }, "*");
        this.$SetStorage("/GSP/detail5", selected);
      } else if (str === "/GSP/chartDetail?analysis=6") {
        window.parent.postMessage({ url: "/gsp/unqualifiedDetail" }, "*");
        this.$SetStorage("/GSP/detail6", selected);
      } else if (str === "/GSP/chartDetail?analysis=7") {
        window.parent.postMessage({ url: "/gsp/cancelDetail" }, "*");
        this.$SetStorage("/GSP/detail7", selected);
      } else if (str === "/GSP/chartDetail?analysis=8") {
        window.parent.postMessage({ url: "/gsp/qualityDetail" }, "*");
        this.$SetStorage("/GSP/detail8", selected);
      }
      // this.$store.commit("setSelected", selected);
      // this.$router.push({
      //   path: item.link
      // });
    }
  }
};
</script>
<style lang="scss">
.page-num {
  margin-top: 20px;
  overflow: hidden;
}
.pagination-text {
  float: left;
}
.pagination {
  float: right;
}
.cascader {
  position: absolute;
  z-index: 200;
  background-color: #fff;
  height: 220px;
}
// .total {
// color: $primary;
// }
// .el-table {
//   .cell {
//     overflow: hidden !important;
//   }
// }
// .el-table {
//   th {
//     div {
//       overflow: hidden !important;
//       padding-right: 0;
//     }
//   }
// }
// .tips_1 {
//   display: inline-block;
//   font-weight: bold;
//   height: 20px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
</style>
