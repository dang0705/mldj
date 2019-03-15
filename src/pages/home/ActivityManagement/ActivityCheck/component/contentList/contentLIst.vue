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
            <el-form-item label="CRM门店">
              <span>{{props.row.CRMStoreCode}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="查看"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <!--   <el-button type="danger" icon="el-icon-delete" circle size="small"
						@click="deleteItem(scope.$index,scope.row)">
			 </el-button>-->
          
          <el-button
            size="small"
            type="success"
            icon="el-icon-view"
            circle
            @click="examine(scope.$index,scope.row)"
          ></el-button>
        
        </template>
      </el-table-column>
      
      
      <el-table-column
        label="活动名称"
        prop="ActivityName"
        width="240"
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
        :show-overflow-tooltip="true"
        align="center"
      >
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
        isExamineShow: false,
        isListChange: false,
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
      this.getList()
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
      addBtn({row, column, rowIndex, columnIndex}, noAdd) {
        return this.$myFunctions.tableHeadReset({row, column, rowIndex, columnIndex}, noAdd);
      },
      
      getList() {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/ActicityOnload', {
          ActivityName: this.searchData.keyWord,
          OpenStartDate: this.searchData.startDate,
          OpenEndDate: this.searchData.endDate,
          ApprovalStataus: this.searchData.ApprovalStataus,
          ActivityEmployeeCode: ''
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              console.log('data',data);
              that.list = data.data.Content;
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
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/ActivitySave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(() => {
                that.getList('update')
              })
          })
          .catch(() => {
          
          })
        
      }
      ,
      activityTime(row, index) {
        return row.OpenStartDate + '--' + row.OpenEndDate
      }
      
    }
    ,
  }
</script>

<style scoped lang="stylus">

</style>
