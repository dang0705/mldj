<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      
      <el-input
        autofocus
        class="input activeName"
        v-model="keyWord"
        autocomplete="on"
        placeholder="名称"
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
        label="公司名称"
        prop="CompanyName"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="开户人"
        prop="AccountName"
        width="130"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="开户银行"
        prop="BankName"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="银行卡号"
        prop="BankCard"
        width="200"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="服务时间"
        :formatter="formatTime"
        prop="BeginTime"
        width="240"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column label="增加+"
                       align="center"
      >
      </el-table-column>
    
    </el-table>
    <i v-show="isListEmpty" class="listLoading el-icon-loading"></i>
    
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
  
  </div>
</template>

<script>
  import axios from 'axios'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      // filter
    },
    data() {
      return {
        list: [],
        keySelect: [
          {value: 1, label: '有效'},
          {value: 0, label: '无效'},
          {value: -1, label: '全部'}
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
        pagesize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          CompanyName: '',
          AccountName: '',
          BankName: '',
          BankCard: '',
          serviceTime: [],
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
        axios.post('/api/Company/UpdateValidity', {
          Validity: row.Validity,
          ID: row.ID
        })
          .then(data => {
            that.getApkList()
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
        axios.post('/api/Company/GetComanyList', {
          PageIndex: 1,
          PageSize: 1000,
          Validity: that.Validity,
          CompanyName: filter ? this.keyWord : ''
        })
          .then(data => {
            const res = data.data.Content.DataList;
            if ( !res || !res.length || res.length ) {
              that.isListEmpty = false
            }
            that.list = res ? res : [];
            // that.$store.state.isCompanyUpdateData = false;
          })
      }
      ,
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        this.getApkList();
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        this.isAlertShow = true;
        this.sendDialogData.CompanyName = this.list[ realIndex ].CompanyName;
        this.sendDialogData.AccountName = this.list[ realIndex ].AccountName;
        this.sendDialogData.BankName = this.list[ realIndex ].BankName;
        this.sendDialogData.BankCard = this.list[ realIndex ].BankCard;
        this.sendDialogData.serviceTime = [ this.list[ realIndex ].BeginTime, this.list[ realIndex ].EndTime ];
        console.log(this.sendDialogData.serviceTime);
        // this.sendDialogData.EndTime = this.list[ realIndex ].EndTime;
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
