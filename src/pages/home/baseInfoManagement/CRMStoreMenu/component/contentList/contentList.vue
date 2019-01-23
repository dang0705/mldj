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
      <el-select
        v-model="type"
        @clear="getList"
        @change="getList"
        clearable
      >
        <el-option
          v-for="(item,index) in sendDialogData.typeList"
          :label="item.label"
          :value="item.value"
          :key="index"
        ></el-option>
      </el-select>
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
      <el-table-column label="CRM门店名称"
                       prop="StoreName"
                       width="600"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="CRM门店编号"
                       prop="CRMStoreCode"
                       width="200"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="CRM门店类型"
                       prop="CRMStoreCode"
                       :formatter="storeType"
                       width="200"
                       align="center"
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
    
    <alert-dialog
      @closeAlert="closeAlert"
      :isAlertShow.sync="isAlertShow"
      :editOrAdd="dialogType"
      :id="id"
      :editData="sendDialogData"
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
        type: '',
        listLoading: true,
        isListChange: false,
        dialogType: 'up_date',
        // typeList: [],
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
          typeList:[],
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
      this.getCrmTypeList()
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
      getCrmTypeList() {
        let that = this;
        that.$axios.post('/Home/OnloadMetaDataByType', {
          InputType: 'CRMDATA'
        })
          .then(data => {
            if ( data.data.state === 1 ) {
              const list = data.data.Content;
              list.forEach((item, index, arr) => {
                that.sendDialogData.typeList.push({
                  label: item.Name,
                  value: item.Value,
                })
              });
            }
          })
      },
      getList(update) {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/CRMonload', {
          StoreName: that.keyWord,
          type: this.type
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
            }
            that.listLoading = false;
            that.isListChange = true;
            this.defaultPaginationData()
          })
        
      }
      ,
      storeType(row) {
        let type;
        return type = row.type === '1' ? '阿里' : '微信'
      },
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
        this.sendDialogData.CRMStoreCode = this.list[ realIndex ].CRMStoreCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.type = this.list[ realIndex ].type;
        // this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        
        this.sendDialogData.ID = row.ID;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData))
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该CRM门店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/CRMsave', {
              dogtype: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                that.getList('update')
              })
          })
          .catch(() => {
          })
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
