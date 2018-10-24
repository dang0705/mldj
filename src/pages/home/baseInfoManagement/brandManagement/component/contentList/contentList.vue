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
    </div>
    
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
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
    <i v-show="isListEmpty" class="listLoading el-icon-loading"></i>
  
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
                  :editData="sendDialogData"></alert-dialog>
  
  </div>
</template>

<script>
  import axios from 'axios'
  // import filter from '@/components/common/filter/filter'
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
        isListEmpty: true,
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
        pagesize: 5,    //    每页的数据
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
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getBrandList()
    },
    methods: {
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
      },
      add(column) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
      getBrandList() {
        let that = this;
        that.list = [];
        axios.post('/api/Home/OnloadBrandList')
          .then(data => {
            const res = data.data.Content;
            if ( !res || !res.length||res.length ) {
              that.isListEmpty = false
            }
            that.list = res ? res : [];
            that.$store.state.isBrandUpdateData = false;
          })
      }
      
      ,
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false
      }
      , getData(index, row) {
        // console.log(index, row);
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
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
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.post('/api/Home/BrandSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                axios.post('/api/Home/OnloadBrandList', {
                  BrandName: this.keyWord
                })
                  .then(res => {
                    that.list = res.data.Content;
                    that.$store.state.isBrandUpdateData = false;
                  })
              })
          })
          .catch(() => {
          
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
      , filter() {
        let that = this;
        axios.post('/api/Home/OnloadBrandList', {
          BrandName: this.keyWord
        })
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isBrandUpdateData = false;
          })
      }
      
    },
    watch: {
      '$store.state.isBrandUpdateData': function () {
        if ( this.$store.state.isBrandUpdateData === true ) {
          this.getBrandList()
        }
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
