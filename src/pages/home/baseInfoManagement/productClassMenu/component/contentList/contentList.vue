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
          <!--<el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>-->
        </template>
      </el-table-column>
      
      <el-table-column
        label="品类根目录名称"
        prop="label"
        width="1000"
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
        sendDialogData: [ {
          label: '',
          children: [],
          id: 0,
        } ]
      }
    },
    mounted() {
      if ( this.$store.state.catalog.length ) {
        this.list = this.$store.state.catalog
        this.listLoading = false;
        this.isListChange = true;
      } else {
        this.getList()
      }
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
        that.$axios.post('/Home/OnloadProductClassList', {
          label: this.keyWord
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
            }
            that.listLoading = false;
            that.isListChange = true;
            that.$store.commit('catalog', that.list);
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
      ,
      getData(index, row) {
        console.log(row);
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData[ 0 ].label = this.list[ realIndex ].label.replace(/\ +/g, "");
        this.sendDialogData[ 0 ].children = this.list[ realIndex ].children;
        this.sendDialogData[ 0 ].id = row.id;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData));
        console.log(this.sendDialogData);
      }
      /*, deleteItem(index, row) {
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
        
      }*/
      
      
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
