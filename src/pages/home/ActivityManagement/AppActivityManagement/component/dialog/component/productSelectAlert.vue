<template>
  <div id="productSelectAlert">
    <el-dialog
      title="选择产品"
      :visible.sync="isProductAlertShow"
      :before-close="handleClose"
    >
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
                :row-key="getRowKeys"
                v-loading="dataLoading"
                @select="handleProductSelect"
                @select-all="handleProductSelect"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="产品图片"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
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
        /*记录所有push的产品*/
        noteAllSelectedPrd: [],
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
      getRowKeys(row) {
        console.log(row);
        return row.id.toString()
      },
      
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        const that = this;
        that.currentPage = currentPage;
        // that.getSelectedStatus();
       
      }
      ,
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          if ( !this.isProductSelected ) {
            this.productSelectList = [];
          }
        }
        // console.log(this.productSelectList);
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
        that.dataLoading = true;
        that.$axios.post('/Home/OnloadProductList', {
          ProductClassID: name === 'classID' ? update : '',
          ProductName: name === 'keyWord' ? update : ''
        })
          .then(data => {
            if ( data.data.state == 1 ) {
              that.productList = data.data.Content;
            }
            that.isListChange = true;
            that.getSelectedStatus()
          });
        console.log(that.productList);
        
      }
      ,
      handleProductSelect(val, row) {
        console.log('选中值', val);
        // console.log(row);
/*        function unique(arr) {
          const res = new Map();
          return arr.filter((a) => !res.has(a.id) && res.set(a.id, 1))
        }*/
        
        if ( this.selectedProductList.length ) {
          if ( row ) {
            let isHasRow = val.includes(row);
            console.log(isHasRow);
            if ( !isHasRow ) {
              console.log('删除一项');
              for ( var i = this.productSelectList.length - 1; i >= 0; i-- ) {
                if ( this.productSelectList[ i ].id === row.id ) {
                  console.log(`删除第${i}项`);
                  this.productSelectList.splice(i, 1);
                  break;
                }
              }
            } else {
              this.productSelectList = val;
            }
          }else {
            this.productSelectList = val;
          }
        } else {
          this.productSelectList = val;
        }
        console.log(this.productSelectList);
  
        /*        let isHasRow= this.productSelectList.includes(row);
				console.log(isHasRow);
				if ( !isHasRow ) {
				  this.productSelectList.push(row);
				}else {
				  // this.productSelectList.push(val)
				}
		/!*        if ( !this.productSelectList.length ) {
				  this.productSelectList.push(row);
				}else {
				  let isHasRow=val.includes(row);
				  console.log(isHasRow);
				  if ( !isHasRow ) {
					this.productSelectList.push(row);
				  }
		  /!*        val.forEach((item,index,arr)=>{
					if ( row !== item ) {
					  this.productSelectList.push(val);
					}else {
					
					}
				  });*!/
				}*!/
			 
				// if ( this.productSelectList.length ) {
				//   this.productSelectList.splice(this.currentPage, 1)
				// }
				this.productSelectList=this.productSelectList.flat();*/
        // this.$emit('productSelected', this.productSelectList)
        // console.log('this.productSelectList', this.productSelectList);
      }
      ,
      getSelectedStatus() {
        const that = this;
        that.$nextTick(() => {
          that.selectedProductList.forEach((item, i) => {
            that.productList.forEach((_item, _i) => {
              if ( item.ProductCode === _item.id ) {
                // console.log(_item);
                this.productSelectList.push(_item);
                that.$refs.products.toggleRowSelection(_item, true)
  
              }
            })
          })
          that.dataLoading = false;
        })
      },
      getProductClass() {
        let that = this;
        that.$axios.post('/Home/OnloadProductClassList')
          .then(data => {
            if ( data.data.state == 1 ) {
              that.catalogList = data.data.Content;
            }
          })
      },
      confirmUpload(obj) {
        this.handleClose(obj);
        console.log(this.productSelectList);
        this.$emit('productSelected', this.productSelectList)
      }
    },
    watch: {
      'isProductAlertShow': function () {
        
        if ( this.isProductAlertShow ) {
          if (!this.selectedProductList.length ) {
            this.dataLoading = false;
  
          }
          this.$nextTick(()=>{
            this.$refs.products.clearSelection();
            this.productSelectList=[];
  
          });
          this.currentPage = 1;
          this.gitList();
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
