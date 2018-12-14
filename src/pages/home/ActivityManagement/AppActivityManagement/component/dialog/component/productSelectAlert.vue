<template>
  <div id="productSelectAlert">
    <el-dialog
      title="选择产品"
      :visible.sync="isProductAlertShow"
      :before-close="handleClose"
    >
      <!-- <template v-for="(item ,i) in productSelectList">
		 <el-tag size="small">{{item.ProductName}}</el-tag>
	   </template>-->
      <!--      <div id="productTags"
				 v-for="(item,i) in productSelectList"
			>
			  <el-tag size="small"></el-tag>
			</div>-->
      <el-form
        ref="sourceSelect"
      >
        <el-form-item
        >
          <div class="filterComponents">
            <el-input
              class="activeName"
              v-model="formData.ProductName"
              placeholder="请输入产品名称"
              @keyup.enter.native="gitList(formData.ProductName,'keyWord')"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="gitList(formData.ProductName,'keyWord')"
              ></i>
            </el-input>
            
            <el-cascader
              v-model="formData.ProductClassId"
              @change="gitList(formData.ProductClassId[formData.ProductClassId.length-1],'classID')"
              :options="catalogList"
              clearable
              change-on-select
              :props="props"
              placeholder="品类选择"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      
      <el-table width="100%"
                ref="products"
                :data="productList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :header-row-style="headerStyle"
                :row-style="rowStyle"
                v-loading="dataLoading"
                @select="handleProductSelect"
                @select-all="handleProductSelect"
      >
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="产品图片"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <!--<div class="imgWrapper" style="width: 40px;height: 40px;margin: 0 auto">
              <img :src="scope.row.ImgBase||noLogo" slot="reference" alt="" width="100%" height="100%"
                   style="vertical-align: middle;cursor: pointer">
            </div>-->
            <el-popover
              placement="right"
              trigger="click"
              :disabled="!scope.row.ImgBase"
            >
              <img :src="scope.row.ImgBase||noLogo" alt="" width="600px">
              <img :src="scope.row.ImgBase||noLogo" slot="reference" alt="" width="40" height="40"
                   style="vertical-align: middle;cursor: pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="产品名称"
          align="center"
          width="200"
          prop="ProductName"
        ></el-table-column>
        <el-table-column
          label="产品品类（最末级）"
          align="center"
          width="200"
          prop="ProductClassName"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="productList.length">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/component/common/pagination/pagination'
  
  const storage = window.localStorage;
  
  export default {
    name: "productSelectAlert",
    components: {
      pagination
    },
    props: {
      isProductAlertShow: {
        type: Boolean
      },
      selectedProductList: {
        type: Array
      },
      isProductSelected: {
        type: Boolean
      }
    },
    data() {
      return {
        catalogList: [],
        productSelectList: [],
        productList: [],
        formData: {
          ProductName: '',
          ProductClassId: [],
        },
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '14px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
        currentPage: 1, //初始页
        pageSize: 10,    //    每页的数据
        props: {
          label: 'label',
          value: 'id',
        },
        isListChange: false,
        dataLoading: true
      }
    },
    methods: {
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        this.getSelectedStatus()
        // console.log(this.currentPage)  //点击第几页
      }
      ,
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          if ( !this.isProductSelected ) {
            this.productSelectList = [];
          }
        }
        console.log(this.productSelectList);
        this.formData.ProductName = '';
        this.formData.ProductClassId = []
        this.$emit('closeProductSelect');
      }
      ,
      gitList(update, name) {
        let that = this;
        console.log(update);
        if ( update && name === 'classID' ) {
          update = update.toString()
        } else {
          update = ''
        }
        
        if ( storage.getItem('productList') && !name ) {
          that.productList = JSON.parse(storage.getItem('productList'));
          that.dataLoading = false;
          that.isListChange = true;
          that.getSelectedStatus()
        } else {
          that.dataLoading = true;
          that.$axios.post('/Home/OnloadProductList', {
            ProductClassID: name === 'classID' ? update : '',
            ProductName: name === 'keyWord' ? update : ''
          })
            .then(data => {
              console.log(data);
              if ( data.data.state == 1 ) {
                that.productList = data.data.Content;
                // storage.setItem('productList', JSON.stringify(that.productList))
                
              }
              that.dataLoading = false;
              that.isListChange = true;
              that.getSelectedStatus()
            })
        }
        console.log(that.productList);
        
      }
      ,
      handleProductSelect(val) {
        console.log(val);
        this.productSelectList = val
        this.$emit('productSelected', this.productSelectList)
        // console.log('this.productSelectList', this.productSelectList);
      }
      ,
      getSelectedStatus() {
        const that = this;
        that.$nextTick(() => {
          that.selectedProductList.forEach((item, i) => {
            that.productList.forEach((_item, _i) => {
              if ( parseInt(item.ProductCode) === _item.id ) {
                that.$refs.products.toggleRowSelection(_item)
              }
            })
          })
        })
      },
      getProductClass() {
        let that = this;
        if ( storage.getItem('catalog') ) {
          that.catalogList = JSON.parse(storage.getItem('productList'));
        } else {
          that.$axios.post('/Home/OnloadProductClassList')
            .then(data => {
              if ( data.data.state == 1 ) {
                that.catalogList = data.data.Content;
              }
            })
        }
      },
      confirmUpload(obj) {
        this.handleClose(obj)
        this.$emit('productSelected', this.productSelectList)
      }
    },
    watch: {
      'isProductAlertShow': function () {
        if ( this.isProductAlertShow ) {
          this.gitList()
          console.log(this.selectedProductList);
  
          // console.log(this.selectedProductList);
        }
      }
    },
    mounted() {
      this.getProductClass()
    }
  }
</script>

<style scoped lang="stylus">
  #productSelectAlert
    .filterComponents
      width auto
      text-align center
      
      > div, > span
        width 45%

</style>
