<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.keyWord"
        autocomplete="on"
        placeholder="机器编码"
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
        :beforeToday="true"
        :isSearch="true"
      ></date-picker>
    
     
    </div>
    <div class="result-wrapper">
      <dynamic-table :table-data="tableData"
                     :windowHeight="windowHeight"
                     :table-header="tableConfig"
                     :listLoading="listLoading"
                     :isListChange="isListChange"
      >
      </dynamic-table>
    </div>
    
    <!-- <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
				   :editData="sendDialogData"></alert-dialog>-->
  
  </div>
</template>

<script>
  import DynamicTable from './DynamicTable'
  import datePicker from '@/component/common/dateSelect/dateSelect'

  export default {
    name: "contentList",
    components: {
      DynamicTable,
      datePicker
    },
    data() {
      return {
        list: [],
        windowHeight:document.body.clientHeight-258,
        isListChange:false,
        searchData: {
          keyWord: '',
          startDate: '',
          endDate: '',
          ApprovalStataus: ''
        },
        // 表数据
        tableData: [],
        // 表头数据
        tableConfig: [],
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
        that.listLoading = true;
        that.$axios.post('/Home/Saledata',{
          StartDate:that.searchData.startDate,
          EndDate:that.searchData.endDate,
          DeviceName:that.searchData.keyWord
        })
          .then(data => {
            if ( data.data.state === 1 ) {
              console.log(data.data);
              that.tableData = data.data.Content.tabler;
              that.tableConfig=data.data.Content.tableh;
            }
            that.listLoading = false;
            that.isListChange = true;
          })
      },
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
