<template>
  <div id="contentListWrapper">
    <div class="filterComponents">
      <el-input
        autofocus
        class="input activeName"
        v-model="searchData.ProductName"
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
        v-model="searchData.brand"
        clearable
        @clear="getList"
        @change="getList"
        placeholder="品牌选择"
      >
        <el-option
          v-for="(item,i) in brandList"
          :key="i"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-cascader
        :options="catalogList"
        v-model="searchData.catalog"
        clearable
        @change="getList"
        change-on-select
        :props="props"
        placeholder="品类选择"
      ></el-cascader>
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
        type="expand"
        width="60"
        label="详情"
      >
        <template slot-scope="props">
          <el-form label-position="left" class="tableExpand">
            <el-form-item label="产品编号：">
              <span>{{props.row.productCode}}</span>
            </el-form-item>
            <el-form-item label="产品英文名：">
              <span>{{props.row.ProductEnglish}}</span>
            </el-form-item>
            <el-form-item label="产品规格：">
              <span>{{props.row.Size+'ML'}}</span>
            </el-form-item>
            <el-form-item label="产品介绍：">
              <span>{{props.row.Introduce}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      
      <el-table-column
        label="产品名称"
        prop="ProductName"
        align="center"
        width="255"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="图片" width="60" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="click"
          >
            <img :src="scope.row.ImgBase" alt="">
            <img class="thumbnail" slot="reference" width="40px" height="40px" :src="scope.row.ImgBase" alt="">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="产品品类"
        prop="ProductClassName"
        align="center"
        width="140"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="所属品牌"
        prop="ProductBrand"
        align="center"
        width="185"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="售价"
        prop="Sale"
        align="center"
        width="100"
        sortable
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="原价"
        prop="cost"
        align="center"
        width="100"
        sortable
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        label="活动价"
        prop="spSale"
        align="center"
        width="100"
        sortable
        :show-overflow-tooltip="true">
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
    <alert-dialog :isAlertShow.sync="isAlertShow"
                  @closeAlert="closeAlert"
                  :editOrAdd="dialogType"
                  :id="id"
                  :editData="sendDialogData"></alert-dialog>
  </div>
</template>

<script>
  import alertDialog from '../dialog/dialog'
  import pagination from '@/component/common/pagination/pagination'
  
  const storage = window.localStorage;
  export default {
    name: "contentList",
    components: {
      alertDialog,
      pagination
    },
    data() {
      return {
        props: {
          label: 'label',
          value: 'id',
        },
        dataLoading: true,
        isSourceListShow: false,
        isListChange: false,
        FileType: '',
        list: [],
        dialogType: 'up_date',
        brandList: [],
        catalogList: [],
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
        searchData: {
          ProductName: '',
          brand: '',
          catalog: []
        },
        sendDialogData: {
          ProductName: '',
          ProductEnglish: '',
          productCode: '',
          ProductClassId: '',
          ProductBrandId: '',
          Sale: 50,
          cost: 50,
          spSale: 50,
          Size: 50,
          Introduce: '',
          ImgBase: '',
          id: 0
        }
      }
    },
    mounted() {
      this.getList();
      this.getBrandList();
      this.getCatalogList();
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
      }
      ,
      getList(update) {
        console.log(update);
        let that = this;
        if ( storage.getItem('productList') && !update ) {
          that.list = JSON.parse(storage.getItem('productList'));
          that.dataLoading = false;
          that.isListChange = true;
        } else {
          that.dataLoading = true;
          that.$axios.post('/Home/OnloadProductList', {
            ProductName: that.searchData.ProductName,
            ProductBrandID: that.searchData.brand,
            ProductClassID: that.searchData.catalog[ that.searchData.catalog.length - 1 || 0 ]
          })
            .then(data => {
              console.log(data);
              if ( data.data.state == 1 ) {
                that.list = data.data.Content;
                if ( update === 'update' ) {
                  storage.setItem('productList', JSON.stringify(that.list))
                }
                
              }
              that.dataLoading = false;
              that.isListChange = true;
            })
        }
        
      }
      ,
      getBrandList() {
        const that = this, length = that.$store.state.brand.length;
        if ( length ) {
          for ( var i = 0; i < length; i++ ) {
            that.brandList.push({
              label: that.$store.state.brand[ i ].BrandName,
              value: that.$store.state.brand[ i ].ID
            })
          }
        } else {
          that.$axios.post('/Home/OnloadBrandList')
            .then(data => {
              if ( data.data.state == 1 ) {
                const res = data.data.Content, length = res.length;
                for ( var i = 0; i < length; i++ ) {
                  that.brandList.push({
                    label: res[ i ].BrandName,
                    value: res[ i ].ID
                  })
                }
                console.log(that.brandList);
              }
            })
        }
        
      },
      getCatalogList() {
        if ( storage.getItem('catalog') ) {
          this.catalogList = JSON.parse(storage.getItem('catalog'))
        } else {
          const that = this;
          that.$axios.post('/Home/OnloadProductClassList')
            .then(data => {
              if ( data.data.state == 1 ) {
                that.catalogList = data.data.Content;
                that.$store.commit('catalog', that.list);
              }
              that.catalogList.unshift({label: '全部', id: 0})
            })
        }
        console.log(this.catalogList);
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
        var realIndex = this.currentPage > 1 ? index + ((this.currentPage - 1) * this.pageSize) : index;
        this.isAlertShow = true;
        this.sendDialogData.ProductName = this.list[ realIndex ].ProductName;
        this.sendDialogData.ProductEnglish = this.list[ realIndex ].ProductEnglish;
        this.sendDialogData.productCode = this.list[ realIndex ].productCode;
        this.sendDialogData.ProductClassId = JSON.parse(this.list[ realIndex ].ProductClassId);
        this.sendDialogData.ProductBrandId = this.list[ realIndex ].ProductBrandId;
        this.sendDialogData.Sale = this.list[ realIndex ].Sale;
        this.sendDialogData.cost = this.list[ realIndex ].cost;
        this.sendDialogData.spSale = this.list[ realIndex ].spSale;
        this.sendDialogData.Size = this.list[ realIndex ].Size;
        this.sendDialogData.ImgBase = this.list[ realIndex ].ImgBase;
        this.sendDialogData.Introduce = this.list[ realIndex ].Introduce;
        this.sendDialogData.id = row.id;
        this.sendDialogData = JSON.parse(JSON.stringify(this.sendDialogData))
      }
      ,
      deleteItem(index, row) {
        let that = this;
        console.log(row);
        this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.$axios.post('/Home/Productsave', {
              DogType: 'd_elete',
              ID: row.id
            })
              .then(() => {
                that.getList('update')
              })
          })
      }
      ,
      afterEnterPopover(index, val) {
        const imgIndex = 'img' + index;
        this.$nextTick(() => {
          this.$refs[ imgIndex ].src = val.ImgBase;
          // this.$refs[ imgIndex ].src = val.OpenFileUrl;
        })
        
      }
    }
  }
</script>

<style scoped lang="stylus">
  .tableExpand
    font-size: 0;
    width: 50%;
    margin 0 auto
    
    .el-form-item
      margin-right: 0;
      margin-bottom: 0;
      width: 30%;


</style>
