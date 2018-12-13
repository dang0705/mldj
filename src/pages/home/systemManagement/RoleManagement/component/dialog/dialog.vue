<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
      >
        <el-form-item prop="RoleName">
          <el-input v-model="formData.RoleName" clearable placeholder="角色名称" minlength="1"
                    maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  
  let Msg = '';
  export default {
    name: "roleManagement_dialog",
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String,
        default: 'up_date'
      },
      editData: {
        type: Object
      }
    },
    data() {
      return {
        alertTitle: '',
        alertShow: false,
        isDisplay: true,
        formData: {
          RoleName: '',
          AccountName: '',
          ID: '',
        }
        ,
        postUrl: '',
        editFormData: {},
        uploadRules: {
          RoleName: [
            {
              required: true,
              message: '角色名称为必填项',
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
        this.alertShow = this.isAlertShow;
        if ( this.isAlertShow === true ) {
          console.log(this.editOrAdd);
          if ( this.editOrAdd === 'up_date' ) {
            this.formData.RoleName = this.editData.RoleName;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑角色';
            Msg = '编辑成功';
          } else {
            this.alertTitle = '新增角色';
            Msg = '增加成功';
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
        this.formData.serviceTime = [];
        this.formData.RoleName = '';
      },
      
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.RoleName === '' ) {
          that.$message.error('公司名称不能为空');
          return
        }
        that.postData(obj)
      }
      ,
      postData(obj) {
        const that = this;
        var params = '';
        params += '&RoleName=' + that.formData.RoleName;
        if ( that.formData.DogType === 'a_dd' ) {
          that.postUrl = '/OrganizationalRole/AddRole'
        } else {
          that.postUrl = '/OrganizationalRole/UpdRole';
          params += '&ID=' + that.formData.ID;
        }
        that.$axios.post(that.postUrl, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
              that.$refs[ 'upload' ].resetFields();
            } else {
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
