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
              @header-click="add"
              v-loading="listLoading"
    >
      <el-table-column label="操作"
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
      <el-table-column label="品牌名称"
                       prop="BrandName"
                       width="180"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="品牌编号"
                       prop="BrandCode"
                       width="180"
                       align="center"
      >
      </el-table-column>
      <el-table-column label="品牌LOGO"
                       prop="BrandLogoUrl"
                       width="140"
                       align="center"
      >
        <template slot-scope="scope">
          <img :src="scope.row.BrandLogoUrl||noLogo" alt="" width="60" height="60" style="vertical-align: middle">
        </template>
      </el-table-column>
      
      <el-table-column label="品牌简介"
                       prop="BrandShowText"
                       width="260"
                       align="center"
                       :show-overflow-tooltip="true"
      
      >
      </el-table-column>
      <el-table-column label="品牌描述"
                       prop="BrandComments"
                       width="260"
                       align="center"
                       :show-overflow-tooltip="true"
      
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
        listLoading: true,
        isListChange: false,
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        keyWord: '',
        dialogType: 'up_date',
        noLogo: 'static/img/noData.jpg',
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          BrandCode: '',
          BrandName: '',
          BrandComments: '',
          BrandShowText: '',
          ID: '',
          ImgBase: '',
        }
      }
    },
    mounted() {
      if ( this.$store.state.brand.length ) {
        this.list = this.$store.state.brand;
        this.listLoading = false;
        this.isListChange = true;
      } else {
        this.getList();
      }
    },
    methods: {
      listChanged() {
        this.isListChange = false
      },
      defaultPaginationData(val) {
        console.log(val);
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
      add(column) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getList() {
        let that = this;
        that.listLoading = true;
        that.$axios.post('/Home/OnloadBrandList', {
          BrandName: that.keyWord
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.list = data.data.Content;
            }
            that.listLoading = false;
            that.isListChange = true;
            that.defaultPaginationData()
            
          })
      }
      ,
      closeAlert(n) {
        this.dialogType = 'up_date';
        if ( !n ) {
          this.getList();
        }
        this.isAlertShow = false
      }
      , getData(index, row) {
        // console.log(index, row);
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.BrandCode = this.list[ realIndex ].BrandCode;
        this.sendDialogData.BrandName = this.list[ realIndex ].BrandName;
        this.sendDialogData.BrandComments = this.list[ realIndex ].BrandComments;
        this.sendDialogData.BrandShowText = this.list[ realIndex ].BrandShowText;
        this.sendDialogData.ImgBase = this.list[ realIndex ].BrandLogoUrl;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/BrandSave', {
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
    }
  }
</script>

<style scoped lang="stylus">

</style>
