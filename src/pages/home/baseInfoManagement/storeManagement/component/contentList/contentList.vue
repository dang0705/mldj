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
      <citySelect class="citySelect" :isInAlert="!isAlertShow" :forSearch="true"
                  @provincesAndCities="cityFilter"
      ></citySelect>
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
              v-loading="listLoading"
    
    >
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="门店名称"
                       prop="StoreName"
                       width="140"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="门店编号"
                       prop="StoreCode"
                       width="140"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="渠道名称"
                       prop="ChannelName"
                       width="140"
                       align="center"
      >
      </el-table-column>
      
      <el-table-column label="省份"
                       prop="ProvinceName"
                       width="80"
                       align="center"
                       :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="城市"
                       prop="CityName"
                       width="80"
                       align="center"
                       :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="门店地址"
                       prop="AddInfo"
                       width="260"
                       align="center"
                       :show-overflow-tooltip="true"
      
      >
      </el-table-column>
      <el-table-column label="联系方式"
                       prop="ContactPhone"
                       width="180"
                       align="center"
                       :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="增加+" prop=""
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
                  :id="id"
                  :editData="sendDialogData"
    ></alert-dialog>
  
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
        listLoading: true,
        isListChange: false,
        dialogType: 'up_date',
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px'
        },
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          StoreCode: '',
          StoreName: '',
          ChannelCode: '',
          ProvinceCode: '',
          ProvinceName: '省',
          CityCode: '',
          CityName: '市',
          AddInfo: '',
          ContactPhone: '',
          ID: '',
        }
      }
    },
    
    mounted() {
      this.getList();
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
        if ( storage.getItem('store') && !update ) {
          this.list = JSON.parse(storage.getItem('store'));
          this.listLoading = false;
          this.isListChange = true;
        } else {
          let that = this;
          that.listLoading = true;
          that.$axios.post('/Home/OnloadStorelList', {
            StoreName: that.keyWord,
            CityCode: Array.isArray(update) && update.length ? update[ 1 ] : ''
          })
            .then(data => {
              if ( data.data.state == 1 ) {
                that.list = data.data.Content;
                storage.setItem('store', JSON.stringify(that.list))
              }
              that.listLoading = false;
              that.isListChange = true;
              this.defaultPaginationData()
            })
        }
        
      }
      ,
      
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList('update')
        }
      }
      ,
      getData(index, row) {
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.StoreCode = this.list[ realIndex ].StoreCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelCode = this.list[ realIndex ].ChannelCode;
        // this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        this.sendDialogData.ProvinceName = this.list[ realIndex ].ProvinceName ? this.list[ realIndex ].ProvinceName : '省份';
        this.sendDialogData.ProvinceCode = this.list[ realIndex ].ProvinceCode;
        this.sendDialogData.CityName = this.list[ realIndex ].CityName ? this.list[ realIndex ].CityName : '市';
        this.sendDialogData.CityCode = this.list[ realIndex ].CityCode;
        this.sendDialogData.AddInfo = this.list[ realIndex ].AddInfo;
        this.sendDialogData.ContactPhone = this.list[ realIndex ].ContactPhone;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该门店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/StoreSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                that.getList()
              })
          })
          .catch(() => {
          
          })
        
      }
      ,
      cityFilter(city) {
        console.log(city);
        this.getList(city)
      }
      
    }
  }
</script>

<style scoped lang="stylus">
</style>
