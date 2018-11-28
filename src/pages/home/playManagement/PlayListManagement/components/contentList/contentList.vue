<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <data-picker
        @getDate="getDate"
        :allDate="true"
      ></data-picker>
      <el-input
        autofocus
        class="input activeName"
        v-model="defaultAndSearchInfo.PlayListName"
        autocomplete="on"
        placeholder="播放列表名称"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <el-select
        v-model="defaultAndSearchInfo.Validity"
        @change="getList"
        placeholder="设备状态"
      >
        <el-option
          v-for="(item,i) in statusList"
          :key="i"
          :label="item.label"
          :value="item.value"
        >
        
        </el-option>
      </el-select>
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="tableLoading"
    >
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button circle icon="el-icon-edit" size="small" @click="edit(scope.$index,scope.row)"></el-button>
          <el-switch
            v-model="scope.row.Validity"
            @change="switchChange(scope.$index,scope.row)"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="播放列表名称" align="center" width="140" prop="PlayListName"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="创建日期" align="center" width="160" prop="DateCreated"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="播放日期" align="center" width="200" :formatter="formatter"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="播放项设置" align="center" width="160"
                       :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button
            type="success" round size="small"
            :disabled="playItemSettingsDisabledFormatter(scope.$index,scope.row)"
            v-text="playItemSettingsTxtFormatter(scope.$index,scope.row)"
            @click="screenSettings(scope.$index,scope.row)"
          >
            屏幕播放项设置
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="推送操作" align="center" width="180"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button v-text="pushBtnTxtFormatter(scope.$index,scope.row)"
                     :disabled="pushDisabledFormatter(scope.$index,scope.row)"
                     type="primary"
                     round size="small"
                     @click="pushDeviceSelect(scope.$index,scope.row)">推送设备选择
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="推送历史" align="center" width="180"
                       :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button type="info" round size="small"
                     v-text="pushBtnTxtFormatter(scope.$index,scope.row)"
                     :disabled="pushDisabledFormatter(scope.$index,scope.row)"
                     @click="pushHistoryAlertShow(scope.$index,scope.row)">查看推送历史
          </el-button>
        </template>
      
      </el-table-column>
      <el-table-column label="增加+" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length"
    >
    </el-pagination>
    
    <add-and-edit-playList
      :isAddAndEditPlayListShow.sync="isAddAndEditPlayListShow"
      :dialogType="dialogType"
      :editData="sendToDialog"
      @closePlayListAlert="closePlayListAlert"
    
    >
    
    </add-and-edit-playList>
    
    <player-dialog
      :isPlayerDialogShow.sync="isPlayerDialogShow"
      @closePlayerAlert="closePlayerAlert"
      :playListId="playListId"
    >
    </player-dialog>
    <screen-settings
      :isSSDialogShow.sync="isSSDialogShow"
      @closeSSAlert="closeSSAlert"
      :playListId="playListId"
    >
    </screen-settings>
    <push-history-and-status
      :isPushHistoryAndStatusShow.sync="isPushHistoryAndStatusShow"
      :playListID="playListID"
      @closeSSAlert="closePHASAlert"
    >
    
    </push-history-and-status>
  </div>
</template>

<script>
  import dataPicker from '@/component/common/dateSelect/dateSelect'
  import addAndEditPlayList from '../dialog/addAndEditPlayList'
  import playerDialog from '../dialog/playerDialog'
  import pushHistoryAndStatus from '../dialog/pushHistoryAndStatus'
  import screenSettings from '../dialog/playItemSelect'
  
  const storage = window.localStorage;
  
  export default {
    name: "contentList",
    components: {
      dataPicker,
      addAndEditPlayList,
      playerDialog,
      pushHistoryAndStatus,
      screenSettings
    },
    data() {
      return {
        list: [],
        playListID: 0,
        thisSelectIndex: 0,
        historyOptionLoading: true,
        tableLoading: true,
        playListId: '',
        isAddAndEditPlayListShow: false,    //显示隐藏新增修改播放列表弹框
        isPlayerDialogShow: false,          //显示隐藏推送操作弹框
        isPushHistoryAndStatusShow: false,  //显示隐藏推送历史弹框
        isSSDialogShow: false,              //显示隐藏屏幕播放项弹框
        ExecPlayListCode: '',
        statusList: [
          {value: '', label: '全部'},
          {value: 1, label: '启用'},
          {value: 0, label: '停用'},
        ],
        defaultAndSearchInfo: {
          PageIndex: 1,
          PageSize: 1000,
          PlayListName: '',
          Validity: '',
          PlayListStartDate: '',
          PlayListEndDate: '',
          EmployeeCode: storage.getItem('userName')
        },
        sendToDialog: {
          PlayListName: '',
          Validity: '',
          PlayListStartDate: '',
          PlayListEndDate: '',
          PlayListType: '',
          PlayListDefault: '',
          EmployeeCode: storage.getItem('userName')
        },
        dialogType: '',
        rowStyle: {
          height: '40px'
        },
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        }
      }
    }
    ,
    methods: {
      getList() {
        let that = this;
        
        that.tableLoading = true;
        that.$axios.post('/PlayManage/EmployeePlayListList', that.defaultAndSearchInfo)
          .then(data => {
            that.tableLoading = false;
            if ( data.data.state == 1 ) {
              that.list = data.data.Content.Rows
            }
          })
      }
      ,
      handleSizeChange(size) {
        this.pageSize = size
      }
      ,
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
      }
      ,
      switchChange(i, row) {
        // console.log(row);
        const that = this;
        that.$axios.post('/PlayManage/EmployeePlayListUpdateStatus', {
          ID: row.ID,
          Validity: row.Validity,
          EmployeeCode: that.sendToDialog.EmployeeCode
        }).then(() => {
          that.getList()
        })
      }
      ,
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
      },
      add(column) {
        if ( column.label === '增加+' ) {
          this.isAddAndEditPlayListShow = true;
          this.dialogType = 'a_dd';
        }
      }
      ,
      closePlayListAlert() {
        this.isAddAndEditPlayListShow = false;
        this.getList()
        
      }
      ,
      closePlayerAlert(n) {
        this.isPlayerDialogShow = false;
        if ( !n ) {
          this.getList()
        }
      }
      ,
      closeSSAlert() {
        this.isSSDialogShow = false;
        this.getList();
      },
      closePHASAlert() {
        this.isPushHistoryAndStatusShow = false;
        // this.getList();
      }
      ,
      getDate(val) {
        this.defaultAndSearchInfo.PlayListStartDate = val[ 0 ];
        this.defaultAndSearchInfo.PlayListEndDate = val[ 1 ];
        this.getList()
      }
      ,
      formatter(row) {
        let date;
        date = row.PlayListStartDate + ' - ' + row.PlayListEndDate;
        return date
      }
      ,
      pushBtnTxtFormatter(i, row) {
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(Date.parse(dateStr)),
          playDate = new Date(Date.parse(row.PlayListEndDate));
        
        if ( row.ItemCount == 0 && playDate >= now && row.Validity ) {
          return '无播放项';
        }
        else if ( playDate < now && row.Validity && row.ItemCount > 0 ) {
          return '已过期'
        }
        else if ( !row.Validity && row.ItemCount > 0 && playDate >= now ) {
          return '已停用'
        }
        else if ( row.ItemCount == 0 && playDate < now && !row.Validity ) {
          return '已停用/已过期/无播放项'
        }
        else if ( row.ItemCount == 0 && playDate < now ) {
          return '已过期/无播放项'
        }
        else if ( !row.Validity && playDate < now ) {
          return '已停用/已过期'
        }
        else if ( row.ItemCount == 0 && playDate >= now && !row.Validity ) {
          return '已停用/无播放项'
        }
        else {
          return '推送设备选择';
        }
      }
      ,
      playItemSettingsTxtFormatter(i, row) {
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(Date.parse(dateStr)),
          playDate = new Date(Date.parse(row.PlayListEndDate));
        if ( playDate < now && row.Validity ) {
          return '已过期'
        } else if ( !row.Validity && playDate >= now ) {
          return '已停用'
        } else if ( !row.Validity && playDate < now ) {
          return '已停用/已过期'
        } else {
          return '播放项设置';
        }
      },
      pushDisabledFormatter(i, row) {
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(Date.parse(dateStr)),
          playDate = new Date(Date.parse(row.PlayListEndDate));
        return row.ItemCount == 0 || !row.Validity || playDate < now ? true : false
      }
      ,
      playItemSettingsDisabledFormatter(i, row) {
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(Date.parse(dateStr)),
          playDate = new Date(Date.parse(row.PlayListEndDate));
        return !row.Validity || playDate < now ? true : false
      },
      
      edit(i, row) {
        // console.log(i, row);
        this.dialogType = 'up_date';
        this.sendToDialog = {};
        var realIndex = this.currentPage > 1 ? i + ((this.currentPage - 1) * this.pagesize) : i;
        this.isAddAndEditPlayListShow = true;
        this.sendToDialog.PlayListName = this.list[ realIndex ].PlayListName;
        this.sendToDialog.PlayListStartDate = this.list[ realIndex ].PlayListStartDate;
        this.sendToDialog.PlayListEndDate = this.list[ realIndex ].PlayListEndDate;
        this.sendToDialog.PlayListType = this.list[ realIndex ].PlayListType;
        this.sendToDialog.PlayListDefault = this.list[ realIndex ].PlayListDefault;
        this.sendToDialog.ID = this.list[ realIndex ].ID;
        this.sendToDialog.EmployeeCode = this.list[ realIndex ].EmployeeCode;
      }
      ,
      pushDeviceSelect(i, row) {
        // console.log(i, row);
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(dateStr).getTime();
        if ( new Date(row.PlayListEndDate).getTime() < now ) {
          this.$message.error('时效已过，无法推送')
        } else {
          this.isPlayerDialogShow = true;
          this.playListId = row.ID;
        }
      },
      screenSettings(i, row) {
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          dateStr = year + '-' + month + '-' + day,
          now = new Date(dateStr).getTime();
        if ( new Date(row.PlayListEndDate).getTime() < now ) {
          this.$message.error('时效已过，无法设置屏幕')
        } else {
          this.isSSDialogShow = true;
          this.playListId = row.ID;
        }
      }
      ,
      pushHistoryAlertShow(index, row) {
        this.isPushHistoryAndStatusShow = true;
        this.playListID = row.ID;
      }
    }
    ,
    
    mounted() {
      this.getList();
      // this.getHistoryList()
    }
  }
</script>

<style scoped lang="stylus">
  .activeName
    filter()
    width: 300px
</style>
