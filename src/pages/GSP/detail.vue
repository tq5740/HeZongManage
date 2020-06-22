<template>
  <div id="ChartDetail">
    <div class="btn">
      <p class="title" v-show="!showHeader">筛选条件</p>
      <!-- <el-button @click="downLoad" type="primary" size="mini" icon="el-icon-download" plain>下载</el-button> -->
      <el-button @click="showHeader = !showHeader" type="primary" size="mini" :icon="showHeader ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" plain>{{showHeader ? "收起" : "展开"}}</el-button>
    </div>
    <el-collapse-transition>
      <div class="header" v-show="showHeader">
        <el-form :inline="true">
          <el-form-item label="选择时间 :">
            <datePickerComponent v-model="fromDate"></datePickerComponent>
          </el-form-item>
          <el-form-item :label="selectName + ' :'" v-if="nowPageNum === 1 || nowPageNum === 3 || nowPageNum === 5 || nowPageNum === 6 || nowPageNum === 7">
            <selectComponent v-model="selectValue" :options="selectOptions" filterable propLebel="label" propValue="value" width="160px"></selectComponent>
          </el-form-item>
          <el-form-item :label="selectName1 + ' :'" v-if="nowPageNum === 3">
            <selectComponent v-model="selectValue1" :options="selectOptions1" filterable propLebel="label" propValue="value" width="160px"></selectComponent>
          </el-form-item>
          <el-form-item label="往来单位 :" v-if="nowPageNum === 7">
            <el-select v-model="selectValue2" filterable remote placeholder="请输入往来单位" :remote-method="remoteMethod" :loading="selectLoading">
              <el-option v-for="item in selectOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="inputName + ' :'">
            <el-input v-model="searchWord" :placeholder="'请输入' + inputName" clearable style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="initData">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>
    <div class="main-box" v-loading="tableLoading">
      <el-form :inline="true" v-if="nowPageNum === 8">
        <el-form-item>
          <el-button type="primary" @click="createBtn">新增公告</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="importBtn">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="exportBtn">导出</el-button>
        </el-form-item>
      </el-form>
      <tableComponent :dataList="dataList" :headTable="headTable" border from="gspDetail"></tableComponent>
    </div>
    <el-dialog v-if="showCreate" :visible.sync="showCreate" :close-on-click-modal="false">
      <notice></notice>
    </el-dialog>
  </div>
</template>

<script>
import selectComponent from "@c/SelectComponent.vue";
import datePickerComponent from "@c/DatePickerComponent.vue";
import tableComponent from "@c/TableComponent.vue";
import cascaderComponent from "@c/CascaderComponent.vue";
import notice from "./dialog/notice.vue";
import { GSPcode } from "@utils/objArrData";
import { getStrCount, getMonthDays } from "@utils/index";
import All from "@api/all";

export default {
  components: {
    selectComponent,
    datePickerComponent,
    tableComponent,
    notice
  },
  data() {
    return {
      All: All,
      showHeader: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      eg: "",
      inputName: "",
      selectName: "",
      selectName1: "",
      selectValue: -1,
      selectValue1: -1,
      selectValue2: "",
      GSPcode: GSPcode(),
      fromDate: [],
      headTable: [],
      dataList: [],
      tableLoading: false,
      nowPageNum: null,
      selectOptions: [],
      selectOptions1: [],
      selectOptions2: [],
      searchWord: "",
      showCreate: false,
      getStorage: false,
      selectLoading: false,
      methodList: [
        {},
        { method: All.gspDetail1() },
        {},
        { method: All.gspDetail3() },
        {},
        { method: All.gspDetail5() },
        { method: All.gspDetail6() },
        { method: All.gspDetail7() },
        { method: All.gspDetail8() }
      ]
    };
  },
  computed: {
    defaulted() {
      return this.$store.state.defaulted;
    }
  },
  watch: {
    $route: {
      handler: "init",
      immediate: true
    }
  },
  mounted() {
    let _this = this;
    window.addEventListener(
      "message",
      function(e) {
        if (e.data && e.data.data === "refresh") {
          _this.getStorage = true;
          _this.init();
        }
      },
      false
    );
  },
  methods: {
    init() {
      this.initData();
      if (this.getStorage) {
        this.getFatherData();
      }
      this.getTable();
    },
    initData() {
      this.defaulted.time && this.defaulted.time.length
        ? (this.fromDate = this.defaulted.time)
        : (this.fromDate = this.$store.state.defaultTime1);
      this.pageSize = 10;
      this.pageNum = 1;
      this.searchWord = "";
      this.selectValue = -1;
      this.selectValue1 = -1;
      this.selectValue2 = -1;
      let str = this.$route.path;
      let num = str[str.length - 1];
      this.nowPageNum = +num;
      if (this.nowPageNum === 1) {
        this.selectName = "拒收原因";
        this.inputName = "药品名称/往来单位";
        let op = this.$GetStorage("gspPageCode1");
        if (op) {
          this.selectOptions = op;
        } else {
          this.getSelectOptions(All.gspCode1());
        }
      } else if (this.nowPageNum === 3) {
        this.selectName = "仓库";
        this.selectName1 = "退回原因";
        this.inputName = "药品名称/往来单位";
        let op = this.$GetStorage("type4Code");
        if (op) {
          this.selectOptions = op;
        } else {
          this.getSelectOptions(All.gspCode3(), 4);
        }
        let op1 = this.$GetStorage("type5Code");
        if (op1) {
          this.selectOptions1 = op1;
        } else {
          this.getSelectOptions(All.gspCode3(), 5);
        }
      } else if (this.nowPageNum === 5) {
        this.selectName = "移入仓库";
        let op = this.$GetStorage("gspPageCode5");
        if (op) {
          this.selectOptions = op;
        } else {
          this.getSelectOptions(All.gspCode7());
        }
        this.inputName = "生产厂家/药品名称";
      } else if (this.nowPageNum === 6) {
        this.selectName = "不合格原因";
        let op = this.$GetStorage("gspPageCode6");
        if (op) {
          this.selectOptions = op;
        } else {
          this.getSelectOptions(All.gspCode5());
        }
        this.inputName = "生产厂家/商品名称";
      } else if (this.nowPageNum === 7) {
        this.selectName = "退出原因";
        this.inputName = "生产厂家/药品名称";
        let op = this.$GetStorage("gspPageCode7");
        if (op) {
          this.selectOptions = op;
        } else {
          this.getSelectOptions(All.gspCode6());
        }
        let op1 = this.$GetStorage("type3Code");
        if (op1) {
          this.selectOptions2 = op1;
        } else {
          this.getSelectOptions(All.gspCode3(), 3);
        }
      } else if (
        this.nowPageNum === 8
      ) {
        this.inputName = "生产厂家/药品名称";
      }
    },
    getFatherData() {
      let str = this.$route.fullPath.replace("mars-admin/", "");
      let storage = this.$GetStorage(str);
      let date;
      if (storage) {
        let arr = Object.keys(storage);
        if (arr.length) {
          arr.forEach(i => {
            if (i === "keyWord") {
              this.searchWord = storage[i];
            } else if (i === "selectValue") {
              this.selectValue = storage[i];
            } else if (i === "selectValue1") {
              this.selectValue1 = storage[i];
            } else if (i === "selectValue2") {
              this.selectValue2 = storage[i];
              console.log(this.selectValue2)
            }
          });
        }
        date = storage.date;
      }
      if (typeof date === "string") {
        let dateNum = getStrCount(date, "-");
        let dateStart = "";
        let dateEnd = "";
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth() + 1;
        nowMonth.toString().length === 1
          ? (nowMonth = "0" + nowMonth)
          : nowMonth;
        let nowDay = now.getDate();
        if ((nowDay + "").length < 2) {
          nowDay = "0" + nowDay;
        }
        console.log(date)
        let arr = date.split("-");
        if (dateNum === 0) {
          dateStart = date + "/01/01";
          if (date == nowYear) {
            dateEnd = date + "/" + nowMonth + "/" + nowDay;
          } else {
            dateEnd = date + "/12/" + getMonthDays(date, 12);
          }
        } else if (dateNum === 1) {
          if (arr[0] == nowYear && arr[1] == nowMonth) {
            arr[2] = nowDay;
          } else {
            arr[2] = getMonthDays(arr[0], arr[1] - 1);
          }
          dateEnd = arr.join("/");
          arr[2] = "01";
          dateStart = arr.join("/");
        } else if (dateNum === 2) {
          dateStart = arr.join("/");
          dateEnd = arr.join("/");
        }
        this.fromDate = [dateStart + " 00:00:00", dateEnd + " 23:59:59"];
      } else {
        this.fromDate = date;
      }
    },
    getSelectOptions(str, type) {
      let data;
      if (this.nowPageNum === 3) {
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
      let resData = [];
      All.postAPI(data).then(res => {
        resData = res;
        resData.unshift({
          label: "全部",
          value: -1
        });
        if (this.nowPageNum === 1) {
          this.$SetStorage("gspPageCode1", resData);
        } else if (this.nowPageNum === 3) {
          if (type === 1) {
            this.$SetStorage("type1Code", resData);
          } else if (type === 2) {
            this.$SetStorage("type2Code", resData);
          } else if (type === 4) {
            this.$SetStorage("type4Code", resData);
          } else if (type === 5) {
            this.$SetStorage("type5Code", resData);
          }
        } else if (this.nowPageNum === 5) {
          this.$SetStorage("gspPageCode5", resData);
        } else if (this.nowPageNum === 6) {
          this.$SetStorage("gspPageCode6", resData);
        } else if (this.nowPageNum === 7) {
          if (str === All.gspCode6()) {
            this.$SetStorage("gspPageCode7", resData);
            this.selectOptions = resData;
          } else if (str === All.gspCode3()) {
            this.$SetStorage("type3Code", resData);
            this.selectOptions2 = resData;
          }
        }
        if (this.nowPageNum !== 7) {
          this.selectOptions = resData;
        }
      });
      return resData;
    },
    getTable() {
      this.tableLoading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDate: this.$GetApiTime(this.fromDate[0]),
        endDate: this.$GetApiTime(this.fromDate[1]),
        eg: this.eg,
        keyWord: this.searchWord
      };
      if (this.nowPageNum === 1) {
        params.rejectReason = this.selectValue;
      } else if (this.nowPageNum === 3) {
        params.warehouseId = this.selectValue1;
        params.reason = this.selectValue;
      } else if (this.nowPageNum === 5) {
        params.warehouseId = this.selectValue;
      } else if (this.nowPageNum === 6) {
        params.reason = this.selectValue;
      } else if (this.nowPageNum === 7) {
        params.reasonId = this.selectValue;
        params.wldwId = this.selectValue2;
      }
      All.postAPI({
        method: this.methodList[this.nowPageNum].method,
        params: params
      })
        .then(res => {
          this.total = res.total;
          let resList = res.list;
          if (resList.length) {
            let headTable = [];
            let arr = Object.keys(resList[0]);
            arr.forEach((item, index) => {
              let text = this.$MapStr(item, this.GSPcode);
              if (
                text !== "-" &&
                text !== "拒收数量" &&
                text !== "退回数量" &&
                text !== "含税金额" &&
                text !== "数量" &&
                text !== "采退数量"
              ) {
                headTable.push({
                  text: text,
                  field: item
                });
              }
            });
            if (this.nowPageNum === 1) {
              headTable.push({
                text: "拒收数量",
                field: "num",
                sortable: "num"
              });
            } else if (this.nowPageNum === 3) {
              headTable.push(
                {
                  text: "退回数量",
                  field: "returnNum"
                },
                {
                  text: "含税金额",
                  field: "amount"
                }
              );
            } else if (this.nowPageNum === 6) {
              headTable.push({
                text: "数量",
                field: "number"
              });
            } else if (this.nowPageNum === 7) {
              headTable.push({
                text: "采退数量",
                field: "puNumber"
              });
            }
            this.headTable = headTable;
            this.dataList = resList;
            // console.log(this.headTable,this.dataList)
          } else {
            this.$Notif({
              title: "提示",
              message: "当前筛选条件下列表暂无数据",
              type: "warning"
            });
            this.dataList = [];
          }
        })
        .catch(() => {
          this.dataList = [];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    search() {
      this.getTable();
    },
    // 排序回调
    sortableChange({ order, prop }) {
      switch (order) {
        case "ascending":
          this.eg = `${prop} asc`;
          break;
        case "descending":
          this.eg = `${prop} desc`;
          break;
        default:
          this.eg = "";
      }
      this.getTable();
    },
    lazy(str) {
      return {
        lazy: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            if (node.level == 0) {
              let nodes = [];
              All.postAPI({
                method: str,
                params:
                  str === "basic.code.erpRegion" ? { code: 1 } : { code: 0 }
              }).then(res => {
                nodes = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.unshift({ value: -1, label: "全部", leaf: true });
                resolve(nodes);
              });
            } else {
              let nodes = [];
              All.postAPI({
                method: str,
                params: { code: node.value }
              }).then(res => {
                nodes = res.map((value, i) => ({
                  value: value.code,
                  label: value.name,
                  leaf: value.code == 0
                }));
                nodes.unshift({ value: -1, label: "全部", leaf: true });
                resolve(nodes);
              });
            }
          }, 1000);
        }
      };
    },
    createBtn() {
      this.showCreate = true;
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
            this.selectOptions2 = res;
            this.selectOptions2.unshift({
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
.header {
  .el-form-item {
    margin-right: 20px;
  }
}
</style>