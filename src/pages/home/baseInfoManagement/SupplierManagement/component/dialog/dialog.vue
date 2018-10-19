<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle||'新增供应商'"
      :close-on-click-modal='false'
      :before-close="handleClose"
      @closed="closed"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
      >
        <el-form-item prop="SupplierContactCode">
          <el-input v-model="formData.SupplierContactCode" clearable placeholder="供应商编号" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierName">
          <el-input v-model="formData.SupplierName" clearable placeholder="供应商名称" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierContactPhone">
          <el-input v-model="formData.SupplierContactPhone" clearable placeholder="供应商联系人电话" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierContactName">
          <el-input v-model="formData.SupplierContactName" clearable placeholder="供应商联系人姓名" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierDec">
          <el-input type="textarea" v-model="formData.SupplierDec" placeholder="供应商描述"></el-input>
        </el-form-item>
        <!--  <div id="imgWrapper">
			<img :src="editFormData.ImgBase" alt="" v-show="!formData.ImgBase" width="200" >
		  </div>-->
      </el-form>
      
      <!--上传图片插件-->
      <upload :isClose="isClose" @closeDialog="handleClose" :isDisplay="isDisplay"></upload>
      <!--<div slot="footer" class="dialog-footer">-->
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/components/common/upload/uploadList'
  import axios from 'axios'
  
  export default {
    // inject:['reload'],
    name: "SupplierManagement_dialog",
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
        // upLoadTitle: '上传APK',
        alertTitle: '',
        isDisplay: true,
        uploadType: '.apk',
        file: false,
        formData: {
          SupplierContactCode: '',
          SupplierName: '',
          SupplierContactPhone: '',
          SupplierContactName: '',
          SupplierDec: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          SupplierContactCode: [
            {
              required: true,
              message: '供应商编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          SupplierName: [
            {
              required: true,
              message: '供应商名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          SupplierContactPhone: [
            {
              required: true,
              message: '供应商联系人电话为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          SupplierContactName: [
            {
              required: true,
              message: '供应商联系人姓名为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
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
        if ( this.editOrAdd ) {
          if ( this.isAlertShow === true ) {
            console.log(this.editData);
            this.editString = this.editOrAdd;
            this.formData.SupplierContactCode = this.editData.SupplierContactCode;
            this.formData.SupplierName = this.editData.SupplierName;
            this.formData.SupplierContactPhone = this.editData.SupplierContactPhone;
            this.formData.SupplierContactName = this.editData.SupplierContactName;
            this.formData.SupplierDec = this.editData.SupplierDec;
            this.formData.ID = this.editData.ID;
            // this.editFormData.ImgBase = this.editData.ImgBase;
            this.formData.DogType = this.editString;
            console.log(this.formData.DogType);
            this.alertTitle = '编辑供应商'
          } else {
            this.editString = '';
          }
        } else {
          console.log(this.formData.DogType);
        }
        
      }
    },
    
    methods: {
      /*confirm() {
        this.$emit('closeAlert');
        this.addOrEdit='';
      },*/
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        // this.formData.ImgBase='';
        // this.editFormData.ImgBase=''
        // this.$refs.uploadList.resetFields();
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      hasFile(hasFile) {
        console.log(hasFile);
        this.file = hasFile;
      },
      confirmUpload() {
        let that = this;
        if ( that.formData.SupplierContactCode === '' ) {
          that.$message.error('供应商编号不能为空');
          return
        }
        else if ( that.formData.SupplierName === '' ) {
          that.$message.error('供应商名称不能为空');
          return
        }
        else if ( that.formData.SupplierContactPhone === '' ) {
          that.$message.error('供应商联系人电话不能为空');
          return
        }
        else if ( that.formData.SupplierContactName === '' ) {
          that.$message.error('供应商联系人姓名不能为空');
          return
        }
        
        
        axios.post('/api/Home/SupplierContactSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              
              that.$message.success("上传成功");
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('SupplierUpdateData');
              that.$refs[ 'upload' ].resetFields();
            }
            else {
              that.$message.error(res.msg);
            }
            // that.reload()
            // that.isClose=false
          })
          .catch(e => {
            console.log(e);
          })
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
