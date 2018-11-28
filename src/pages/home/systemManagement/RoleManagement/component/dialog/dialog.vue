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
        <el-form-item prop="RoleName">
          <el-input v-model="formData.RoleName" clearable placeholder="角色名称" minlength="1"
                    maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
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
        file: false,
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
        ,
        editString: ''
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
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增角色';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      /*confirm() {
        this.$emit('closeAlert');
        this.addOrEdit='';
      },*/
      getDate(val) {
        console.log(val);
        if ( val ) {
          this.formData.serviceTime = val;
        }
      },
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        this.formData.serviceTime = [];
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
        if ( that.formData.RoleName === '' ) {
          that.$message.error('公司名称不能为空');
          return
        }
        that.postData()
        
        
      }
      ,
      postData() {
        const that = this;
        var params = '';
        params += '&RoleName=' + that.formData.RoleName;
        if ( that.formData.DogType === 'a_dd' ) {
          that.postUrl = '/OrganizationalRole/AddRole'
        } else {
          that.postUrl = '/OrganizationalRole/UpdRole';
          params += '&ID=' + that.formData.ID;
        }
        
        
        console.log(that.formData.serviceTime);
        
        that.$axios.post(that.postUrl, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.$emit('closeAlert');
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
    ,
    mounted() {
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
