<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      @closed="closed"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
      >
        <el-form-item prop="BrandCode">
          <el-input v-model="formData.BrandCode" clearable placeholder="品牌编号" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="BrandName"
        >
          <el-input v-model="formData.BrandName" clearable placeholder="品牌名称" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formData.BrandShowText" clearable placeholder="品牌简介" minlength="1"
                    maxlength="15"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="formData.BrandComments" placeholder="品牌描述" maxlength="250"></el-input>
        </el-form-item>
        <div id="imgWrapper">
          <img :src="editFormData.ImgBase" alt="" v-show="!formData.ImgBase" width="200">
        </div>
        <!--上传图片插件-->
        <el-form-item>
          <upload :isClose="isClose" @closeDialog="handleClose" @getBase64Url="getBase64Url"
                  :getUpLoadTitle="upLoadTitle"
                  :getUploadType="uploadType"></upload>
        </el-form-item>
      </el-form>
      
      
      <!--<div slot="footer" class="dialog-footer">-->
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/component/common/upload/uploadList'
  let Msg='';
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
        uploadType: 'image/jpeg',
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
        ,
        editString: ''
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
          if ( this.editOrAdd==='up_date' ) {
            this.formData.BrandCode = this.editData.BrandCode;
            this.formData.BrandName = this.editData.BrandName;
            this.formData.BrandComments = this.editData.BrandComments;
            this.formData.BrandShowText = this.editData.BrandShowText;
            this.formData.ID = this.editData.ID;
            this.editFormData.ImgBase = this.editData.ImgBase;
            this.alertTitle = '编辑品牌'
            Msg='编辑成功'
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增品牌';
            Msg='增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        }
        
      }
    },
    
    methods: {
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        this.formData.ImgBase = '';
        this.editFormData.ImgBase = ''
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(this.imageUrl);
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

      confirmUpload() {
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
              that.$emit('closeAlert');
              that.$store.commit('BrandUpdateData');
              that.$refs[ 'upload' ].resetFields();
              that.formData.ImgBase = '';
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
  .dialogWrapper >>> .el-dialog
    width 300px
    max-width 800px
    text-align center
  
  .dialogWrapper >>> .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .dialogWrapper >>> .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .dialogWrapper >>> .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
