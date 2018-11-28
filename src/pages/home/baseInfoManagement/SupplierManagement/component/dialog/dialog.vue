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
        label-width="150px"
      >
        <el-form-item prop="SupplierContactCode" label="供应商编号：">
          <el-input v-model="formData.SupplierContactCode" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierName" label="供应商名称：">
          <el-input v-model="formData.SupplierName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierContactPhone" label="供应商联系人电话：">
          <el-input v-model="formData.SupplierContactPhone" clearable minlength="1"
                    maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierContactName" label="供应商联系人姓名：">
          <el-input v-model="formData.SupplierContactName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="SupplierDec" label="供应商描述：">
          <el-input type="textarea" clearable v-model="formData.SupplierDec" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  let Msg = '';
  export default {
    name: "SupplierManagement_dialog",
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
        isDisplay: true,
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
              max: 11,
              message: '长度请在1~11个字符',
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
              max: 10,
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
          this.formData.DogType = this.editOrAdd;
          if ( this.editOrAdd === 'up_date' ) {
            console.log(this.editData);
            this.formData.SupplierContactCode = this.editData.SupplierContactCode;
            this.formData.SupplierName = this.editData.SupplierName;
            this.formData.SupplierContactPhone = this.editData.SupplierContactPhone;
            this.formData.SupplierContactName = this.editData.SupplierContactName;
            this.formData.SupplierDec = this.editData.SupplierDec;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑供应商'
            Msg = '编辑成功'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.formData.DogType = this.editOrAdd;
            this.alertTitle = '新增供应商';
            Msg = '增加成功'
          }
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
      confirmUpload(obj) {
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
        else if ( !/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(that.formData.SupplierContactPhone) ) {
          that.$message.error('手机格式不正确不能为空');
          return
        }
        else if ( that.formData.SupplierContactName === '' ) {
          that.$message.error('供应商联系人姓名不能为空');
          return
        }
        
        
        that.$axios.post('/Home/SupplierContactSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
              that.$store.commit('SupplierUpdateData');
              that.$refs[ 'upload' ].resetFields();
            }
            else {
              that.$message.error(res.msg);
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
