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
        label="组织名称"
        prop="OrganizationName"
        width="390"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="组织简称"
        prop="OrganizationAbb"
        width="230"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="组织负责人"
        prop="LeaderName"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="上级组织"
        prop="ParentOrgName"
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
        dataLoading: true,
        isListChange: false,
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
          OrganizationName: '',
          OrganizationAbb: '',
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
        that.$axios.post('/Organization/UpdateValidity', {
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
        that.$axios.post('/Organization/GetOrganizationList', {
          PageIndex: 1,
          PageSize: 1000,
          Validity: that.Validity,
          OrganizationName: this.keyWord
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.list = data.data.Content.DataList;
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
          this.getList();
        }
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.OrganizationName = this.list[ realIndex ].OrganizationName;
        this.sendDialogData.OrganizationAbb = this.list[ realIndex ].OrganizationAbb;
        this.sendDialogData.ParentOrgName = this.list[ realIndex ].ParentOrgName;
        this.sendDialogData.ParentOrgID = this.list[ realIndex ].ParentID;
        console.log(this.sendDialogData.serviceTime);
        this.sendDialogData.ID = row.ID;
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #contentListWrapper >>> .el-input__inner
    inputNoBorder()
  
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
