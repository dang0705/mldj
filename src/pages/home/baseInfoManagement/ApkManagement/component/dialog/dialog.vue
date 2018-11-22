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
        <el-form-item prop="ApkCode">
          <el-input
            :autofocus="true"
            v-model="formData.ApkCode"
            clearable
            placeholder="版本编号"
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ApkName">
          <el-input v-model="formData.ApkName" clearable placeholder="版本名称" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ApkDec">
          <el-input type="textarea" v-model="formData.ApkDec" placeholder="版本描述" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item>
          <upload :isClose="isClose" @closeDialog="handleClose" :getUpLoadTitle="upLoadTitle"
                  :getUploadType="uploadType" @hasFile="hasFile"></upload>
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
  import axios from 'axios'
  
  export default {
    // inject:['reload'],
    name: "apkManagement_dialog",
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
        upLoadTitle: '上传APK',
        uploadType: '.apk',
        formData: {
          ApkCode: '',
          ApkName: '',
          ApkDec: '',
          UpBusinessLicense: {},
          DogType: "up_date"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          ApkCode: [
            {
              required: true,
              message: '版本编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          ApkName: [
            {
              required: true,
              message: '版本名称为必填项',
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
          if ( this.editOrAdd === 'up_date' ) {
            this.formData.ApkCode = this.editData.ApkCode;
            this.formData.ApkName = this.editData.ApkName;
            this.formData.ApkDec = this.editData.ApkDec;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑版本'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增版本';
          }
          this.formData.DogType = this.editOrAdd;
          console.log(this.formData.DogType);
        }
      }
    },
    
    methods: {
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      hasFile(hasFile) {
        console.log(hasFile);
        this.formData.UpBusinessLicense = hasFile;
      },
      confirmUpload() {
        let that = this;
        if ( that.formData.ApkCode === '' ) {
          that.$message.error('Apk编号不能为空');
          return
        } else if ( that.formData.ApkName === '' ) {
          that.$message.error('Apk名称不能为空');
          return
        } else if ( !this.formData.UpBusinessLicense && this.formData.DogType === 'a_dd' ) {
          that.$message.error('Apk必须上传');
          return
        }
        
        
        axios.post('/api/Home/ApkSave', this.formData)
          .then(data => {
            // console.log(data);
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success("上传成功");
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('ApkUpdateData');
              that.$refs[ 'upload' ].resetFields();
            }
            else {
              that.$message.error(res.msg)
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
