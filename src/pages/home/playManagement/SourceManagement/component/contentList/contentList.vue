<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="fileName"
        autocomplete="on"
        placeholder="名称"
        @keyup.enter.native="getList('update','search')"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList('update','search')"
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
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="dataLoading"
    
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
        width="360"
        :show-overflow-tooltip="true"
      
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            v-if="scope.row.FileType!=2"
            trigger="click"
            @show="afterEnterPopover(scope.$index,scope.row)"
          >
            <img width="600px"
                 :ref="'img_'+scope.$index"
                 :src="scope.row.OpenFileUrl"
                 alt="" v-if="scope.row.FileType==0">
            <video
              :ref="'video_'+scope.$index"
              width="100%"
              src=""
              v-show="scope.row.FileType==1"
              controls
              preload="metadata"></video>
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
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <upload-files
            :isAlertShow="isAlertShow"
            :getUploadType="uploadType"
            @closeAlert="closeAlert"
            @getProgressValue="getProgressValue"
          >
          </upload-files>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="isDialogShow"
      title="文件正在上传中，请稍等。。。"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      align="center"
    >
      <el-progress
        type="circle"
        :percentage="progressValue"
      >
      </el-progress>
    </el-dialog>
    
    <pagination
      :tableList="list"
      :isListChange="isListChange"
      @currentPage="getCurrentPage"
      @pageSize="getPageSize"
      @defaultPaginationData="defaultPaginationData"
      @listChanged="listChanged"
    ></pagination>
    
    <!--    <alert-dialog
		  :isAlertShow.sync="isAlertShow"
		  @closeAlert="closeAlert"
		  @getList="getList"
		  :editOrAdd="dialogType"
		  :id="id"
		  :editData="sendDialogData"></alert-dialog>-->
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import pagination from '@/component/common/pagination/pagination'
  import uploadFiles from './uploader/uploader'
  
  const storage = window.localStorage;
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination,
      uploadFiles
      
    },
    data() {
      return {
        list: [],
        fileSrc: '',
        progressValue: 0,
        isDialogShow: false,
        uploadType: 'image/jpg,image/jpeg,image/png,video/mp4,.apk',
        imgWidth: '',
        dataLoading: true,
        isListChange: false,
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
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px'
        },
        fileName: '',
        fileType: '',
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
      }
    },
    
    mounted() {
      this.getList()
    },
    methods: {
      getProgressValue(val) {
        this.progressValue = val;
        if ( val > 0 && val < 100 ) {
          this.isDialogShow = true;
        } else if ( val === 100 ) {
          this.isDialogShow = false;
        }
      },
      /*      getUploadStatus(val) {
			  const that = this;
			  that.isUploaded = val;
			  setTimeout(function () {
				that.$emit('closeAlert');
				that.$emit('updateList')
			  }, 2000)
			},*/
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
      change() {
        this.getList('update', 'search')
      },
      formatter(row, index) {
        let finishStatus;
        return finishStatus = row.Finished = 1 ? '已完成' : '未完成'
      },
      
      getList(update, search) {
        const that = this,
          url = '&PageSize=1000&PageIndex=1&FileName=' + that.fileName + '&FileType=' + that.fileType + '&EmployeeCode=' + storage.getItem('userName');
        if ( storage.getItem('source') && !update ) {
          that.list = JSON.parse(storage.getItem('source'))
          
        } else {
          that.dataLoading = true;
          that.$axios.post('/PlayManage/EmployeeFileAllList', url)
            .then(data => {
              console.log(data);
              if ( data.data.state == 1 ) {
                that.list = data.data.Content.Rows;
                if ( !search ) {
                  storage.setItem('source', JSON.stringify(that.list))
                }
                that.dataLoading = false;
              }
              
            })
        }
        that.dataLoading = false;
        that.isListChange = true;
      },
      addBtn({row, column, rowIndex, columnIndex}) {
        return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          console.log(this.dialogType);
        }
      },
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        this.getList('update');
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.ApkCode = this.list[ realIndex ].ApkCode;
        this.sendDialogData.ApkName = this.list[ realIndex ].ApkName;
        this.sendDialogData.ApkDec = this.list[ realIndex ].ApkDec;
        this.sendDialogData.ID = row.ID;
      }
      ,
      deleteItem(index, row) {
        let that = this;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
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
      afterEnterPopover(index, val) {
        // console.log(index, val);
        const videoIndex = 'video_' + index;
        
        this.$nextTick(() => {
          this.$refs[ videoIndex ].src = val.OpenFileUrl;
          // this.$refs[ imgIndex ].src = val.OpenFileUrl;
        })
        
      }
    }
  }
</script>

<style scoped lang="stylus">
  .download
    display inline-block
    text-decoration none
    color #000
    font-size: 1.2rem
    width: 100%
</style>
