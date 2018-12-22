<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input"
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
<!--      <citySelect class="citySelect" :isInAlert="!isAlertShow" @provincesAndCities="cityFilter"
                  :forSearch="true"></citySelect>-->
    </div>
    
    <el-table width="100%"
              max-height="900"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="dataLoading"
    >
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
        width="1000"
      >
      </el-table-column>
      
      <el-table-column
        label="增加+"
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
  // import citySelect from '@/component/common/citySelect/citySelect'
  import pagination from '@/component/common/pagination/pagination'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      // citySelect,
      pagination
    },
    data() {
      return {
        list: [],
        dataLoading: true,
        isListChange: false,
        dialogType: 'up_date',
        switchData: '',
        headerStyle: {
          height: '100%',
          color: '#000',
          background: '#ccc'
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
      addBtn({row, column, rowIndex, columnIndex}) {
        return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
        }
      },
      getList(city) {
        let that = this;
        that.list = [];
        that.$axios.post('/Home/OnloadDeviceLabelList', {
          DeviceName: this.keyWord,
          CityCode: city ? city[ 1 ] : ''
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
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
      , getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.EmployeeCode = this.list[ realIndex ].EmployeeCode;
        this.sendDialogData.LabelName = this.list[ realIndex ].LabelName;
        this.sendDialogData.Address = this.list[ realIndex ].Address;
        this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
        this.sendDialogData.ID = row.ID;
      }
      , switchChange(index, row) {
        console.log(row);
        let that = this;
        that.$axios.post('/Home/DeviceLabelSave', {
          DogType: 'd_elete',
          EmployeeCode: window.localStorage.getItem('userName'),
          LabelName: row.LabelName,
          Validity: row.Validity,
          ID: row.ID
        })
          .then(() => {
            that.getList();
          })
      }
      ,
      cityFilter(city) {
        this.getList(city);
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
