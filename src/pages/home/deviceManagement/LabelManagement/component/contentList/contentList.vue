<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input"
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
      <citySelect class="citySelect" :isInAlert="!isAlertShow" @provincesAndCities="cityFilter"></citySelect>
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              @selection-change="handleSelectionChange"
    >
      <!--    <el-table-column
			type="selection"
			width="40"
			class="selection"
			prop='ID'
		  ></el-table-column>-->
      
      <el-table-column
        width="100"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small"
                     icon="el-icon-edit"
                     circle
                     @click="getData(scope.$index,scope.row)">
          </el-button>
          
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
        prop="LabelName"
        label="标签名称"
        align="center"
        width="980"
      >
      </el-table-column>
 <!--     <el-table-column
        prop="EmployeeName"
        label="设备所属人"
        align="center"
        width="140"
      >
      </el-table-column>-->
      
      <el-table-column
        label="增加+"
        align="center"
        width="140"
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
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import axios from 'axios'
  import citySelect from '@/components/common/citySelect/citySelect'
  
  import alertDialog from '../dialog/dialog'
  export default {
    name: "contentList",
    components: {
      alertDialog,
      citySelect
      // filter
    },
    data() {
      return {
        list: [],
        isListEmpty: true,
        dialogType: 'up_date',
        switchData: '',
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
          LabelName: '',
          EmployeeCode: '',
          AddEmployeeCode: '',
          ProvinceName: '',
          CityName: '',
          Address: '',
          ID: '',
        }
      }
    },
    mounted() {
      if ( !this.list.length ) {
        this.getApkList()
      }
    },
    methods: {
      
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      handleSelectionChange(val) {
        console.log(val);
      },
      
      getApkList() {
        let that = this;
        that.list = [];
        axios.post('/api/Home/OnloadDeviceLabelList')
          .then(data => {
            console.log(data);
            const res = data.data.Content;
            if ( !res || !res.length || res.length ) {
              that.isListEmpty = false
            }
            that.list = res ? data.data.Content : [];
            that.$store.state.isDeviceLabelUpdateData = false;
          })
      }
      
      ,
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false
      }
      , getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        console.log(row);
        this.isAlertShow = true;
        this.sendDialogData.EmployeeCode = this.list[ realIndex ].EmployeeCode;
        this.sendDialogData.LabelName = this.list[ realIndex ].LabelName;
        this.sendDialogData.Address = this.list[ realIndex ].Address;
        // this.sendDialogData.ProvinceCode = this.list[ realIndex ].ProvinceCode;
        // this.sendDialogData.ProvinceName = this.list[ realIndex ].ProvinceName ? this.list[ realIndex ].ProvinceName : '省份';
        // this.sendDialogData.CityCode = this.list[ realIndex ].CityCode;
        // this.sendDialogData.CityName = this.list[ realIndex ].CityName ? this.list[ realIndex ].CityName : '市';
        this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
        this.sendDialogData.ID = row.ID;
      }
      , switchChange(index, row) {
        let that = this;
        console.log(index, row);
        // var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        axios.post('/api/Home/DeviceLabelSave', {
          DogType: 'd_elete',
          EmployeeCode: row.EmployeeCode,
          Validity: row.Validity,
          ID: row.ID
        })
          .then(data => {
            axios.post('/api/Home/OnloadDeviceLabelList', {
              DeviceName: this.keyWord
            })
              .then(res => {
                that.list = res.data.Content;
                that.$store.state.isDeviceLabelUpdateData = false;
              })
          })
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
        let that = this;
        axios.post('/api/Home/OnloadDeviceLabelList', {
          DeviceName: this.keyWord
        })
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isDeviceLabelUpdateData = false;
          })
      },
      cityFilter(city) {
        axios.post('/api/Home/OnloadDeviceLabelList', {
          CityCode: city[ 1 ]
        })
          .then(data => {
            console.log(data);
          })
      }
      
    },
    watch: {
      '$store.state.isDeviceLabelUpdateData': function () {
        if ( this.$store.state.isDeviceLabelUpdateData === true ) {
          this.getApkList()
        }
      },
      
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
  
  /*  #contentListWrapper >>> .el-table__header-wrapper
	  display none*/
  
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
  
  .filterComponents
    .input, .citySelect
      width: 40%
      margin-right: 20px
      display inline-block
</style>
