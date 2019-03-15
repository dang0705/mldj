<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
        autocomplete="on"
        placeholder="角色名称"
        @keyup.enter.native="getList"
      >
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList"
        >
        </i>
      </el-input>
      <!--<el-select v-model="Validity" placeholder="全部状态"
                 @change="getList"
      >
        <el-option
          v-for="(item,i) in keySelect"
          :key="i"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>-->
    </div>
    
    <el-table width="100%"
              empty-text
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
        <!--  <el-switch
            v-model="scope.row.Validity"
            :active-value="1"
            :inactive-value="0"
            @change=switchChange(scope.$index,scope.row)
          >
          </el-switch>-->
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
    
    <root-dialog
      :isRootAlertShow.sync="isRootAlertShow"
      :configId="configId"
      :roleName="roleName"
      @closeAlert="closeRootAlert"
    ></root-dialog>
  
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import rootDialog from '../dialog/rootConfigDialog'
  import pagination from '@/component/common/pagination/pagination'
  
  const storage = window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      rootDialog,
      pagination
    },
    data() {
      return {
        list: [],
        tableLoading: true,
        isListChange: false,
        roleName: '',
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
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        isRootAlertShow: false,
        configId: 0,
        id: '',
        sendDialogData: {
          RoleName: '',
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
      formatTime(row, column, cellValue, index) {
        return cellValue.split(' ')[ 0 ] + ' - ' + row.EndTime.split(' ')[ 0 ]
      },
      switchChange(index, row) {
        let that = this;
        console.log(index, row);
        that.$axios.post('/OrganizationalRole/UpdateValidity', {
          Validity: row.Validity,
          ID: row.ID
        }).then(() => {
          this.getList('update')
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
      getList(update) {
        let that = this;
        that.tableLoading = true;
        that.$axios.post('/OrganizationalRole/GetRoleList', {
          PageIndex: 1,
          PageSize: 1000,
          Validity: that.Validity,
          RoleName: that.keyWord
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.list = data.data.Content.DataList;
            }
            that.tableLoading = false;
            that.isListChange = true;
          })
      }
      ,
      closeAlert(n) {
        this.isAlertShow = false;
        if ( !n ) {
          this.getList('update');
        }
      }
      ,
      closeRootAlert() {
        this.isRootAlertShow = false;
      }
      ,
      rootConfig(row) {
        console.log(row);
        this.configId = row.ID;
        this.roleName = row.RoleName;
        this.isRootAlertShow = true;
      },
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.dialogType = 'up_date';
        this.sendDialogData.RoleName = this.list[ realIndex ].RoleName;
        this.sendDialogData.ID = row.ID;
      }
      ,
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        // console.log(this.currentPage)  //点击第几页
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
    getList()
    width: 600px
</style>
