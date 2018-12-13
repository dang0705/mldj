<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
        autocomplete="on"
        placeholder="用户姓名"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <el-input
        autofocus
        class="input activeName"
        v-model="email"
        autocomplete="on"
        placeholder="邮箱"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <el-input
        autofocus
        class="input activeName"
        v-model="mobileNumber"
        autocomplete="on"
        placeholder="手机号码"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <el-select v-model="Validity" placeholder="请选择"
                 @change="change"
      >
        <el-option
          v-for="(item,i) in keySelect"
          :key="i"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="dataLoading"
    >
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-switch
            v-model="scope.row.Validity"
            :active-value="1"
            :inactive-value="0"
            @change=switchChange(scope.$index,scope.row)
          >
          </el-switch>
        </template>
      </el-table-column>
      
      <el-table-column
        label="用户账号/手机号"
        prop="Phone"
        width="180"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="EmployeeName"
        width="220"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="邮箱"
        prop="Email"
        width="400"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="角色"
        prop="RoleName"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      
      <el-table-column label="增加+"
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
    
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import pagination from '@/component/common/pagination/pagination'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        list: [],
        isListChange: false,
        email: '',
        mobileNumber: '',
        dataLoading: true,
        keySelect: [
          {value: -1, label: '全部'},
          {value: 1, label: '有效'},
          {value: 0, label: '无效'}
        ],
        Validity: -1,
        isListEmpty: true,
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
          Phone: '',
          EmployeeName: '',
          LeaderName: '',
          ParentOrgName: '',
          serviceTime: [],
          ID: '',
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
      change() {
        this.getList()
      },
      formatTime(row, column, cellValue, index) {
        return cellValue.split(' ')[ 0 ] + ' - ' + row.EndTime.split(' ')[ 0 ]
      },
      switchChange(index, row) {
        let that = this;
        console.log(index, row);
        that.$axios.post('/Account/UpdateValidity', {
          Validity: row.Validity,
          ID: row.ID
        })
        
      },
      addBtn({row, column, rowIndex, columnIndex}) {
        return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        console.log(column);
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getList() {
        let that = this;
        that.dataLoading = true;
        that.$axios.post('/Account/GetEmployeeList', {
          PageIndex: 1,
          PageSize: 1000,
          EmployeeName: that.keyWord,
          Email: that.email,
          Phone: that.mobileNumber,
          Validity: that.Validity,
        })
          .then(data => {
            that.list = data.data.Content.DataList;
            that.dataLoading = false;
            that.isListChange = true;
          })
      }
      ,
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList();
        }
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.Phone = this.list[ realIndex ].Phone;
        this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
        this.sendDialogData.Email = this.list[ realIndex ].Email;
        this.sendDialogData.ParentOrgName = this.list[ realIndex ].ParentOrgName;
        this.sendDialogData.ParentOrgID = this.list[ realIndex ].ParentID;
        this.sendDialogData.roleID = 0;
        this.sendDialogData.OrganizationID = 0;
        this.sendDialogData.IsOrgLeader = 0;
        this.sendDialogData.ID = row.ID;
        this.sendDialogData=JSON.parse(JSON.stringify(this.sendDialogData))
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
