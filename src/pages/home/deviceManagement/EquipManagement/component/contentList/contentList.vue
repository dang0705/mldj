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
      <citySelect class="citySelect"
                  :isInAlert="!isAlertShow"
                  :forSearch="true"
                  @provincesAndCities="cityFilter">
      </citySelect>
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="dataLoading"
    >
      <el-table-column
        type="expand"
        width="60"
        label="详情"
      >
        <template
          slot-scope="props"
        >
          <el-form label-position="left" class="tableExpand">
            <el-form-item label="版本名称：">
              <span>{{props.row.ApkName}}</span>
            </el-form-item>
            <el-form-item label="CRM门店：">
              <span>{{props.row.ShopName}}</span>
            </el-form-item>
            <el-form-item label="当前版本号：">
              <span>{{props.row.ApkVersion}}</span>
            </el-form-item>
            <el-form-item label="版本名称：">
              <span>{{props.row.OldApkVersion}}</span>
            </el-form-item>
            <el-form-item label="更新进度：">
              <span>{{props.row.ApkVersionUpdate}}</span>
            </el-form-item>
            <el-form-item label="设备类型：">
              <span>{{props.row.DeviceType}}</span>
            </el-form-item>
         <!--   <el-form-item label="静默时间：">
              <span>{{props.row.showTime}}秒</span>
            </el-form-item>-->
            <el-form-item label="设备地址：">
              <span>{{props.row.Address}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small"
                     icon="el-icon-edit"
                     circle
                     @click="getData(scope.$index,scope.row)"
          >
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
        prop="DeviceName"
        label="设备名称"
        align="center"
        width="160"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="EmployeeName"
        label="设备所属人"
        align="center"
        width="150"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="DeviceMac"
        label="设备mac"
        align="center"
        width="150"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="ProvinceName"
        label="省份"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="CityName"
        label="城市"
        align="center"
        width="80"
        :show-overflow-tooltip="true">
      </el-table-column>
      
      <el-table-column
        prop="DeviceMac"
        label="激活状态"
        :formatter="isDeviceActivity"
        align="center"
        width="100"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="DeviceOpenStatus"
        label="设备状态"
        align="center"
        width="100"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag :type="isOpen(scope.row)" v-text="is_device_open(scope.row)"></el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="showTime"
        width="120"
        label="静默时间(秒)"
      >
      </el-table-column>
      <el-table-column
        label="增加+"
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
                  :id="id"
                  :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import citySelect from '@/component/common/citySelect/citySelect'
  import pagination from '@/component/common/pagination/pagination'
  import alertDialog from '../dialog/dialog'
  
  const storage = window.localStorage;
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      citySelect,
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
          DeviceName: '',
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
          console.log(this.dialogType);
        }
      },
      getList(update) {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/OnloadEmployeeDeviceList', {
          CityCode: update && update !== 'update' ? update[ 1 ] : '',
          DeviceName: that.keyWord
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
              if ( update && update === 'update' || !update ) {
                storage.setItem('device', JSON.stringify(that.list));
              }
            }
            that.dataLoading = false;
            that.isListChange = true;
          });
        console.log(that.list);
      }
      
      ,
      closeAlert(n) {
        // this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList('update');
        }
      }
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        console.log(row);
        this.isAlertShow = true;
        this.dialogType = 'up_date';
        if ( this.list.length ) {
          this.sendDialogData.EmployeeCode = this.list[ realIndex ].EmployeeCode;
          this.sendDialogData.PayUser = parseInt(this.list[ realIndex ].PayUser);
          
          this.sendDialogData.PayCode = this.list[ realIndex ].PayCode;
          
          this.sendDialogData.showTime = this.list[ realIndex ].showTime;
          this.sendDialogData.CRMCode = parseInt(this.list[ realIndex ].CRMCode);
          this.sendDialogData.DeviceMac = this.list[ realIndex ].DeviceMac;
          this.sendDialogData.EmployeeName = this.list[ realIndex ].EmployeeName;
          this.sendDialogData.ImgBase = this.list[ realIndex ].ImgBase;
          this.sendDialogData.CargoCode = parseInt(this.list[ realIndex ].CargoCode);
          this.sendDialogData.APKCode = this.list[ realIndex ].APKCode;
          this.sendDialogData.DeviceType = this.list[ realIndex ].DeviceType;
          this.sendDialogData.AddEmployeeCode = this.list[ realIndex ].AddEmployeeCode;
          this.sendDialogData.DeviceName = this.list[ realIndex ].DeviceName;
          this.sendDialogData.Address = this.list[ realIndex ].Address;
          this.sendDialogData.ProvinceCode = this.list[ realIndex ].ProvinceCode;
          this.sendDialogData.ProvinceName = this.list[ realIndex ].ProvinceName ? this.list[ realIndex ].ProvinceName : '省份';
          this.sendDialogData.CityCode = this.list[ realIndex ].CityCode;
          this.sendDialogData.CityName = this.list[ realIndex ].CityName ? this.list[ realIndex ].CityName : '市';
          this.sendDialogData.ID = row.ID;
          this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData))
        }
      }
      ,
      switchChange(index, row) {
        let that = this;
        console.log(index, row);
        // var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        that.$axios.post('/Home/EmployeeDeviceSave', {
          DogType: 'd_elete',
          EmployeeCode: row.EmployeeCode,
          Validity: row.Validity,
          ID: row.ID
        })
          .then(data => {
            that.getList('update')
          })
      }
      ,
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      }
      ,
      cityFilter(city) {
        this.getList(city)
      }
      ,
      isDeviceActivity(val) {
        let activityStatus;
        return activityStatus = val.DeviceMac === '未绑定' ? '未激活' : '已激活'
      },
      isOpen(val) {
        let openStatus;
        return openStatus = val.DeviceOpenStatus === '1' ? 'success' : 'info'
        
      },
      is_device_open(val) {
        let openStatus;
        return openStatus = val.DeviceOpenStatus === '1' ? '已开机' : '未开机'
      }
    }
  }
</script>

<style scoped lang="stylus">
  .el-form-item
    margin-bottom: 0
</style>
