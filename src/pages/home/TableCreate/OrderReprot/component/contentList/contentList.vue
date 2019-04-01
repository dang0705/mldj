<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.keyWord"
        autocomplete="on"
        placeholder="设备名称"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.fee"
        autocomplete="on"
        placeholder="费用查询"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>

      <el-date-picker
        v-model="searchData.ActivityDate"
        value-format="yyyy-MM-dd"
        @change="getList"
        type="date"
        placeholder="选择活动日期">
      </el-date-picker>
      <date-picker
        @getDate="getDate"
        start="订单开始时间"
        end="订单结束时间"
        :allDate="true"
        :isSearch="true"
      ></date-picker>
    
    </div>
    <el-table width="100%"
              :data="list"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="listLoading"
    
    >
      <el-table-column
        type="expand"
        label="展开"
        width="80"
      >
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item label="产品阿里编号：">
              <span>{{props.row.AliCode}}</span>
            </el-form-item>
            <el-form-item label="用户OPENID：">
              <span>{{props.row.OrderUser}}</span>
            </el-form-item>
            <el-form-item label="门店编号：">
              <span>{{props.row.ShopId}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="门店名称"
        prop="ShopName"
        width="180"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="设备名称"
        prop="DeviceName"
        width="140"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="活动时间"
        :formatter="activityTime"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="订单时间"
        width="180"
        align="center"
        :show-overflow-tooltip="true"
        prop="DateCreated"
      >
      </el-table-column>
      <el-table-column
        label=" 产品名称 "
        prop="ProductName"
        width="160"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
   
      <el-table-column
        label="产品微信订单号"
        prop="OrderId"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next,jumper"
      :total="total"
    >
    </el-pagination>
    <!-- <pagination
	   :tableList="list"
	   :isListChange="isListChange"
	   @currentPage="getCurrentPage"
	   @pageSize="getPageSize"
	   @defaultPaginationData="defaultPaginationData"
	   @listChanged="listChanged"
   
	 ></pagination>-->
    
    <!-- <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
				   :editData="sendDialogData"></alert-dialog>-->
  
  </div>
</template>

<script>
  import datePicker from '@/component/common/dateSelect/dateSelect'
  import pagination from '@/component/common/pagination/pagination'
  
  export default {
    name: "contentList",
    components: {
      pagination,
      datePicker
    },
    data() {
      return {
        list: [],
        datatype:'date',
        isListChange: false,
        searchData: {
          keyWord: '',
          fee:'',
          startDate: '',
          endDate: '',
          ActivityDate: ''
        },
        currentPage: 1, //初始页
        pageSize: 15,    //每页的数据
        pageCount:0,
        total: 0,
        listLoading: true,
        //    每页的数据
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
      }
    },
    mounted() {
      this.getList();
      console.log(this.windowHeight);
    },
    methods: {
      getList() {
        const that = this;
        that.list=[];
        that.listLoading = true;
        that.$axios.post('/Home/Orderdata', {
          PageSize: that.pageSize,
          Page: that.currentPage,
          StartDate: that.searchData.startDate,
          EndDate: that.searchData.endDate,
          DeviceName: that.searchData.keyWord,
          ActivityDate:that.searchData.ActivityDate,
          TotalFee: that.searchData.fee
        })
          .then(data => {
            if ( data.data.state === 1 ) {
              console.log(data.data);
              that.list=data.data.Content.table;
              that.total = data.data.Content.total;
              
              // that.tableData = data.data.Content.tabler;
              // that.tableConfig=data.data.Content.tableh;
            }
            that.listLoading = false;
            that.isListChange = true;
          })
      },
      handleSizeChange(val) {
        console.log(val);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getList();
        console.log(val);
      },
      listChanged() {
        this.isListChange = false
      },
      defaultPaginationData(val) {
        if ( val && val.length ) {
          this.currentPage = val[ 0 ];
          this.pageSize = val[ 1 ]
        }
      },
      getCurrentPage(currentPage) {
        this.currentPage = currentPage
      },
      getPageSize(pageSize) {
        this.pageSize = pageSize
      }
      ,
      activityTime(row, column, cellValue, index){
        console.log(row, column, cellValue, index);
        return row.OpenStartDate+' - '+row.OpenEndDate
      },
      getDate(val) {
        if ( val ) {
          this.searchData.startDate = val[ 0 ];
          this.searchData.endDate = val[ 1 ];
        } else {
          this.searchData.startDate = this.searchData.endDate = ''
        }
        
      },
      
      addBtn({row, column, rowIndex, columnIndex}, noAdd) {
        return this.$myFunctions.tableHeadReset({row, column, rowIndex, columnIndex}, noAdd);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  .filterComponents .input
    width 15% !important
</style>
