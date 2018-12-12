<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
    >
      <el-form
        :model="formData"
        :rules="uploadRules"
        label-width="120px"
        align="left"
      >
        
        <el-form-item prop="payname" label="支付名称：">
          <el-input
            :autofocus="true"
            v-model="formData.payname"
            clearable
            minlength="1"
            maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="account" label="商户号：">
          <el-input v-model="formData.account" clearable minlength="1" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="APPID" label="APPID：">
          <el-input v-model="formData.APPID" clearable minlength="1" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="pkey" label="API密钥：">
          <el-input v-model="formData.pkey" clearable minlength="1" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="上传证书" prop="SSLCERT_PATH">
          <upload
            btnValue="上传证书"
            listType="text"
            :getUploadType="uploadType"
            @hasFile="hasFile"
          >
          </upload>
          <el-tag v-if="formData.SSLCERT_PATH">{{formData.SSLCERT_PATH}}</el-tag>
          <el-progress type="circle" id="progressBar"
                       :percentage="uploadProgress"
                       v-if="uploadProgress>0&&uploadProgress<100"
          ></el-progress>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/component/common/upload/uploadList'
  
  export default {
    name: "payment_dialog",
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
        uploadProgress: 0,
        alertTitle: '',
        uploadType: '.p12',
        formData: {
          payname: '',
          APPID: '',
          pkey: '',
          account: '',
          SSLCERT_PATH: '',
          UpBusinessLicense: {},
          DogType: "up_date"
        }
        ,
        uploadRules: {
          payname: [
            {
              required: true,
              message: '支付名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          APPID: [
            {
              required: true,
              message: 'APPID为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          account: [
            {
              required: true,
              message: '商户号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          pkey: [
            {
              required: true,
              message: '密钥为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          SSLCERT_PATH: [
            {
              required: true,
              message: '证书必须上传为必填项',
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
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            this.alertTitle = '编辑支付方式'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增支付方式';
          }
          this.formData.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          if ( this.uploadProgress === 0 || this.uploadProgress === 100 ) {
            this.$emit('closeAlert', 'n');
          }
        } else {
          this.$emit('closeAlert');
        }
      },
      
      hasFile(hasFile) {
        if ( hasFile ) {
          this.formData.SSLCERT_PATH = hasFile.name;
          this.formData.UpBusinessLicense = hasFile;
        }
      },
      confirmUpload(obj) {
        let that = this;
        if ( !that.formData.payname ) {
          that.$message.error('支付名称不能为空');
          return
        } else if ( !this.formData.account ) {
          that.$message.error('商户号不能为空');
          return
        } else if ( !that.formData.APPID ) {
          that.$message.error('APPID不能为空');
          return
        } else if ( !this.formData.pkey ) {
          that.$message.error('API密钥不能为空');
          return
        } else if ( !this.formData.UpBusinessLicense && this.formData.DogType === 'a_dd' ) {
          that.$message.error('证书文件必须上传');
          return
        }
        const myForm = new window.FormData();
        myForm.append('UpBusinessLicense', this.formData.UpBusinessLicense);
        myForm.append('payname', this.formData.payname);
        myForm.append('account', this.formData.account);
        myForm.append('pkey', this.formData.pkey);
        myForm.append('APPID', this.formData.APPID);
        myForm.append('DogType', this.editOrAdd);
        if ( this.editOrAdd === 'up_date' ) {
          myForm.append('ID', this.editData.ID);
        }
        
        const options = {
          url: '/Home/pay',
          data: myForm,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
            this.uploadProgress = complete;
            // console.log(complete);
            this.$emit('getProgress', complete)
          }
          
        };
        
        that.$axios(options)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.handleClose(obj);
              that.$message.success("上传成功");
            } else {
              that.$message.error(res.msg)
            }
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
  
  #progressBar
    display block
</style>
