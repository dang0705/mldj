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
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="listLoading"
    
    >
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      
      <el-table-column
        label="渠道名称"
        prop="ChannelName"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="渠道编号"
        prop="ChannelCode"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="渠道描述"
        prop="ChannelDec"
        width="660"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
      <el-table-column label="增加+">
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
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
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
          height: '40px',
        },
        keyWord: '',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          ChannelCode: '',
          ChannelDec: '',
          ChannelName: '',
          ID: '',
        }
        
        // isUpdateDate:false
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
      getList() {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/OnloadChannelList', {
          ChannelName: this.keyWord
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
      closeAlert(n) {
        this.dialogType = 'up_date';
        this.isAlertShow = false;
        if ( !n ) {
          this.getList()
        }
      }
      , getData(index, row) {
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.ChannelCode = this.list[ realIndex ].ChannelCode;
        this.sendDialogData.ChannelName = this.list[ realIndex ].ChannelName;
        this.sendDialogData.ChannelDec = this.list[ realIndex ].ChannelDec;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/ChannelSave', {
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
      
      
    },
    watch: {
      '$store.state.isChannelUpdateData': function () {
        if ( this.$store.state.isChannelUpdateData === true ) {
          this.getList()
        }
      },
      
    }
  }
</script>

<style scoped lang="stylus">

</style>
