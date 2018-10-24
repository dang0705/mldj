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
        <el-form-item prop="ChannelCode">
          <el-input v-model="formData.ChannelCode" clearable placeholder="渠道编号" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ChannelName">
          <el-input v-model="formData.ChannelName" clearable placeholder="渠道名称" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ChannelDec">
          <el-input type="textarea" v-model="formData.ChannelDec" placeholder="渠道描述" maxlength="250"></el-input>
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
  let Msg='';

  export default {
    // inject:['reload'],
    name: "channelManagement_dialog",
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
            this.formData.ChannelCode = this.editData.ChannelCode;
            this.formData.ChannelName = this.editData.ChannelName;
            this.formData.ChannelDec = this.editData.ChannelDec;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑渠道'
            Msg='编辑成功';
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增渠道'
            Msg='增加成功';
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
        if ( that.formData.ChannelCode === '' ) {
          that.$message.error('供应商编号不能为空');
          return
        }
        else if ( that.formData.ChannelName === '' ) {
          that.$message.error('供应商名称不能为空');
          return
        }
        
        axios.post('/api/Home/ChannelSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('ChannelUpdateData');
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
