<template>
  <div class="souceListDialogWrapper">
    <el-dialog
      :title="alertTitle"
      :visible.sync="isSourceListShow"
      :before-close="handleClose"
    >
      <el-form
        ref="sourceSelect"
      >
        <el-form-item
        >
          <div class="filterComponents">
            <el-input
              class="activeName"
              v-model="FileName"
              placeholder="请输入素材名称"
              @keyup.enter.native="filter"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="filter"
              ></i>
            </el-input>
            <el-select
              v-model="FileType"
              placeholder="请选择"
              @change="change">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <el-table width="100%"
                :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                :row-style="rowStyle"
                :header-row-style="headerStyle"
                v-loading="dataLoading"
      >
        <el-table-column label="单选"
                         width="80"
                         align="center"
        >
          <template slot-scope="scope">
            <el-radio class="radio" v-model="sourceInfo.FileId"
                      :label="scope.row.ID.toString()"
                      @change="select(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="素材名称"
          prop="FileName"
          align="center"
          width="240"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="素材时长(秒)"
          prop="TimeLong"
          align="center"
          width="180"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="上传时间"
          prop="DateCreated"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const storage = window.localStorage;
  
  export default {
    name: "sourceListDialog",
    props: {
      isSourceListShow: {
        type: Boolean
      }
      ,
      OperationType: {
        type: String
      }
      ,
      sendFileId: {
        type: String
      }
    },
    data() {
      return {
        list: [],
        dataLoading: true,
        alertTitle: '播放素材列表',
        sourceInfo: {
          FileName: '',
          TimeLong: '',
          FileType: '',
          FileUrl: '',
          FileId: '',
          dialogType: '',
          sourceType: '',
          EmployeeCode: storage.getItem('userName')
        },
        FileName: '',
        FileType: '',
        currentPage: 1, //初始页
        pagesize: 5,    //    每页的数据
        typeList: [
          {value: '', label: '全部'},
          {value: 0, label: '图片'},
          {value: 1, label: '视频'},
          {value: 2, label: '游戏'}
        ],
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px'
        },
      }
    },
    methods: {
      select(val) {
        console.log(val);
        this.sourceInfo.FileName = val.FileName;
        this.sourceInfo.TimeLong = val.TimeLong;
        this.sourceInfo.FileType = val.FileType;
        if ( val.FileType == 0 ) {
          this.sourceInfo.sourceType = '图片'
        } else if ( val.FileType == 1 ) {
          this.sourceInfo.sourceType = '视频'
        } else {
          this.sourceInfo.sourceType = '游戏'
        }
        this.sourceInfo.FileUrl = val.FileUrl;
        
        // console.log(this.FileId);
      },
      getSourceList() {
        if ( storage.getItem('source') ) {
          this.list = JSON.parse(storage.getItem('source'));
          this.dataLoading = false;
        } else {
          const that = this,
            params = '&PageSize=1000&PageIndex=1&filename=' + that.FileName +
              '&FileType=' + that.FileType +
              '&RoleId=' + storage.getItem('RoleID') +
              '&EmployeeCode=' + that.sourceInfo.EmployeeCode;
          
          that.$axios.post('/PlayManage/EmployeeFileAllList', params)
            .then(data => {
              console.log(data);
              if ( data.data.state == 1 ) {
                that.list = data.data.Content.Rows;
                that.dataLoading = false;
              }
            })
        }
        
      },
      
      filter() {
        this.getSourceList()
      },
      change() {
        this.getSourceList()
      },
      handleClose() {
        this.$emit('closeThis');
        this.FileType = this.FileName = '';
      },
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        // console.log(this.currentPage)  //点击第几页
      }
      ,
      confirmUpload() {
        this.sourceInfo.dialogType = this.OperationType;
        this.$emit('selectedSource', this.sourceInfo);
        this.handleClose()
      }
    },
    mounted() {
      if ( storage.getItem('source') ) {
        this.list = JSON.parse(storage.getItem('source'));
        this.dataLoading = false;
      } else {
        this.getSourceList();
      }
      this.sourceInfo.FileId = this.sendFileId;
      console.log(this.sourceInfo.FileId);
    },
    watch: {
      'isSourceListShow': function () {
        console.log(this.OperationType);
        this.sourceInfo.FileId = this.sendFileId
        console.log(this.sourceInfo.FileId);
        
      }
    }
  }
</script>

<style scoped lang="stylus">
  .souceListDialogWrapper >>> .el-radio__label
    display none
  
  .filterComponents
    width: 100% !important
  
  .activeName, .el-select
    float left !important
    width 45% !important
  
  .el-select
    float right
  
  .souceListDialogWrapper >>> .el-dialog
    width: 750px !important
    margin-top: 20% !important
</style>
