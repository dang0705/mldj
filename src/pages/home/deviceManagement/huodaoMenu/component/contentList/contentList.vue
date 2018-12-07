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
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="货道外观图"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="click">
            <img :src="scope.row.ImgBase||noLogo " alt="">
            <img :src="scope.row.ImgBase||noLogo" slot="reference" width="40px" height="40px"
                 style="vertical-align: middle;cursor: pointer"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="CargoName"
        label="货到名称"
        align="center"
        width="180"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="CargoCode"
        label="货道型号"
        align="center"
        width="180"
        :show-overflow-tooltip="true">
      </el-table-column>
      
      <el-table-column
        prop="CargoDec"
        label="货道描述"
        align="center"
        width="520"
        :show-overflow-tooltip="true">
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
                  :sendDialogData="sendDialogData"
                  :id="id"
    ></alert-dialog>
  </div>
</template>
<script>
  import pagination from '@/component/common/pagination/pagination'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        list: [],
        noLogo: 'static/img/noData.jpg',
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
          CargoName: '',
          CargoCode: '',
          CargoDec: '',
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
      getList(city) {
        let that = this;
        that.$axios.post('/Home/OnloadCargoTypeList', {
          CargoName: that.keyWord
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
      ,
      getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        console.log(row);
        this.isAlertShow = true;
        
        this.sendDialogData.ImgBase = this.list[ realIndex ].ImgBase;
        this.sendDialogData.CargoDec = this.list[ realIndex ].CargoDec;
        this.sendDialogData.CargoName = this.list[ realIndex ].CargoName;
        this.sendDialogData.CargoCode = this.list[ realIndex ].CargoCode;
        this.sendDialogData.ID = row.ID;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData))
      }
      , deleteItem(index, row) {
        let that = this;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.$confirm('此操作将永久删除该货道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/CargoTypeSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(() => {
                that.getList()
              })
          })
          .catch(() => {
          
          })
        
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
      ,
      cityFilter(city) {
        this.getList(city)
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
