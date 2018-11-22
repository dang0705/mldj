<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
        autocomplete="on"
        placeholder="角色名称"
        @keyup.enter.native="filter"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="filter"
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
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="tableLoading"
    >
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" title="编辑" icon="el-icon-edit" circle
                     @click="getData(scope.$index,scope.row)"></el-button>
          <el-button size="small" title="权限设置" icon="el-icon-setting" circle @click="rootConfig(scope.row)"></el-button>
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
        label="角色名称"
        prop="RoleName"
        width="970"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column label="增加+"
                       align="center"
      >
      </el-table-column>
    
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :editData="sendDialogData"></alert-dialog>
    
    <root-dialog
      :isRootAlertShow.sync="isRootAlertShow"
      :configId="configId"
      :roleName="roleName"
      @closeAlert="closeRootAlert"
    ></root-dialog>
  
  </div>
</template>

<script>
  import axios from 'axios'
  import alertDialog from '../dialog/dialog'
  import rootDialog from '../dialog/rootConfigDialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      rootDialog
      // filter
    },
    data() {
      return {
        list: [],
        tableLoading: true,
        roleName:'',
        dialogType: '',
        keySelect: [
          {value: -1, label: '全部'},
          {value: 1, label: '有效'},
          {value: 0, label: '无效'}
        ],
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
        keyWord: '',
        currentPage: 1, //初始页
        pagesize: 5,    //    每页的数据
        isAlertShow: false,
        isRootAlertShow: false,
        configId:0,
        id: '',
        sendDialogData: {
          RoleName: '',
          ID: '',
        }
      }
    },
    mounted() {
      this.getApkList()
    },
    methods: {
      change(data) {
        this.getApkList()
      },
      formatTime(row, column, cellValue, index) {
        return cellValue.split(' ')[ 0 ] + ' - ' + row.EndTime.split(' ')[ 0 ]
      },
      switchChange(index, row) {
        let that = this;
        console.log(index, row);
        axios.post('/api/OrganizationalRole/UpdateValidity', {
          Validity: row.Validity,
          ID: row.ID
        })
          .then(data => {
          })
          .catch(e => {
            console.log(e);
          })
      },
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
      },
      add(column, event) {
        console.log(column);
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getApkList(filter) {
        let that = this;
        // that.list = [];
        that.tableLoading = true;
        axios.post('/api/OrganizationalRole/GetRoleList', {
          PageIndex: 1,
          PageSize: 1000,
          Validity: that.Validity,
          RoleName: filter ? this.keyWord : ''
        })
          .then(data => {
            console.log(data);
            const res = data.data.Content.DataList;
            that.list = res ? res : [];
            that.tableLoading = false;
          })
      }
      ,
      closeAlert() {
        this.isAlertShow = false;
        this.getApkList();
      }
      ,
      closeRootAlert() {
        this.isRootAlertShow = false;
      }
      ,
      rootConfig(row) {
        console.log(row);
        this.configId=row.ID;
        this.roleName=row.RoleName;
        this.isRootAlertShow = true;
      },
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        this.isAlertShow = true;
        this.dialogType = 'up_date';
        this.sendDialogData.RoleName = this.list[ realIndex ].RoleName;
        this.sendDialogData.ID = row.ID;
      }
      ,
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        // console.log(this.currentPage)  //点击第几页
      }
      ,
      filter() {
        this.getApkList('filter')
      }
      
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #contentListWrapper >>> .el-input__inner
    inputNoBorder()
  
  #contentListWrapper >>> .el-button + .el-button
    margin-left 0
  
  #contentListWrapper >>> .el-table
    box-shadow 0 5px 8px rgba(0, 0, 0, .2)
    margin-bottom: 40px
  
  #contentListWrapper >>> .el-table__body-wrapper, #contentListWrapper >>> .el-table__body
    width: 100% !important
  
  #contentListWrapper >>> .el-table__row
    td
      text-align center
  
  #contentListWrapper
    listStyle()
    .el-icon-search
      filterIcon()
    li
      height $eachListHeight
      background white
      border-bottom 3px solid #ccc
  
  .el-table__body-wrapper
    width: 100%
  
  .activeName
    filter()
    width: 600px
</style>
