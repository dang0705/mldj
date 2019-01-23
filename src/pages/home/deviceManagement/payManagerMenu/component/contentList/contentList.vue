<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input"
        v-model="keyWord"
        autocomplete="on"
        placeholder="名称"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
    
    </div>
    
    <el-table width="100%"
              max-height="900"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="dataLoading"
    >
      <el-table-column
        width="100"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small"
                     icon="el-icon-edit"
                     circle
                     @click="getData(scope.$index,scope.row)">
          </el-button>
          
          <el-switch
            v-model="scope.row.Validity"
            :active-value="1"
            :inactive-value="0"
            @change=switchChange(scope.$index,scope.row)
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="payname"
        label="支付名称"
        align="center"
        width="800"
      >
      </el-table-column>
      <el-table-column
        prop="APPID"
        label="APPID"
        align="center"
        width="200"
      >
      </el-table-column>
      
      <el-table-column
        label="增加+"
        align="center"
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
    
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  :editOrAdd="dialogType"
                  :editData="sendDialogData"
                  @closeAlert="closeAlert"
                  @getProgress="getProgress"
    ></alert-dialog>
  
  </div>
</template>

<script>
  import pagination from '@/component/common/pagination/pagination'
  import alertDialog from '../dialog/dialog'
  
  const storage = window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        list: [],
        uploadProgress: 0,
        dataLoading: true,
        isListChange: false,
        dialogType: 'up_date',
        switchData: '',
        headerStyle: {
          height: '100%',
          color: '#000',
          background: '#ccc'
        },
        rowStyle: {
          height: '40px',
        },
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          SSLCERT_PATH: '',
          account: '',
          payname: '',
          pkey: '',
          APPID: '',
          ID: '',
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getProgress(val) {
        console.log(val);
        this.uploadProgress = val;
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
      addBtn({row, column, rowIndex, columnIndex}) {
        return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
        }
      },
      getList(update) {
        let that = this;
        that.$axios.post('/Home/payList', {
          payname: this.keyWord,
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
        
            }
            that.dataLoading = false;
            that.isListChange = true;
          })
        
      }
      
      ,
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList('update');
        }
      }
      , getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.SSLCERT_PATH = this.list[ realIndex ].UpBusinessLicense.substring(this.list[ realIndex ].UpBusinessLicense.lastIndexOf('/') + 1);
        this.sendDialogData.payname = this.list[ realIndex ].payname;
        this.sendDialogData.account = this.list[ realIndex ].account;
        this.sendDialogData.APPID = this.list[ realIndex ].APPID;
        this.sendDialogData.pkey = this.list[ realIndex ].pkey;
        this.sendDialogData.ID = row.ID;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData))
      }
      , switchChange(index, row) {
        console.log(row);
        let that = this;
        that.$axios.post('/Home/DeviceLabelSave', {
          DogType: 'd_elete',
          ID: row.ID
        })
          .then(() => {
            that.getList('update');
          })
      }
      
    }
  }
</script>

<style scoped lang="stylus">

</style>
