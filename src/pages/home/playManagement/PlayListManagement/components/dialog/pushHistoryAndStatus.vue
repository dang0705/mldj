<template>
  <div id="pushHistoryAndStatusWrapper">
    <el-dialog
      :visible.sync=" isAlertShow"
      :before-close="handleClose"
    >
      <!--推送历史列表-->
      <div class="tableWrapper">
        <el-tag type="info">推送历史列表</el-tag>
        <el-select v-model="pushHistorySelectModel" @change="changePushHistoryList" placeholder="推送历史" v-loading="pushHistorySelectLoading">
          <el-option
            v-for="(item,i) in myPushHistorySelectList"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-table
          :data="myPushHistoryList.slice((playItemsCurrentPage-1)*playItemsPageSize,playItemsCurrentPage*playItemsPageSize)"
          width="100%"
          :row-style="rowStyle"
          height="250"
          v-loading="pusHistoryListLoading"
        
        >
          <el-table-column label="播放项名称" align="center" width="200" prop="PlayItemName"></el-table-column>
          <el-table-column label="播放类型" align="center" prop="PlayType" :formatter="playTypeFormatter"></el-table-column>
        </el-table>
        <el-pagination
          :page-size="playItemsPageSize"
          :current-page="playItemsCurrentPage"
          :total="myPushHistoryList.length"
          layout="total,  prev, pager, next, jumper"
          @size-change="handlePlayItemsSizeChange"
          @current-change="handlePlayItemsCurrentChange"
        >
        </el-pagination>
      </div>
      
      <!--推送进度-->
      <div class="tableWrapper">
        <el-tag type="info">推送进度状态</el-tag>
        <el-select v-model="pushProgressSelectModel" @change="changePushProgressList" placeholder="推送进度"
                   v-loading="pushProgressSelectLoading">
          <el-option
            v-for="(item,i) in pushProgressSelectList"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-table
          :data="pushProgressList.slice((pushProgressCurrentPage-1)*pushProgressPageSize,pushProgressCurrentPage*pushProgressPageSize)"
          width="100%"
          height="250"
          :row-style="rowStyle"
          v-loading="pusProgressListLoading"
        
        >
          <el-table-column label="设备名称" align="center" width="200" prop="DeviceName"></el-table-column>
          <el-table-column label="推送状态" align="center" prop="MediaUpdateStatus"
          >
            <template slot-scope="scope">
              <el-tag :type="getPushStatus(scope.$index,scope.row)">{{pushStatus}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :page-size="pushProgressPageSize"
          :current-page="pushProgressCurrentPage"
          :total="pushProgressList.length"
          layout="total,  prev, pager, next, jumper"
          @size-change="handlePushProgressSizeChange"
          @current-change="handlePushProgressCurrentChange"
        >
        </el-pagination>
      </div>
    
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "pushHistoryAndStatus",
    props: {
      isPushHistoryAndStatusShow: {
        type: Boolean
      },
      pushHistorySelectList: {
        type: Array
      },
      playListID: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        pushStatus: '',
        isAlertShow: false,
        myExecPlayListCode: '',
        myPushHistorySelectList: [],
        myPushHistoryList: [],
        pushList: [],
        pushHistorySelectModel: '',    //推送历史 ExecPlayListCode 的双向绑定
        pushProgressSelectModel: '',    //推送进度双向绑定
        pushHistorySelectLoading:true,
        pushProgressSelectLoading: true,
        pusHistoryListLoading: true,
        pusProgressListLoading: true,
        pushProgressSelectList: [],
        pushProgressList: [],
        playItemsCurrentPage: 1,      //播放项列表初始页
        playItemsPageSize: 5,        //播放项列表每页的数据
        pushProgressCurrentPage: 1,  //推送进度列表初始页
        pushProgressPageSize: 5,    //推送进度列表每页的数据
        rowStyle: {
          height: '40px'
        },
      }
    }
    ,
    methods: {
      changePushData() {
      }
      ,
      handleClose() {
        this.$emit('closeSSAlert');
        this.pusHistoryListLoading = this.pusProgressListLoading =this.pushProgressSelectLoading= this.pushHistorySelectLoading=true;
        this.pushHistorySelectModel = this.pushProgressSelectModel = '';
      }
      ,
      handlePlayItemsSizeChange(size) {
        this.playItemsPageSize = size
      }
      ,
      handlePlayItemsCurrentChange(currentPage) {
        this.playItemsCurrentPage = currentPage
      }
      ,
      handlePushProgressSizeChange(size) {
        this.pushProgressPageSize = size
      }
      ,
      handlePushProgressCurrentChange(currentPage) {
        this.pushProgressCurrentPage = currentPage
      }
      ,
      playTypeFormatter(row, column, cellValue, index) {
        // console.log(row, column, cellValue, index);
        let playType = '';
        return playType = row.PlayType == 1 ? '全屏' : '其他'
      }
      ,
      
      getPushStatus(index, row) {
        console.log(index, row);
        let pushStatus;
        // return pushStatus= row.MediaUpdateStatus==='1'?'success':'info';
        if ( row.MediaUpdateStatus === '1' ) {
          this.pushStatus = '已推送';
          return pushStatus = 'success';
          
        } else {
          this.pushStatus = '未推送';
          return pushStatus = 'info';
          
        }
      },
      
      /*获取推送历史下拉数据*/
      getHistorySelectOption() {
        const that = this;
        that.pusHistoryListLoading = true;
        that.myPushHistorySelectList = [];
        that.$axios.post('/PlayManage/ExecElookPlayItemList', {
          ID: that.playListID
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            const res = data.data.Content,
              length = res.length;
            for ( var i = 0; i < length; i++ ) {
              that.myPushHistorySelectList.push({label: res[ i ].TempNumber, value: res[ i ].ExecPlayListCode})
            }
            that.pushHistorySelectModel = that.myPushHistorySelectList[ 0 ].value;
            
            console.log(that.myPushHistorySelectList);
            that.changePushHistoryList();
          }
          this.pushHistorySelectLoading=false;
          that.pusHistoryListLoading = false;
        })
        // }
      }
      ,
      /*切换推送历史table*/
      changePushHistoryList(val) {
        console.log(val);
        const that = this;
        // that.playItemsList=[];
        that.$axios.post('/PlayManage/ExecElookPlayListByItem', {
          ExecPlayListCode: val || that.pushHistorySelectModel
        })
          .then(data => {
            // console.log(data);
            if ( data.data.state == 1 ) {
              that.myPushHistoryList = data.data.Content;
              that.getProgressSelectOption(val)
            } else {
              that.$message.error(data.data.msg)
            }
          })
      }
      ,
      /*获取推送进度下拉数据*/
      getProgressSelectOption(val) {
        const that = this;
        that.pushProgressSelectList = [];
        that.$axios.post('/PlayManage/ExecElookPlayMediaItemList', {
          PageIndex: 1,
          PageSize: 1000,
          ExecPlayListCode: val || that.pushHistorySelectModel
        }).then(data => {
          // console.log(data);
          if ( data.data.state == 1 ) {
            const res = data.data.Content.Rows, length = res.length;
            for ( var i = 0; i < length; i++ ) {
              that.pushProgressSelectList.push({label: res[ i ].TempNumber, value: res[ i ].TempNumber})
            }
          } else {
            that.pushProgressSelectList = [];
            that.pushProgressList = [];
          }
          that.pushProgressSelectModel = that.pushProgressSelectList.length ? that.pushProgressSelectList[ 0 ].value : '';
          that.changePushProgressList(that.pushProgressSelectModel);
          that.pushProgressSelectLoading = false;
          that.pusProgressListLoading = false;
          
        })
      }
      ,
      /*切换推送进度table*/
      changePushProgressList(val) {
        // console.log(val);
        const that = this;
        that.$axios.post('/PlayManage/ExecElookPlayMediaItem', {
          PageIndex: 1,
          PageSize: 1000,
          ExecPlayListCode: that.pushHistorySelectModel,
          TempNumber: that.pushProgressSelectModel || val,
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.pushProgressList = data.data.Content.Rows;
            } else {
              that.pushProgressList = [];
            }
            that.pusProgressListLoading = false
          })
      }
      
    }
    ,
    watch: {
      'isPushHistoryAndStatusShow': function () {
        this.isAlertShow = this.isPushHistoryAndStatusShow;
        if ( this.isPushHistoryAndStatusShow ) {
          // this.getProgressSelectOption();
          this.getHistorySelectOption()
          this.pusHistoryListLoading = false;
          
          /* console.log('this.pushHistorySelectModel', this.pushHistorySelectModel);
		   console.log('this.historyListSelected', this.historyListSelected);*/
        }
        // console.log(this.myPushHistoryList);
      }
    }
  }
</script>

<style scoped lang="stylus">
  #pushHistoryAndStatusWrapper >>> .el-dialog
    width: 80% !important
    text-align center
  
  .tableWrapper
    display inline-block
    margin 0 5% 0
    width: 30%

</style>
