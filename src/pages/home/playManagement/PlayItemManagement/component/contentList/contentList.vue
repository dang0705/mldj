<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="sendDialogData.PlayItemName"
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
      <el-select
        v-model="Validity"
      >
      
      </el-select>
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
        label="播放项名称"
        prop="PlayItemName"
        align="center"
        width="255"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="播放时长(秒)"
        prop="Duration"
        align="center"
        width="140"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="播放素材"
        prop="FileName"
        align="center"
        width="345"
        :show-overflow-tooltip="true">
      </el-table-column>
     <!-- <el-table-column
        label="跳转路径"
        prop="ApkDec"
        align="center"
        width="180"
        :show-overflow-tooltip="true">
      </el-table-column>-->
      <el-table-column
        label="创建人"
        prop="EmployeeName"
        align="center"
        width="100"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="DateCreated"
        align="center"
        width="180"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="增加+">
      </el-table-column>
    </el-table>
    <i v-show="isListEmpty" class="listLoading el-icon-loading"></i>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :id="id"
                  :editData="sendDialogData"></alert-dialog>
    <!--<sourcelist-dialog-->
      <!--:isSourceListShow.sync="isSourceListShow"-->
      <!--@getIsSourceListShow="getIsSourceListShow"-->
    <!--&gt;</sourcelist-dialog>-->
  </div>
</template>

<script>
  import axios from 'axios'
  import alertDialog from '../dialog/dialog'
  // import sourcelistDialog from '../dialog/sourceListDialog/sourceListDialog'
  
  const storage=window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      // sourcelistDialog
      // filter
    },
    data() {
      return {
        isSourceListShow: false,
        FileType:'',
        list: [],
        dialogType: 'up_date',
        isListEmpty: true,
        Validity:'',
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
          FileName: '',
          FileType: '',
          PlayItemName: '',
          Duration: '',//播放时长
          TimeLong: '',//素材时长
          OperationType: "up_date",
          FileId: '',
          EmployeeCode: storage.getItem('userName') ,
          Navigation: '',
          sourceType: ''
        }
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getList()
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
      getList() {
        let that = this,
          params = '&PageSize=1000&PageIndex=1&PlayItemName=' + that.sendDialogData.FileName +
            '&Validity=' + that.sendDialogData.FileType +
            '&EmployeeCode=' + that.sendDialogData.EmployeeCode+
            '&RoleId='+storage.getItem('RoleID')+
            '&FileType='+that.sendDialogData.FileType;
        // that.list = [];
        axios.post('/api/PlayManage/EmployeePlayItemList',params)
          .then(data => {
            console.log(data);
            const res = data.data.Content.Rows;
            if ( !res || !res.length || res.length ) {
              that.isListEmpty = false
            }
            that.list = res || [];
          })
      }
      
      ,
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false
      }
      ,
      getData(index, row) {
        // console.log(index, row);
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.FileName = this.list[ realIndex ].FileName;
        this.sendDialogData.FileType = this.list[ realIndex ].FileType;
        this.sendDialogData.PlayItemName = this.list[ realIndex ].PlayItemName;
        this.sendDialogData.Duration = this.list[ realIndex ].Duration;
        this.sendDialogData.TimeLong = this.list[ realIndex ].TimeLong;
        this.sendDialogData.FileId = this.list[ realIndex ].FileId;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.post('/api/Home/ApkSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                axios.post('/api/Home/OnloadApkList', {
                  ApkName: this.keyWord
                })
                  .then(res => {
                    that.list = res.data.Content;
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
        axios.post('/api/Home/OnloadApkList', {
          ApkName: this.keyWord
        })
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isApkUpdateData = false;
          })
      }
      
    },
    watch: {
      '$store.state.isApkUpdateData': function () {
        if ( this.$store.state.isApkUpdateData === true ) {
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
