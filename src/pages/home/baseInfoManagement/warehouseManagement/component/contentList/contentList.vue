<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
        autocomplete="on"
        placeholder="名称"
        @keyup.enter.native="filter"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="filter"
        >
        </i>
      </el-input>
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
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
        label="仓库名称"
        align="center"
        prop="WarehouseName"
        width="180">
      </el-table-column>
      <el-table-column
        label="仓库编号"
        align="center"
        prop="WarehouseCode"
        width="180">
      </el-table-column>
      <el-table-column
        label="仓库地址"
        align="center"
        prop="WarehouseAdd"
        width="340"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="仓库描述"
        align="center"
        prop="WarehouseDec"
        width="320"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="增加+"
        align="center">
      </el-table-column>
    </el-table>
    <i v-show="isListEmpty" class="listLoading el-icon-loading"></i>
  
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
                  :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import axios from 'axios'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      // filter
    },
    data() {
      return {
        list: [],
        isListEmpty: true,
        dialogType: 'up_date',
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
        pagesize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          WarehouseCode: '',
          WarehouseAdd: '',
          WarehouseName: '',
          WarehouseDec: '',
          ID: '',
        }
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getApkList()
    },
    methods: {
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getApkList() {
        let that = this;
        that.list = [];
        axios.post('/api/Home/OnloadWarehouseList')
          .then(data => {
            const res = data.data.Content;
            if ( !res || !res.length||res.length ) {
              that.isListEmpty = false
            }
            that.list = res ? res : [];
            that.$store.state.isWarehouseUpdateData = false;
          })
      }
      
      ,
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false
      }
      , getData(index, row) {
        // console.log(index, row);
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.WarehouseCode = this.list[ realIndex ].WarehouseCode;
        this.sendDialogData.WarehouseName = this.list[ realIndex ].WarehouseName;
        this.sendDialogData.WarehouseAdd = this.list[ realIndex ].WarehouseAdd;
        this.sendDialogData.WarehouseDec = this.list[ realIndex ].WarehouseDec;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.post('/api/Home/WarehouseSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                axios.post('/api/Home/OnloadWarehouseList', {
                  ApkName: this.keyWord
                })
                  .then(res => {
                    that.list = res.data.Content;
                    that.$store.state.isWarehouseUpdateData = false;
                    that.$store.state.isApkUpdateData = false;
                  })
              })
          })
          .catch(() => {
          
          })
        
      }
      ,
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        // console.log(this.currentPage)  //点击第几页
      }
      ,
      filter() {
        let that = this;
        axios.post('/api/Home/OnloadWarehouseList', {
          WarehouseName: this.keyWord
        })
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isWarehouseUpdateData = false;
          })
      }
      
    },
    watch: {
      '$store.state.isWarehouseUpdateData': function () {
        if ( this.$store.state.isWarehouseUpdateData === true ) {
          this.getApkList()
        }
      },
      
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #contentListWrapper >>> .el-input__inner
    inputNoBorder()
  
  #contentListWrapper >>> .el-table
    box-shadow 0 5px 8px rgba(0, 0, 0, .2)
    margin-bottom: 40px
  
  #contentListWrapper >>> .el-table__body-wrapper, #contentListWrapper >>> .el-table__body
    width: 100% !important
  
  #contentListWrapper >>> .el-table__row
    td
      text-align center
  
  #contentListWrapper
    listStyle()
    .el-icon-search
      filterIcon()
    li
      height $eachListHeight
      background white
      border-bottom 3px solid #ccc
  
  .el-table__body-wrapper
    width: 100%
  
  .activeName
    filter()
    width: 600px
</style>
