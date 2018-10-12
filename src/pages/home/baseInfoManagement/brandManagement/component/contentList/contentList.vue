<template>
  
  <div id="contentListWrapper">
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
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    >
      <el-table-column label="" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getData(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteItem(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="" prop="BrandName" width="180">
      </el-table-column>
      <el-table-column label="" prop="BrandCode" width="180">
      </el-table-column>
      <el-table-column label="" prop="BrandLogoUrl" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.BrandLogoUrl||noLogo" alt="" width="50" height="50">
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" editOrAdd="up_date" :id="id"
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
        keyWord: '',
        noLogo: '/static/img/noData.3e8ee30.png',
        currentPage: 1, //初始页
        pagesize: 7,    //    每页的数据
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
      getBrandList() {
        let that = this;
        that.list = [];
        axios.post('/api/Home/OnloadBrandList')
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isBrandUpdateData = false;
          })
      }
      
      ,
      closeAlert() {
        this.add = '';
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
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
          .catch(()=>{
          
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
  #contentListWrapper >>> .el-table__header-wrapper
    display none
  
  #contentListWrapper >>> .el-table__body-wrapper, #contentListWrapper >>> .el-table__body
    width: 100% !important
  
  #contentListWrapper
    listStyle()
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
