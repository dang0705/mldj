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
              :row-style="rowStyle"
    
    >
      <el-table-column label="" width="100">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="" prop="StoreName" width="140">
      </el-table-column>
      <el-table-column label="" prop="StoreCode" width="140">
      </el-table-column>
      <el-table-column label="" prop="ChannelCode" width="140">
      </el-table-column>
      <!-- <el-table-column label="" prop="ProvinceCode" width="140">
	   </el-table-column>
	   <el-table-column label="" prop="CityCode" width="140">
	   </el-table-column>-->
      <el-table-column label=""
                       prop="ProvinceName"
                       width="140"
      >
      </el-table-column>
      <el-table-column label=""
                       prop="CityName"
                       width="140"
      >
      </el-table-column>
      <el-table-column label=""
                       prop="AddInfo"
                       width="180"
                       :show-overflow-tooltip="true"
      
      >
      </el-table-column>
      <el-table-column label=""
                       prop="ContactPhone"
                       width="140"
      
      >
      </el-table-column>
      <el-table-column label="" prop="">
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
        rowStyle: {
          height: '40px'
        },
        keyWord: '',
        currentPage: 1, //初始页
        pagesize: 5,    //    每页的数据
        isAlertShow: false,
        id: '',
        sendDialogData: {
          StoreCode: '',
          StoreName: '',
          ChannelCode: '',
          ProvinceCode: '',
          ProvinceName:'省',
          CityCode: '',
          CityName:'市',
          AddInfo: '',
          ContactPhone: '',
          ID: '',
        }
        
        // isUpdateDate:false
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        let that = this;
        that.list = [];
        axios.post('/api/Home/OnloadStorelList')
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isStoreUpdateData = false;
          })
      }
      
      ,
      closeAlert() {
        this.add = '';
        this.isAlertShow = false
      }
      , getData(index, row) {
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.StoreCode = this.list[ realIndex ].StoreCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelCode = this.list[ realIndex ].ChannelCode;
        
        this.sendDialogData.ProvinceName = this.list[ realIndex ].ProvinceName?this.list[ realIndex ].ProvinceName:'省份';
        this.sendDialogData.ProvinceCode = this.list[ realIndex ].ProvinceCode;
        this.sendDialogData.CityName = this.list[ realIndex ].CityName?this.list[ realIndex ].CityName:'市';
        this.sendDialogData.CityCode = this.list[ realIndex ].CityCode;
        this.sendDialogData.AddInfo = this.list[ realIndex ].AddInfo;
        this.sendDialogData.ContactPhone = this.list[ realIndex ].ContactPhone;
        this.sendDialogData.ID = row.ID;
      }
      , deleteItem(index, row) {
        let that = this;
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.post('/api/Home/StoreSave', {
              DogType: 'd_elete',
              ID: row.ID
            })
              .then(data => {
                axios.post('/api/Home/OnloadStorelList', {
                  StoreName: this.keyWord
                })
                  .then(res => {
                    that.list = res.data.Content;
                    that.$store.state.isStoreUpdateData = false;
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
      ,
      filter() {
        let that = this;
        axios.post('/api/Home/OnloadStorelList', {
          StoreName: this.keyWord
        })
          .then(data => {
            that.list = data.data.Content;
            that.$store.state.isStoreUpdateData = false;
          })
      }
      
    },
    watch: {
      '$store.state.isStoreUpdateData': function () {
        if ( this.$store.state.isStoreUpdateData === true ) {
          this.getList()
        }
      },
      
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
  
  #contentListWrapper >>> .el-table__header-wrapper
    display none
  
  #contentListWrapper >>> .el-table__body-wrapper, #contentListWrapper >>> .el-table__body
    width: 100% !important
  
  #contentListWrapper >>> .el-table__row
    td
      text-align center
  
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
