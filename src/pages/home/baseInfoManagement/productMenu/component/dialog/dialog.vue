<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      width="720px"
      :height="editOrAdd==='a_dd'?'':'300px'"
    >
      <div class="basInfo">
        <div class="uploadImg">
          <upload
            :isClose="isClose"
            :imgUrl="formData.ImgBase"
            @closeDialog="handleClose"
            @getBase64Url="getBase64Url"
            :getUpLoadTitle="upLoadTitle"
            :getUploadType="uploadType">
          </upload>
        </div>
        <el-form
          :model="formData"
          label-width="120px"
          class='upImgForm'
          :rules="uploadRules"
        >
          <el-form-item
            prop="ProductName"
            label="产品名称："
          >
            <el-input v-model="formData.ProductName"
                      clearable
                      maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="ProductEnglish"
            label="英文名称："
          >
            <el-input v-model="formData.ProductEnglish"
                      clearable
                      maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="productCode"
            label="微信编号："
          >
            <el-input v-model="formData.productCode"
                      clearable
                      maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="productCode"
            label="阿里编号："
          >
            <el-input v-model="formData.AliCode"
                      clearable
                      maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item prop="ProductClassId" label="所属品类：">
            <el-cascader
              v-model="ProductClassId"
              @change="catalogChange"
              @blur="getProductClassName"
              :options="catalogList"
              clearable
              change-on-select
              :props="props"
              placeholder="品类选择"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="ProductBrandId" label="所属品牌：">
            <el-select
              v-model="formData.ProductBrandId"
              clearable
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
          </el-form-item>
        
        </el-form>
      </div>
      <div id="productPriceInfo">
        <el-form
          label-width="140px"
          :rules="uploadRules"
          inline
          class="priceInfo"
        >
          <el-form-item label="售价（元）：" prop="Sale">
            <el-input-number v-model="formData.Sale"></el-input-number>
          </el-form-item>
          <el-form-item label="原价（元）：" prop="cost">
            <el-input-number v-model="formData.cost"></el-input-number>
          </el-form-item>
          <el-form-item label="活动价（元）：" prop="spSale">
            <el-input-number v-model="formData.spSale"></el-input-number>
          </el-form-item>
          <el-form-item label="规格（ML）：" prop="Size">
            <el-input-number v-model="formData.Size"></el-input-number>
          </el-form-item>
        
        </el-form>
      </div>
      <div id="introduce" style="width: 80%;">
        <el-form
          label-width="120px"
        >
          <el-form-item label="产品描述：">
            <el-input
              v-model="formData.Introduce"
              type="textarea"
              clearable
              maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/component/common/upload/uploadList'
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "productMenu_dialog",
    components: {
      upload
    },
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String
      },
      editData: {
        type: Object
      }
    },
    
    data() {
      return {
        list: [],
        props: {
          label: 'label',
          value: 'id',
        },
        catalogList: [],
        brandList: [],
        cargoWayName: '',
        upLoadTitle: '',
        uploadType: 'image/jpeg,image/png',
        alertTitle: '',
        ProductClassId: [],
        formData: {
          AliCode: '',
          ProductName: '',
          ProductEnglish: '',
          productCode: '',
          ProductClassId: '',
          ProductBrandId: '',
          Sale: 50,
          cost: 50,
          spSale: 50,
          Size: '50',
          Introduce: '',
          ImgBase: '',
          id: 0
        }
        ,
        editFormData: {
          ImgBase: '',
        },
        uploadRules: {
          ProductName: [
            {
              required: true,
              message: '产品名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 12,
              message: '长度请在1~12个字符',
              trigger: 'blur'
            }
          ]
          ,
          ProductEnglish: [
            {
              required: true,
              message: '产品英文名称为必填项',
              trigger: 'blur'
            }
            , {
              min: 1,
              max: 30,
              message: '长度请在1~30个字符',
              trigger: 'blur'
            }
          ],
          productCode: [
            {
              required: true,
              message: '产品编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~12个字符',
              trigger: 'blur'
            }
          ]
          ,
          ProductClassId: [
            {
              required: true,
              message: '所属品类为必填项',
              trigger: 'blur'
            }
          ]
          ,
          ProductBrandId: [
            {
              required: true,
              message: '所属品牌为必填项',
              trigger: 'blur'
            }
          ]
          , Sale: [
            {
              required: true,
              message: '售价为必填项',
              trigger: 'blur'
            }
          ]
          , cost: [
            {
              required: true,
              message: '原价为必填项',
              trigger: 'blur'
            }
          ]
          , spSale: [
            {
              required: true,
              message: '活动价为必填项',
              trigger: 'blur'
            }
          ]
          , Size: [
            {
              required: true,
              message: '规格为必填项',
              trigger: 'blur'
            }
          ]
          
        }
        
      }
    },
    computed: {
      isClose: {
        get: function () {
          let clearImg = this.isAlertShow;
          return !clearImg
        },
        set: function () {
        
        }
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            // this.ProductClassId = JSON.parse(this.formData.ProductClassId)
            // this.catalogSelect = this.formData.ProductClassId ;
            this.ProductClassId = this.formData.ProductClassId;
            console.log(this.formData);
            this.formData.DogType = this.editString;
            this.alertTitle = '编辑产品';
            Msg = '编辑成功'
          } else {
            this.ProductClassId = [];
            this.alertTitle = '新增产品';
            this.formData.ImgBase = '';
            Msg = '增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        } else {
        }
      }
    },
    methods: {
      catalogChange(val) {
        this.ProductClassId = val;
        this.formData.ProductClassId = JSON.stringify(val)
        
      },
      getProductClassName(val) {
        console.log(val);
        
      },
      
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
        const that = this;
        that.$axios.post('/Home/OnloadProductClassList')
          .then(data => {
            if ( data.data.state == 1 ) {
              that.catalogList = data.data.Content;
              that.$store.commit('catalog', that.list);
            }
          })
        console.log(this.catalogList);
      },
      getBase64Url(url) {
        if ( this.isAlertShow ) {
          this.formData.ImgBase = url;
        }
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          // this.formData.ImgBase = '';
          this.$emit('closeAlert', 'n');
          
        } else {
          this.$emit('closeAlert')
        }
        this.isClose = true;
        this.$emit('closeAlert');
        this.formData.ProductName
          = this.formData.ProductEnglish
          = this.formData.productCode
          = this.formData.ProductBrandId
          = this.formData.Introduce
          = this.formData.ImgBase = '';
        this.formData.Sale = this.formData.cost = this.formData.spSale = this.formData.Size = 50;
        this.formData.ProductClassId = '';
        this.formData.ProductBrandId = '';
        // this.editFormData.ImgBase = ''
      },
      confirmUpload(obj) {
        console.log(this.ProductClassId);
        if ( this.formData.ProductName === '' ) {
          this.$message.error('产品名称不能为空');
          return
        } else if ( this.formData.ProductEnglish === '' ) {
          this.$message.error('产品英文名不能为空');
          return
        } else if ( this.formData.productCode === '' ) {
          this.$message.error('产品编号不能为空');
          return
        } else if ( this.formData.AliCode === '' ) {
          this.$message.error('阿里编号不能为空');
          return
        } else if ( !this.ProductClassId.length ) {
          this.$message.error('产品品类不能为空');
          return
        } else if ( this.formData.ProductBrandId === '' ) {
          this.$message.error('产品品牌不能为空');
          return
        } else if ( this.formData.Sale === '' ) {
          this.$message.error('售价不能为空');
          return
        } else if ( this.formData.cost === '' ) {
          this.$message.error('原价不能为空');
          return
        } else if ( this.formData.spSale === '' ) {
          this.$message.error('活动价不能为空');
          return
        } else if ( this.formData.Size === '' ) {
          this.$message.error('规格不能为空');
          return
        } else if ( this.formData.ImgBase === '' ) {
          this.$message.error('产品图片不能为空');
          return
        }
        this.add(obj)
        
      },
      add(obj) {
        const that = this;
        
        // that.formData.ProductClassId = JSON.stringify(that.formData.ProductClassId);
        console.log(that.formData);
        that.$axios.post('/Home/Productsave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj)
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      edit(obj) {
      
      }
      ,
      
    },
    mounted() {
      this.getBrandList();
      this.getCatalogList();
    }
  }
</script>

<style scoped lang="stylus">
  
  
  .dialogWrapper >>> .priceInfo
    .el-form-item
      width: 45%
    
    .el-form-item__content
      width: auto

</style>
