<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <data-picker
        @getDate="getDate"
      ></data-picker>
      <el-input
        autofocus
        class="input activeName"
        v-model="searchInfo.PlayListName"
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
        v-model="searchInfo.Validity"
        @change="getList"
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
    
    >
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button circle icon="el-icon-edit" size="small" @click="edit(scope.$index,scope.row)"></el-button>
          <el-switch
            v-model="scope.row.Validity"
            @change="switchChange"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="播放列表名称" align="center" width="140" prop="PlayListName"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="创建日期" align="center" width="180" prop="DateCreated"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="播放日期" align="center" width="220" :formatter="formatter"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="推送操作" align="center" width="140"
                       :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button type="success" round size="small" @click="">推送设备选择</el-button>
        </template>
      </el-table-column>
      <el-table-column label="推送历史" align="center" width="160"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="屏幕播放项设置" align="center" width="180"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="增加+" align="center">
      </el-table-column>
    </el-table>
    <i v-show="isListEmpty"></i>
    <el-pagination
      :page-sizes="[5,10,20,40]"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="list.length"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    
    <add-and-edit-playList
      :isAddAndEditPlayListShow.sync="isAddAndEditPlayListShow"
      :dialogType="dialogType"
      @closePlayListAlert="closePlayListAlert"
      @addOrEditSuccess="addOrEditSuccess"
      :editData="searchInfo"
    >
    </add-and-edit-playList>
    
    <player-dialog
      :isPlayerDialogShow.sync="isPlayerDialogShow"

    >
    
    </player-dialog>
  </div>
</template>

<script>
  import dataPicker from '@/components/common/dateSelect/dateSelect'
  import addAndEditPlayList from '../dialog/addAndEditPlayList'
  import playerDialog from '../dialog/playerDialog'
  import pushHistoryAndStatus from '../dialog/pushHistoryAndStatus'
  import playItemSelect from '../dialog/playItemSelect'
  
  const storage = window.localStorage;
  
  export default {
    name: "contentList",
    components: {
      dataPicker,
      addAndEditPlayList,
      playerDialog,
      pushHistoryAndStatus,
      playItemSelect
    },
    data() {
      return {
        list: [],
        isAddAndEditPlayListShow: false,    //显示隐藏新增修改播放列表弹框
        isPlayerDialogShow: false,          //显示隐藏推送操作弹框
        isPushHistoryAndStatusShow: false,  //显示隐藏推送历史弹框
        isPlayItemSelectShow: false,        //显示隐藏屏幕播放项弹框
        isListEmpty: false,
        dialogType: 'up_date',
        statusList: [
          {value: '', label: '列表状态'},
          {value: 1, label: '启用'},
          {value: 2, label: '停用'},
        ],
        searchInfo: {
          PageIndex: 1,
          PageSize: 1000,
          PlayListName: '',
          Validity: '',
          PlayListStartDate: '',
          PlayListEndDate: '',
          EmployeeCode: storage.getItem('userName')
        },
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
        const that = this;
        that.$axios.post('/api/PlayManage/EmployeePlayListList', that.searchInfo)
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              const res = data.data.Content.Rows;
              if ( !res || !res.length || res.length ) {
                that.isListEmpty = false
              }
              that.list = res || [];
            } else {
              that.list = [];
              that.isListEmpty = false
            }
          })
      }
      ,
      handleSizeChange(size) {
        this.pagesize = size
      }
      ,
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
      }
      ,
      switchChange() {
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
        this.isAddAndEditPlayListShow = false
      }
      ,
      addOrEditSuccess() {
        this.getList()
      }
      ,
      getDate(val) {
        this.searchInfo.PlayListStartDate = val[ 0 ];
        this.searchInfo.PlayListEndDate = val[ 1 ];
        
      }
      ,
      formatter(row) {
        console.log(row);
        let date;
        date = row.PlayListStartDate + ' - ' + row.PlayListEndDate;
        return date
      }
      ,
      edit(i,row){
        // console.log(i, row);
        var realIndex = this.currentPage > 1 ? i + ((this.currentPage - 1) * this.pagesize) : i;
        this.isAddAndEditPlayListShow = true;
        this.searchInfo.PlayListName = this.list[ realIndex ].PlayListName;
        this.searchInfo.PlayListStartDate = this.list[ realIndex ].PlayListStartDate;
        this.searchInfo.PlayListEndDate = this.list[ realIndex ].PlayListEndDate;
        this.dialogType='up_date';
      }
    }
    ,
    mounted() {
      this.getList()
    }
  }
</script>

<style scoped lang="stylus">
  #contentListWrapper
    width: 1220px !important
  
  .activeName
    filter()
    width: 300px
</style>
