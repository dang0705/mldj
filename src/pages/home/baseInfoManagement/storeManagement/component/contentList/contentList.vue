<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input"
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
      <citySelect class="citySelect" :isInAlert="!isAlertShow" @provincesAndCities="cityFilter"></citySelect>
    </div>
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :row-style="rowStyle"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              @header-click="add"
    
    >
      <el-table-column label="操作" width="100">
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
      <el-table-column label="渠道编号"
                       prop="ChannelCode"
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
    <i v-show="isListEmpty" class="listLoading el-icon-loading"></i>
  
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
    
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :id="id"
                  :editData="sendDialogData"
    ></alert-dialog>
  
  </div>
</template>

<script>
  import axios from 'axios'
  import citySelect from '@/components/common/citySelect/citySelect'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "contentList",
    components: {
      alertDialog,
      citySelect
    },
    data() {
      return {
        list: [],
        isListEmpty: true,
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
        pagesize: 5,    //    每页的数据
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
      addBtn({row, column, rowIndex, columnIndex}) {
        if ( columnIndex === row.length - 1 ) {
          return 'addBtn'
        }
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
        that.list = [];
        axios.post('/api/Home/OnloadStorelList')
          .then(data => {
            const res = data.data.Content;
            if ( !res || !res.length||res.length ) {
              that.isListEmpty = false
            }
            that.list = res ? res : [];
            that.$store.state.isStoreUpdateData = false;
          })
      }
      ,
     
      closeAlert() {
        this.dialogType = 'up_date';
        this.isAlertShow = false
      }
      ,
      getData(index, row) {
        // console.log(this.currentPage);  //点击第几页
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pagesize) : index;
        console.log(realIndex);
        this.isAlertShow = true;
        this.sendDialogData.StoreCode = this.list[ realIndex ].StoreCode;
        this.sendDialogData.StoreName = this.list[ realIndex ].StoreName;
        this.sendDialogData.ChannelCode = this.list[ realIndex ].ChannelCode;
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
      handleSizeChange(size) {
        this.pagesize = size;
        console.log(this.pagesize)
        //每页下拉显示数据
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
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
      },
      cityFilter(city) {
        const that = this;
        let timer = null;
        axios.post('/api/Home/OnloadStorelList', {
          CityCode: city[ 1 ] || ''
        })
          .then(data => {
            const res = data.data.Content;
            if ( res.length ) {
              that.list = data.data.Content;
              clearTimeout(timer)
            } else {
              timer = that.$message.error('当前选择城市无数据');
              setTimeout(that.getList, 1000)
            }
            console.log(data);
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
  
  .filterComponents
    filter()
    width 1220px
    .input, .citySelect
      width: 40%
      margin-right: 20px
      display inline-block
  
  /*width: 600px*/
</style>
