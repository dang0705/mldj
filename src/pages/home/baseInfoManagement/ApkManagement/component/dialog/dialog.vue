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
        
        <el-form-item prop="ApkCode" label="版本编号">
          <el-input
            :autofocus="true"
            v-model="formData.ApkCode"
            clearable
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ApkName" label="版本名称">
          <el-input v-model="formData.ApkName" clearable minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ApkDec" label="版本描述">
          <el-input type="textarea" v-model="formData.ApkDec" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="上传APK" prop="ApkUrl">
          <upload
            btnValue="上传APK"
            listType="text"
            :getUploadType="uploadType"
            @hasFile="hasFile"
          >
          </upload>
          <el-tag v-if="formData.ApkUrl">{{formData.ApkUrl}}</el-tag>
          <el-progress type="circle" id="progressBar"
                       :percentage="uploadProgress"
                       v-if="uploadProgress>0&&uploadProgress<100"
          ></el-progress>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"
      >
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
        uploadProgress: 0,
        uploadType: '.apk',
        formData: {
          ApkCode: '',
          ApkName: '',
          ApkDec: '',
          ApkUrl: '',
          UpBusinessLicense: {},
        }
        ,
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
      }
    },
    
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            this.alertTitle = '编辑版本'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增版本';
          }
          // this.formData.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.cancel();
          if ( this.uploadProgress === 0 || this.uploadProgress === 100 ) {
            this.$emit('closeAlert', 'n');
          }
          
        } else {
          this.$emit('closeAlert');
        }
      },
      
      hasFile(hasFile) {
        if ( hasFile ) {
          this.formData.ApkUrl = hasFile.name;
          this.formData.UpBusinessLicense = hasFile;
        }
      },
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.ApkCode === '' ) {
          that.$message.error('Apk编号不能为空');
          return
        } else if ( that.formData.ApkName === '' ) {
          that.$message.error('Apk名称不能为空');
          return
        } else if ( !this.formData.UpBusinessLicense && this.editOrAdd === 'a_dd' ) {
          that.$message.error('Apk必须上传');
          return
        }
        const myForm = new window.FormData();
        myForm.append('UpBusinessLicense', this.formData.UpBusinessLicense);
        myForm.append('ApkCode', this.formData.ApkCode);
        myForm.append('ApkName', this.formData.ApkName);
        myForm.append('ApkDec', this.formData.ApkDec);
        myForm.append('DogType', this.editOrAdd);
        if ( this.editOrAdd === 'up_date' ) {
          myForm.append('ID', this.editData.ID);
        }
  
        let CancelToken=that.$axios.CancelToken;
  
        const options = {
          url: '/Home/ApkSave',
          data: myForm,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          cancelToken: new CancelToken(function executor(c) {
            that.cancel = c;
            console.log(c)
            // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
          }),
          onUploadProgress: progressEvent => {
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
            this.uploadProgress = complete;
            // console.log(complete);
            this.$emit('getProgress', complete)
          }
        };
        that.$axios(options)
          .then(data => {
            // console.log(data);
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success("上传成功");
              that.handleClose(obj);
            } else {
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
  
  #progressBar
    display block
</style>
