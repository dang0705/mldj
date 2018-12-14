<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
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
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="dataLoading"
    
    >
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="版本名称"
        prop="ApkName"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="版本编号"
        prop="ApkCode"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="版本描述"
        prop="ApkDec"
        align="center"
        width="660"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="增加+">
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
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
                  :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import pagination from '@/component/common/pagination/pagination'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        list: [],
        dialogType: 'up_date',
        dataLoading: true,
        isListChange: false,
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px'
        },
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          ApkName: '',
          ApkCode: '',
          ApkDec: '',
          ID: '',
        }
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
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
      addBtn({row, column, rowIndex, columnIndex}) {
        return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getList() {
        let that = this;
        that.dataLoading = true;
        that.$axios.post('/Home/OnloadApkList', {
          ApkName: this.keyWord
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
        if ( !n ) {
          this.getList()
        }
        this.isAlertShow = false
      }
      ,
      getData(index, row) {
        // console.log(index, row);
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.ApkCode = this.list[ realIndex ].ApkCode;
        this.sendDialogData.ApkName = this.list[ realIndex ].ApkName;
        this.sendDialogData.ApkDec = this.list[ realIndex ].ApkDec;
        this.sendDialogData.ApkUrl = this.list[ realIndex ].ApkUrl ? this.list[ realIndex ].ApkUrl.substring(this.list[ realIndex ].ApkUrl.lastIndexOf('/') + 1) : '';
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData));
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        // var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/ApkSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                that.getList()
              })
          })
          .catch(() => {
          
          })
        
      }
      
      
    },
    
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
</style>
