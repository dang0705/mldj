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
      
      >
        <el-table-column label="选中"
                         width="80"
                         align="center"
        >
          <template slot-scope="scope">
            <el-radio class="radio" v-model="sourceInfo.FileId" :label="scope.row.ID"
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
      , OperationType: {
        type: String
      }
    },
    data() {
      return {
        list: [],
        isListEmpty: true,
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
          {value: 1, label: '视频'}
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
        const that = this,
          params = '&PageSize=1000&PageIndex=1&filename=' + that.FileName +
            '&FileType=' + that.FileType +
            '&RoleId=' + storage.getItem('RoleID') +
            '&EmployeeCode=' + that.sourceInfo.EmployeeCode;
        
        that.$axios.post('/api/PlayManage/EmployeeFileAllList', params)
          .then(data => {
            console.log(data);
            const res = data.data.Content.Rows;
            if ( !res || !res.length || res.length ) {
              that.isListEmpty = false
            }
            that.list = res || [];
          })
      },
      
      filter() {
        this.getSourceList()
      },
      change() {
        this.getSourceList()
      },
      handleClose() {
        this.$emit('closeThis');
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
      this.getSourceList()
    },
    watch: {
      'isSourceListShow': function () {
        console.log(this.OperationType);
        /* if ( this.isSourceListShow ) {
		 
		 }*/
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
    float left
    width 45%
  
  .el-select
    float right
  
  .souceListDialogWrapper >>> .el-dialog
    width: 750px !important
</style>
