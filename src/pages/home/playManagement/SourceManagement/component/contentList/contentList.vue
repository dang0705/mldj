<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="fileName"
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
      <el-select v-model="fileType" placeholder="请选择" @change="change">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
    
    >
      <el-table-column label="下载" width="100"
                       align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.OpenFileUrl" class="el-icon-download download" :download="scope.row.FileName"
             title="下载至本地"></a>
        </template>
      </el-table-column>
      <el-table-column
        label="素材名称"
        prop="FileName"
        align="left"
        width="380"
        :show-overflow-tooltip="true"
      
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            v-if="scope.row.FileType!=2"
            :width="imgWidth||'800'"
            trigger="click"
            @show="afterEnterPopover(scope.row)"
          >
            <img width="100%" :src="scope.row.OpenFileUrl" alt="" v-if="scope.row.FileType==0"
                 v-show="imgWidth">
            <video width="100%" :src="scope.row.OpenFileUrl" v-if="scope.row.FileType==1" autoplay controls></video>
            <el-button type="text" slot="reference"
                       :icon="scope.row.FileType==0?'el-icon-picture':'el-icon-caret-right'">{{scope.row.FileName}}
            </el-button>
          </el-popover>
          
          <span v-if="scope.row.FileType==2">{{scope.row.FileName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时长(秒)"
        prop="TimeLong"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="素材来源"
        prop="CompanyAbb"
        align="center"
        width="260"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="上传状态"
        :formatter="formatter"
        prop="ApkDec"
        align="center"
        width="100"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="上传日期"
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
    
    <alert-dialog
      :isAlertShow.sync="isAlertShow"
      @closeAlert="closeAlert"
      @updateList="updateList"
      :editOrAdd="dialogType"
      :id="id"
      :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  
  const storage = window.localStorage;
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      // filter
    },
    data() {
      return {
        list: [],
        imgWidth: '',
        typeList: [
          {value: '', label: '全部'},
          {value: 0, label: '图片'},
          {value: 1, label: '视频'},
          {value: 2, label: '游戏'}
        ],
        dialogType: 'up_date',
        isListEmpty: true,
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px'
        },
        fileName: '',
        fileType: '',
        currentPage: 1, //初始页
        pagesize: 5,    //    每页的数据
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
      this.updateList()
    },
    methods: {
      change() {
        this.updateList()
      },
      formatter(row, index) {
        // console.log(row, index);
        let finishStatus;
        return finishStatus = row.Finished = 1 ? '已完成' : '未完成'
      },
      sourcePreview(i, row) {
        console.log(row);
      },
      updateList() {
        const that = this,
          url = '&PageSize=1000&PageIndex=1&FileName=' + that.fileName + '&FileType=' + that.fileType + '&EmployeeCode=' + storage.getItem('userName');
        that.$axios.post('/PlayManage/EmployeeFileAllList', url)
          .then(data => {
            if ( data.data.Content ) {
              const res = data.data.Content.Rows;
              if ( !res || !res.length || res.length ) {
                that.isListEmpty = false
              }
              that.list = res ? res : [];
            } else {
              that.list = [];
              that.isListEmpty = false
            }
            console.log(that.list);
          })
      },
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
        this.sendDialogData.ApkCode = this.list[ realIndex ].ApkCode;
        this.sendDialogData.ApkName = this.list[ realIndex ].ApkName;
        this.sendDialogData.ApkDec = this.list[ realIndex ].ApkDec;
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
            that.$axios.post('/Home/ApkSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                that.$axios.post('/Home/OnloadApkList', {
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
        this.updateList()
      }
      ,
      afterEnterPopover(val) {
        const img = new Image(),
          that = this;
        img.src = val.OpenFileUrl;
        console.log(img.height);
        
        img.onload = function () {
          if ( img.height / img.width > 1.2 ) {
            that.imgWidth = '500'
          } else {
            that.imgWidth = '1080'
            
          }
        }
      }
    
      
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .download
    display inline-block
    text-decoration none
    color #000
    font-size: 1.2rem
  
  #contentListWrapper >>> .el-input__inner
    inputNoBorder()
  
  #contentListWrapper >>> .el-table
    box-shadow 0 5px 8px rgba(0, 0, 0, .2)
    margin-bottom: 40px
  
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
