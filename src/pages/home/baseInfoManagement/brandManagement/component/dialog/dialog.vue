<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      @closed="closed"
      width="600px"
    >
      <div id="imgWrapper">
        <upload
          :isClose="isClose"
          :imgUrl="formData.ImgBase"
          @closeDialog="handleClose"
          @getBase64Url="getBase64Url"
          :getUpLoadTitle="upLoadTitle"
          :getUploadType="uploadType"
        >
        
        </upload>
      </div>
      <div id="info">
        <el-form
          ref="upload"
          :model="formData"
          :rules="uploadRules"
          label-width="120px"
        >
          <!--     <el-form-item>
			   
			   </el-form-item>-->
          <el-form-item prop="BrandCode" label="品牌编号：">
            <el-input v-model="formData.BrandCode" clearable minlength="1" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item prop="BrandName" label="品牌名称：">
            <el-input v-model="formData.BrandName" clearable minlength="1" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="品牌简介：">
            <el-input v-model="formData.BrandShowText" clearable minlength="1"
                      maxlength="15"></el-input>
          </el-form-item>
          <el-form-item label="品牌描述：">
            <el-input type="textarea" v-model="formData.BrandComments" maxlength="250"></el-input>
          </el-form-item>
          
          <!--上传图片插件-->
        
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
  export default {
    // inject:['reload'],
    name: "brandManagement_dialog",
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
        alertTitle: '',
        upLoadTitle: '',
        uploadType: 'image/jpeg,image/png',
        formData: {
          BrandCode: '',
          BrandName: '',
          BrandComments: '',
          BrandShowText: '',
          ImgBase: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          BrandCode: [
            {
              required: true,
              message: '品牌编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          BrandName: [
            {
              required: true,
              message: '品牌名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
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
            this.formData.BrandCode = this.editData.BrandCode;
            this.formData.BrandName = this.editData.BrandName;
            this.formData.BrandComments = this.editData.BrandComments;
            this.formData.BrandShowText = this.editData.BrandShowText;
            this.formData.ID = this.editData.ID;
            this.formData.ImgBase = this.editData.ImgBase;
            this.alertTitle = '编辑品牌';
            Msg = '编辑成功'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增品牌';
            Msg = '增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        }
        
      }
    },
    
    methods: {
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
          
        }
        this.formData.ImgBase = '';
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if ( !isJPG && !isPNG ) {
          this.$message.error('上传图片只能是 JPG 和 PNG 格式!');
        }
        
        if ( !isLt2M ) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        
        return (isJPG || isPNG) && isLt2M;
        
      },
      
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.BrandCode === '' ) {
          that.$message.error('品牌编号不能为空');
          return
        } else if ( that.formData.BrandName === '' ) {
          that.$message.error('品牌名称不能为空');
          return
        }
        
        that.$axios.post('/Home/BrandSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.pass = true;
              that.handleClose(obj);
              that.$refs[ 'upload' ].resetFields();
            } else {
              that.$message.error(res.msg);
            }
            // that.reload()
            // that.isClose=false
          })
          .catch(e => {
            console.log(e);
          })
        
        // console.log(this.formData.ImgBase);
      },
      getBase64Url(url) {
        this.formData.ImgBase = url;
        // console.log(this.formData.ImgBase);
      }
    }
  }
</script>

<style scoped lang="stylus">

  .dialogWrapper
    #imgWrapper, #info
      display inline-block
    
    #imgWrapper
      vertical-align top
    
    #info
      width: 60%
      margin-left: 20px


</style>
