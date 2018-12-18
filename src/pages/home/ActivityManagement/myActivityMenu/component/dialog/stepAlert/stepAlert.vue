<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      title="用户选择"
      :close-on-click-modal='false'
      align="center"
      width="800px"
      :before-close="handleClose"
    >
      <el-form
        :rules="rules"
        label-width="120px"
        align="center"
        :model="formData"
        inline
      >
        <el-form-item label="节点名称：">
          <el-input v-model="formData.ActivityStepName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="任务描述：">
          <el-input type="textarea" v-model="formData.ActivityStepTask" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
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
        
        <el-select v-model="roleId"
                   clearable
                   placeholder="角色名"
                   @change="getList"
        >
          <el-option
            v-for="(item,i) in roleList"
            :key="i"
            :label="item.RoleName"
            :value="item.ID">
          </el-option>
        </el-select>
      </div>
      
      <el-table width="100%"
                :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :header-row-style="headerStyle"
                :header-cell-class-name="addBtn"
                :row-style="rowStyle"
                v-loading="dataLoading"
      >
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio class="radio" v-model="formData.EmployeeCode"
                      :label="scope.row.ID.toString()"
                      @change="select(scope.row)"></el-radio>
          </template>
        </el-table-column>
        
        <el-table-column
          label="姓名"
          prop="EmployeeName"
          width="180"
          :show-overflow-tooltip="true"
          align="center"
        >
        </el-table-column>
        
        <el-table-column
          label="用户账号/手机号"
          prop="Phone"
          width="160"
          :show-overflow-tooltip="true"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="Email"
          width="200"
          :show-overflow-tooltip="true"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="角色"
          prop="RoleName"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload"
                   :disabled="!formData.ActivityStepName||!formData.EmployeeCode||!formData.ActivityStepTask">确 认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/component/common/pagination/pagination'
  
  const storage = window.localStorage;
  export default {
    name: "stepAlert",
    components: {
      pagination
    }
    ,
    props: {
      isAlertShow: {
        type: Boolean
      }
    }
    ,
    data() {
      return {
        list: [],
        roleList: [],
        formData: {
          ActivityStepName: '',
          ActivityStepTask: '',
          EmployeeCode: '',
          employName: '',
        },
        dataLoading: true,
        isListChange: false,
        keyWord: '',
        email: '',
        roleId: '',
        mobileNumber: '',
        Validity: -1,
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        rules: {}
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow ) {
          for ( var i in this.formData ) {
            this.formData[ i ] = ''
          }
        }
      }
    },
    methods: {
      select(val) {
        console.log(val);
        this.formData.employName = val.EmployeeName
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          console.log(this.formData);
          
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
        }
        
      },
      confirmUpload(obj) {
        this.$emit('getEmployee', JSON.parse(JSON.stringify(this.formData)));
        this.handleClose(obj);
        console.log(this.formData);
        
      }
      ,
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
      getList(update) {
        let that = this;
        that.dataLoading = true;
        if ( storage.getItem('employeeList') && !update ) {
          that.list = JSON.parse(storage.getItem('employeeList')).filter((item, index, arr) => {
            return item.Validity
          });
          that.dataLoading = false;
          that.isListChange = true;
        } else {
          that.$axios.post('/Account/GetEmployeeList', {
            PageIndex: 1,
            PageSize: 1000,
            EmployeeName: that.keyWord,
            Email: that.email,
            Phone: that.mobileNumber,
            Validity: 1,
            RoleId: that.roleId
          })
            .then(data => {
              if ( data.data.state === 1 ) {
                that.list = data.data.Content.DataList;
              }else {
                that.$message.error(data.data.msg)
              }
              that.dataLoading = false;
              that.isListChange = true;
            })
        }
      }
      ,
      getRoleList() {
        const that = this;
        if ( storage.getItem('roleList') ) {
          that.roleList = JSON.parse(storage.getItem('roleList')).filter((item, index, arr) => {
            return item.Validity
          })
          console.log(that.roleList);
        } else {
          that.$axios.post('/OrganizationalRole/GetRoleList', {
            PageIndex: 1,
            PageSize: 1000,
            Validity: 1
          }).then(data => {
            that.roleList = data.data.Content.DataList;
          })
        }
      }
    }
    ,
    mounted() {
      this.getList();
      this.getRoleList()
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-radio__label
    display none
  
  .dialogWrapper >>> .filterComponents
    width auto !important
    
    > div
      width 20% !important
</style>
