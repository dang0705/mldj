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
        v-model="searchData.productName"
        autocomplete="on"
        placeholder="产品名称"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>

      <date-picker
        @getDate="getDate"
        start="开始时间"
        end="结束时间"
        :allDate="true"
        :isSearch="true"
      ></date-picker>
    
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="listLoading"
    >
      <el-table-column
        label="设备名称"
        prop="DeviceName"
        width="400"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="产品名称"
        prop="ProductName"
        width="400"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="销量"
        prop="countpay"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
    
    </el-table>
   
     <pagination
	   :tableList="list"
	   :isListChange="isListChange"
	   @currentPage="getCurrentPage"
	   @pageSize="getPageSize"
	   @defaultPaginationData="defaultPaginationData"
	   @listChanged="listChanged"
   
	 ></pagination>
    
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
          productName:'',
          startDate: '',
          endDate: '',
        },
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
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
        that.$axios.post('/Home//ProductData', {
          StartDate: that.searchData.startDate,
          EndDate: that.searchData.endDate,
          DeviceName: that.searchData.keyWord,
          ProductName:that.searchData.productName
        })
          .then(data => {
            if ( data.data.state === 1 ) {
              console.log(data.data);
              that.list=data.data.Content;
            }
            that.listLoading = false;
            that.isListChange = true;
          })
      },
      listChanged() {
        this.isListChange = false
      },
      defaultPaginationData(val) {
        console.log(val);
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
      getDate(val) {
        if ( val ) {
          this.searchData.startDate = val[ 0 ];
          this.searchData.endDate = val[ 1 ];
        } else {
          this.searchData.startDate = this.searchData.endDate = ''
        }
        this.getList()
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

</style>
