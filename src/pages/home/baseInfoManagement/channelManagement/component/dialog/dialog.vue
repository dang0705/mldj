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
        label-width="120px"
      
      >
        <el-form-item prop="ChannelCode" label="渠道编号：">
          <el-input v-model="formData.ChannelCode" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ChannelName" label="渠道名称：">
          <el-input v-model="formData.ChannelName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ChannelDec" label="渠道描述：">
          <el-input type="textarea" v-model="formData.ChannelDec" clearable maxlength="250"></el-input>
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
    // inject:['reload'],
    name: "channelManagement_dialog",
    
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
        uploadType: '.apk',
        file: false,
        formData: {
          ChannelCode: '',
          ChannelName: '',
          ChannelDec: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          ChannelCode: [
            {
              required: true,
              message: '渠道编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          ChannelName: [
            {
              required: true,
              message: '渠道名称为必填项',
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
            this.formData.ChannelCode = this.editData.ChannelCode;
            this.formData.ChannelName = this.editData.ChannelName;
            this.formData.ChannelDec = this.editData.ChannelDec;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑渠道';
            Msg = '编辑成功';
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增渠道';
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
      },
      closed() {
        this.$store.commit('clearUpload');
        this.isClose = true;
      },
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.ChannelCode === '' ) {
          that.$message.error('供应商编号不能为空');
          return
        }
        else if ( that.formData.ChannelName === '' ) {
          that.$message.error('供应商名称不能为空');
          return
        }
        
        that.$axios.post('/Home/ChannelSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
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
