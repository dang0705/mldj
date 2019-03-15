<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.keyWord"
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
      <date-picker
        @getDate="getDate"
        :allDate="true"
        :isSearch="true"
      ></date-picker>
      
      <el-select
        v-model="searchData.ApprovalStataus"
        clearable
        @change="getList"
      >
        <el-option
          v-for="(item,index) in ApprovalStatausList"
          :value="item.value"
          :label="item.label"
          :key="index"
        ></el-option>
      </el-select>
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="listLoading"
    
    >
      <el-table-column
        type="expand"
        label="展开"
        width="80"
      >
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item label="活动编号：">
              <span>{{props.row.ActivityCode}}</span>
            </el-form-item>
            <!--<el-form-item label="CRM门店">
              <span>{{props.row.CRMStoreCode}}</span>
            </el-form-item>-->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <!--   <el-button type="danger" icon="el-icon-delete" circle size="small"
						@click="deleteItem(scope.$index,scope.row)">
			 </el-button>-->
          <el-button type="danger"
                     icon="el-icon-error"
                     circle size="small"
                     title="停止活动"
                     v-if="scope.row.ApprovalStataus!==3"
                     @click="deleteItem(scope.row.ActivityCode)">
          </el-button>
          <el-button
            size="small"
            type="success"
            title="活动详情"
            v-if="scope.row.ApprovalStataus===2||scope.row.ApprovalStataus===1"
            icon="el-icon-view"
            circle
            @click="examine(scope.$index,scope.row)"
          ></el-button>
          
          <el-button size="small"
                     title="编辑活动"
                     v-if="!scope.row.ApprovalStataus"
                     icon="el-icon-edit" circle
                     @click="getData(scope.$index,scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      
      <el-table-column
        label="活动名称"
        prop="ActivityName"
        width="340"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="活动状态"
        prop="ActivityStoreCode"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.ApprovalStataus)" v-text="tagText(scope.row.ApprovalStataus)"></el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="活动负责人"
        prop="EmployeeName"
        width="220"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      
      <el-table-column
        label="活动时间"
        :formatter="activityTime"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      
      <el-table-column label="活动申请">
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
                  :deviceList="deviceList"
                  :editData="sendDialogData">
    
    </alert-dialog>
    
    <examine-dialog
      :editData="sendDialogData"
      :isAlertShow.sync="isExamineShow"
      @closeExamine="closeExamine"
    >
    </examine-dialog>
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import examineDialog from '../dialog/examineDialog'
  import pagination from '@/component/common/pagination/pagination'
  import datePicker from '@/component/common/dateSelect/dateSelect'
  
  const storage = window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      examineDialog,
      pagination,
      datePicker
    },
    data() {
      return {
        list: [],
        listLoading: true,
        isListChange: false,
        isExamineShow: false,
        dialogType: 'up_date',
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
        searchData: {
          keyWord: '',
          startDate: '',
          endDate: '',
          ApprovalStataus: ''
        },
        ApprovalStatausList: [
          {label: '全部', value: ''},
          {label: '未通过', value: 0},
          {label: '待审核', value: 1},
          {label: '已通过', value: 2},
          {label: '已完成', value: 3},
        ],
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        deviceList: [],
        sendDialogData: {
          ActivityCode: '',
          CRMStoreCode: '',
          ActivityName: '',
          ID: '',
        }
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getList();
      this.getDevice()
    },
    methods: {
      
      tagType(val) {
        let type;
        if ( !val ) {
          type = 'info'
        } else if ( val === 1 ) {
          type = 'warning'
        } else if ( val === 2 ) {
          type = 'success'
        } else if ( val === 3 ) {
          type = ''
        }
        return type
      },
      tagText(val) {
        let text;
        if ( !val ) {
          text = '未通过'
        } else if ( val === 1 ) {
          text = '待审核'
        } else if ( val === 2 ) {
          text = '已通过'
        } else if ( val === 3 ) {
          text = '已完成'
        }
        return text
      },
      getDate(val) {
        if ( val ) {
          this.searchData.startDate = val[ 0 ];
          this.searchData.endDate = val[ 1 ];
        } else {
          this.searchData.startDate = this.searchData.endDate = ''
        }
        this.getList()
        
      },
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
        if ( column.label === '活动申请' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.sendDialogData);
        }
      },
      getList(update) {
        let that = this;
        
        that.listLoading = true;
        that.$axios.post('/Home/ActicityOnload', {
          ActivityName: this.searchData.keyWord,
          OpenStartDate: this.searchData.startDate,
          OpenEndDate: this.searchData.endDate,
          ApprovalStataus: this.searchData.ApprovalStataus,
          ActivityEmployeeCode: storage.getItem('userName')
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              console.log(data);
              that.list = data.data.Content;
              storage.setItem('activityList', JSON.stringify(that.list));
              that.listLoading = false;
              that.isListChange = true;
            }
          })
        
      }
      
      ,
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList('update')
          this.getDevice()
        }
      }
      ,
      closeExamine() {
        this.isExamineShow = false
      },
      examine(index, row) {
        this.isExamineShow = true;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.sendDialogData.ActivityName = this.list[ realIndex ].ActivityName;
        this.sendDialogData.ActivityCode = this.list[ realIndex ].ActivityCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
        this.sendDialogData.OpenStartDate = this.list[ realIndex ].OpenStartDate;
        this.sendDialogData.OpenEndDate = this.list[ realIndex ].OpenEndDate;
        this.sendDialogData.ActivityAdd = this.list[ realIndex ].ActivityAdd;
        this.sendDialogData.ActivityStoreCode = this.list[ realIndex ].ActivityStoreCode;
        this.sendDialogData.realStoreCode = this.list[ realIndex ].StoreCode;
        this.sendDialogData.StoreValidity = this.list[ realIndex ].StoreValidity;
        this.sendDialogData.ActivityEmployeeCode = this.list[ realIndex ].ActivityEmployeeCode;
        this.sendDialogData.DeviceList = this.list[ realIndex ].DeviceList;
        this.sendDialogData.ProductList = this.list[ realIndex ].ProductList;
        this.sendDialogData.ActivityDec = this.list[ realIndex ].ActivityDec;
        this.sendDialogData.DogType = 'up_date';
        this.sendDialogData.ID = row.ID;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData));
      },
      getData(index, row) {
        this.isAlertShow = true;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.sendDialogData.ActivityName = this.list[ realIndex ].ActivityName;
        this.sendDialogData.ActivityCode = this.list[ realIndex ].ActivityCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        this.sendDialogData.OpenStartDate = this.list[ realIndex ].OpenStartDate;
        this.sendDialogData.OpenEndDate = this.list[ realIndex ].OpenEndDate;
        this.sendDialogData.ActivityAdd = this.list[ realIndex ].ActivityAdd;
        this.sendDialogData.ActivityStoreCode = this.list[ realIndex ].ActivityStoreCode;
        this.sendDialogData.realStoreCode = this.list[ realIndex ].StoreCode;
        this.sendDialogData.StoreValidity = this.list[ realIndex ].StoreValidity;
        this.sendDialogData.ActivityEmployeeCode = this.list[ realIndex ].ActivityEmployeeCode;
        this.sendDialogData.DeviceList = this.list[ realIndex ].DeviceList;
        this.sendDialogData.ProductList = this.list[ realIndex ].ProductList;
        this.sendDialogData.ActivityDec = this.list[ realIndex ].ActivityDec;
        this.sendDialogData.DogType = 'up_date';
        this.sendDialogData.ID = row.ID;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData));
      }
      ,
      deleteItem(row) {
        let that = this;
        this.$confirm('此操作将停止该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/stopActivity', {
              ActivityCode: row,
            })
              .then(() => {
                that.getList()
              })
          })
          .catch(() => {
          
          })
        
      }
      ,
      activityTime(row, index) {
        return row.OpenStartDate + '--' + row.OpenEndDate
      }
      ,
      getDevice() {
        let that = this;
        that.$axios.post('/Home/OnloadEmployeeDeviceList', {
          DeviceStatus: 'Activity'
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.deviceList = data.data.Content;
            }
          })
      }
    },
  }
</script>

<style scoped lang="stylus">

</style>
