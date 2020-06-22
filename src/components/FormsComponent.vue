<template>
  <div>
    <div class="main-body" @scroll="scrollX()">
      <div class="table-box" :style="{width: theadWidth ? theadWidth + 17 + 'px' : '100%'}">
        <div class="table-head">
          <table>
            <thead>
              <tr>
                <th v-for="el in headData" :key="el" :class="[sortName===el.field ? sortType : '',{'iscursor': 'sortable' in el}]" @click="sortFn(el)">
                  {{el.text}}
                  <span class="caret-wrapper">
                    <i class="sort-caret ascending" @click.stop="sortFn(el, 'ascending', true)"></i>
                    <i class="sort-caret descending" @click.stop="sortFn(el, 'descending', true)"></i>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body" @scroll="scrollEvent($event)" id="tbody">
          <table>
            <tbody ref="tbody" v-loading="loading">
              <tr v-for="item in tableData" :key="item">
                <td v-show="isShow(item, el)" v-for="el in headData" :key="el" :rowspan="getRowspan(item, el)" :colspan="getColspan(item, el)"
                :style="'text-align:' + isAlign(el)">
                  <span>
                    <el-tooltip class="item" effect="dark" :content="getField(item, el)" placement="top-start">
                      <a class="link" @click="link(item,el)">{{getField(item, el)}}</a>
                    </el-tooltip>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="listData.length === 0" class="empty-text">暂无数据</div>
      </div>
    </div>
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
    }
  },
  data() {
    return {
      headData: [],
      listData: [],
      tableData: [],
      sortType: "",
      sortName: "",
      theadWidth: null,
      dataLen: 0,
      lazyNum: 100,
      loading: false,
    };
  },
  watch: {
    headTable: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.headData = newVal;
        } else {
          this.headData = oldVal;
        }
      },
      deep: true
    },
    dataList: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.listData = newVal;
        } else {
          this.listData = oldVal;
        }
        this.dataLen = this.listData.length;
        if (this.dataLen > this.lazyNum) {
          this.tableData = this.listData.slice(0, this.lazyNum);
        } else {
          this.tableData = this.listData;
        }
        // this.deleteTd(this.tableData)
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.theadWidth = this.$refs.tbody.offsetWidth;
    window.onresize = () => {
      this.theadWidth = this.$refs.tbody.offsetWidth;
    }
    if (this.listData.length === 0) {
      this.theadWidth = 0;
    }
  },
  methods: {
    scrollEvent (e) {
      let num = this.tableData.length;
      if (num < this.dataLen) {
        let target = e.target;
        if (target.clientHeight > target.scrollHeight - target.scrollTop - 100) {
          this.tableData = this.tableData.concat(this.listData.slice(num, num + this.lazyNum))
        }
      }
    },
    scrollX () {
      if (this.theadWidth !== this.$refs.tbody.offsetWidth) {
        this.theadWidth = this.$refs.tbody.offsetWidth;
      }
    },
    isAlign(item) {
      let field = item.field;
      if (
        field === "date" ||
        field === "primaryCategoryType" ||
        field === "subCategoryType" ||
        field === "saleChannel" ||
        field === "profitLevel" ||
        field === "primarySupplierType" ||
        field === "subSupplierType" ||
        field === "provinceName" ||
        field === "primaryPurchaseChannel" ||
        field === "subPurchaseChannel" ||
        field === "primaryCustomerType" ||
        field === "subCustomerType" ||
        field === "otcType"
      ) {
        return "center";
      } else {
        return "right";
      }
    },
    getField(row, item) {
      let field = item.field;
      let data = row[field];
      // if (
      //   field === "roughProfit" ||
      //   field === "roughProfitProportion" ||
      //   field === "roughProfitRate" ||
      //   field === "noTaxSaleDiscount" ||
      //   field === "pureIncome" ||
      //   field === "pureIncomeProportion" ||
      //   field === "noTaxPurchaseBenefit" ||
      //   field === "pureCost" ||
      //   field === "purePurchaseAmount" ||
      //   field === "taxPurchaseBenefit" ||
      //   field === "noTaxCost"
      // ) {
      //   return "";
      // }
      if (item.text.indexOf("率") !== -1 || item.text.indexOf("占比") !== -1) {
        return (row[field] * 100).toFixed(2) + "%";
      }
      if (typeof row[field] === "number") {
        if (
          item.text.indexOf("数") !== -1
        ) {
          let num = this.$ToThousands(row[field]);
          return num.toString().replace(".00", "");
        } else {
          return this.$ToThousands(row[field]);
        }
      }
      return data;
    },
    sortFn(el, type = "", is = false) {
      if (!is) {
        if (this.sortType === "") {
          this.sortType = "ascending"
        } else if (this.sortType === "ascending") {
          this.sortType = "descending"
        } else if (this.sortType === "descending") {
          this.sortType = ""
        }
      } else {
        if (this.sortType === type) {
          this.sortType = ""
        } else {
          this.sortType = type
        }
      }
      this.sortName = el.field;
      let sort = {
        column: {},
        prop: this.sortName,
        order: this.sortType
      }
      this.$parent.sortableChange(sort);
    },
    sortChange(sort) {
      this.$parent.sortableChange(sort);
    },
    // deleteTd(data) {
    //   data.forEach((item, index) => {
    //     if ("colSpans" in item) {
    //       let arr = item.colSpans;
    //       arr.forEach(el => {
    //         let field = el.fieldName;
    //         let keyArr = Object.keys(item);
    //         keyArr.forEach(i => {
    //           if (i !== field && item[i] === "汇总") {
    //             item[i] = "null";
    //           }
    //         })
    //       })
    //     }
    //     if ("rowSpans" in item) {
    //       let arr = item.rowSpans;
    //       arr.forEach(el => {
    //         let field = el.fieldName;
    //         let num = el.number;
    //         for (let i = 1; i < num; i++) {
    //           data[index + i][field] = "null"
    //         }
    //       })
    //     }
    //   })
    //   this.tableData = data;
    // },
    isShow(row, item) {
      let field = item.field;
      if ("banedFields" in row) {
        let spans = row.banedFields;
        if (field in spans) {
          return false;
        }
      }
      return true;
    },
    getColspan(row, item) {
      let field = item.field;
      if ("colSpans" in row) {
        let spans = row.colSpans;
        if (field in spans) {
          return spans[field];
        }
      }
    },
    getRowspan(row, item) {
      let field = item.field;
      if ("rowSpans" in row) {
        let spans = row.rowSpans;
        if (field in spans) {
          return spans[field];
        }
      }
    },
    link(row, item) {
      let selected = this.$parent.selected;
      selected.companyRange = this.$parent.dataRange;
      let str = this.$route.fullPath.replace("mars-admin/", "");
      if ("date" in row) {
        selected.date = row.date;
      }
      if ("time" in row) {
        selected.date = row.time;
      }
      if ("provinceName" in row) {
        selected.erpRegion = +row.province;
      }
      if ("profitLevelCode" in row) {
        selected.profitLevel = +row.profitLevelCode;
      }
      if ("saleChannel" in row) {
        selected.saleChannel = +row.saleChannelCode || +row.saleChannel;
      }
      if ("primaryCategoryTypeCode" in row) {
        selected.medicineType = [+row.primaryCategoryTypeCode];
      }
      if ("subCategoryType" in row) {
        selected.medicineType = [
          +row.primaryCategoryTypeCode,
          +row.subCategoryTypeCode
        ];
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
      if ("primaryPurchaseChannelCode" in row) {
        selected.purchaseChannel = [+row.primaryPurchaseChannelCode];
      }
      if ("subPurchaseChannelCode" in row) {
        selected.purchaseChannel = [
          +row.primaryPurchaseChannelCode,
          +row.subPurchaseChannelCode
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
      if ("otcTypeCode" in row) {
        selected.medicineOtcType = +row.otcTypeCode;
      }
      selected.timeDimension = this.$parent.timeDimension;
      if (this.$route.path === "/finance/forms0") {
        window.parent.postMessage({ url: "/finance/customerSaleDetail" }, "*");
        this.$SetStorage("/finance/detail0", selected);
      } else if (this.$route.path === "/finance/forms1") {
        window.parent.postMessage({ url: "/finance/categorySaleDetail" }, "*");
        this.$SetStorage("/finance/detail1", selected);
      } else if (this.$route.path === "/finance/forms2") {
        window.parent.postMessage({ url: "/finance/supplierPurchaseDetail" }, "*");
        this.$SetStorage("/finance/detail2", selected);
      } else if (this.$route.path === "/finance/forms3") {
        window.parent.postMessage({ url: "/finance/categoryPurchaseDetail" }, "*");
        this.$SetStorage("/finance/detail3", selected);
      } else if (this.$route.path === "/finance/forms4") {
        window.parent.postMessage({ url: "/finance/channelPurchaseDetail" }, "*");
        this.$SetStorage("/finance/detail4", selected);
      } else if (this.$route.path === "/finance/forms5") {
        window.parent.postMessage({ url: "/finance/stockDetail" }, "*");
        this.$SetStorage("/finance/detail5", selected);
      }
    }
  }
};
</script>
<style lang="scss">
.all-css {
  background: #eee;
}
.link {
  cursor: pointer;
  &:hover {
    color: $hover;
    text-decoration: underline;
  }
}

.iscursor {
  cursor: pointer;
}
.main-body {
  overflow-x: auto;
}
.table-box {
  border: 1px solid #ebeef5;
  .table-head {
    width: 98.7%;
  }
  .table-body {
    max-height: 560px;
    overflow-y: scroll;
    overflow-x: hidden;
    table {
      tr:last-child {
        border-bottom: 0px;
      }
    }
  }
}
.table-box table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
  th, td {
    width: 150px;
    padding: 12px 0;
    border-right: 1px solid #ebeef5;
    span {
      padding: 0 10px;
    }
  }
  th {
    font-weight: normal;
    background: rgb(249, 249, 249);
  }
  td {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  tr {
    border-bottom: 1px solid #ebeef5;
  }
  
  tr:nth-child(even) {
    background: rgb(250, 250, 250);
  }
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
  .sort-caret.ascending {
    border-bottom-color: #c0c4cc;
    top: 5px;
  }
  .sort-caret.descending {
    border-top-color: #c0c4cc;
    bottom: 7px;
  }
  .ascending .sort-caret.ascending {
    border-bottom-color: #409eff;
  }
  .descending .sort-caret.descending {
    border-top-color: #409eff;
  }
  
}
.empty-text {
  font-size: 14px;
  width: 100%;
  color: #909399;
  line-height: 60px;
  text-align: center;
}
</style>
