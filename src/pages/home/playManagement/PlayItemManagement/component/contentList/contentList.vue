<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.PlayItemName"
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
      <el-select
        v-model="searchData.FileType"
        @change="getList"
      >
        <el-option
          v-for="(item,i) in typeList"
          :key="i"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      
      <el-select
        v-model="searchData.Validity"
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
              v-loading="dataLoading"
    >
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-switch
            v-model="scope.row.Validity"
            :active-value="1"
            :inactive-value="0"
            @change="switchChange(scope.$index,scope.row)"
          ></el-switch>
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
        width="325"
        :show-overflow-tooltip="true">
      </el-table-column>
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
    <pagination
      :tableList="list"
      :isListChange="isListChange"
      @currentPage="getCurrentPage"
      @pageSize="getPageSize"
      @defaultPaginationData="defaultPaginationData"
      @listChanged="listChanged"
    ></pagination>
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :id="id"
                  :editData="sendDialogData"></alert-dialog>
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import pagination from '@/component/common/pagination/pagination'
  const storage = window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        dataLoading:true,
        isSourceListShow: false,
        isListChange: false,
        FileType: '',
        list: [],
        dialogType: 'up_date',
        typeList: [
          {value: '', label: '全部'},
          {value: 0, label: '图片'},
          {value: 1, label: '视频'}
        ],
        statusList: [
          {value: '', label: '全部'},
          {value: 0, label: '停用'},
          {value: 1, label: '启用'}
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
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        searchData: {
          PlayItemName: '',
          FileType: '',
          Validity: ''
        },
        sendDialogData: {
          FileName: '',
          FileType: '',
          PlayItemName: '',
          Duration: '',//播放时长
          TimeLong: '',//素材时长
          OperationType: "up_date",
          FileId: '',
          EmployeeCode: storage.getItem('userName'),
          Navigation: '',
          sourceType: '',
          Validity: 1
        }
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
      }
      ,
      getList() {
        let that = this,
          params = '&PageSize=1000&PageIndex=1&PlayItemName=' + that.searchData.PlayItemName +
            '&Validity=' + that.searchData.Validity +
            '&EmployeeCode=' + that.sendDialogData.EmployeeCode +
            '&RoleId=' + storage.getItem('RoleID') +
            '&FileType=' + that.searchData.FileType;
        // that.list = [];
        that.$axios.post('/PlayManage/EmployeePlayItemList', params)
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.list = data.data.Content.Rows;
            }else {
              that.list=[]
            }
            that.dataLoading = false;
            that.isListChange = true;
          })
      }
      ,
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList()
        }
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.FileName = this.list[ realIndex ].FileName;
        this.sendDialogData.FileType = this.list[ realIndex ].FileType;
        this.sendDialogData.PlayItemUrl = this.list[ realIndex ].PlayItemUrl;
        this.sendDialogData.PlayItemName = this.list[ realIndex ].PlayItemName;
        this.sendDialogData.Duration = this.list[ realIndex ].Duration;
        this.sendDialogData.TimeLong = this.list[ realIndex ].TimeLong;
        this.sendDialogData.FileId = this.list[ realIndex ].FileId;
        this.sendDialogData.ID = row.ID;
      }
      ,
      switchChange(i, row) {
        console.log(i, row);
        let that=this;
        that.$axios.post('/PlayManage/EmployeePlayUpdateStatus', {
          EmployeeCode:that.sendDialogData.EmployeeCode,
          ID: row.ID,
          Validity:row.Validity
          
        })
          .then(data => {
            console.log(data);
          })
      }
      
    }
  }
</script>

<style scoped lang="stylus">

</style>
