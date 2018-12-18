<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
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
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              v-loading="listLoading"
    
    >
      <el-table-column
        label="审批"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <!--<el-button type="danger" icon="el-icon-delete" circle size="small"-->
          <!--@click="deleteItem(scope.$index,scope.row)">-->
          <!--</el-button>-->
          <el-button size="small"
                     icon="el-icon-edit"
                     circle
                     @click="getData(scope.$index,scope.row)"
          ></el-button>
        
        </template>
      </el-table-column>
    
      <el-table-column
        label="活动名称"
        prop="ActivityName"
        width="220"
        align="center"
      >
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
        label="活动编号"
        prop="ActivityCode"
        width="180"
        align="center"
      >
      </el-table-column>
      <!-- <el-table-column
		 label="CRM门店"
		 prop="CRMStoreCode"
		 width="180"
		 :show-overflow-tooltip="true"
		 align="center"
	   >
	   </el-table-column>-->
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
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
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
        list: [],
        listLoading: true,
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
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          ActivityCode: '',
        }
        
        // isUpdateDate:false
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
      tagType(val) {
        let type;
        if ( !val ) {
          return type = 'info'
        } else if ( val === 1 ) {
          return type = 'warning'
        } else if ( val === 2 ) {
          return type = 'success'
        } else if ( val === 3 ) {
          return type = ''
        }
        
      },
      tagText(val) {
        let text;
        if ( !val ) {
          return text = '未通过'
        } else if ( val === 1 ) {
          return text = '待审核'
        } else if ( val === 2 ) {
          return text = '已通过'
        } else if ( val === 3 ) {
          return text = '已完成'
    
        }
      },
      getCurrentPage(currentPage) {
        this.currentPage = currentPage
      },
      getPageSize(pageSize) {
        this.pageSize = pageSize
      }
      ,
      addBtn({row, column, rowIndex, columnIndex},noAdd) {
        return this.$myFunctions.tableHeadReset({row, column, rowIndex, columnIndex},noAdd);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getList(update) {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/ActicityOnload', {
          ActivityName: this.keyWord,
          ApprovalStataus:1
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
              if ( update && update === 'update' || !update ) {
                storage.setItem('activityList', JSON.stringify(that.list))
              }
            }
            that.listLoading = false;
            that.isListChange = true;
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
      , getData(index, row) {
        this.isAlertShow = true;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
    
        /*    this.$axios.post('/Home/ActivityStepOnload',{
			  type:'next',
			  ActivityCode:row.ActivityCode
			}).then(data=>{
			  console.log(data);
			})*/
    
        this.sendDialogData.ActivityName = this.list[ realIndex ].ActivityName;
        this.sendDialogData.ActivityCode = this.list[ realIndex ].ActivityCode;
        this.sendDialogData.ID = row.ID;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
        // this.sendDialogData.ActivityCode = this.list[ realIndex ].ActivityCode;
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
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData));
        this.sendDialogData.ActivityCode = row.ActivityCode;
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/ChannelSave', {
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
      
    },
  }
</script>

<style scoped lang="stylus">

</style>
