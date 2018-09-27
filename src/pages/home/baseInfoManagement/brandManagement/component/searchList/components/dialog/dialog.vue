<template>
  <div id="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      title="新增品牌"
      :close-on-click-modal='false'
      :before-close="handleClose"
      @closed="closed"
    >
      <upload ref="uploadList"></upload>
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button type="primary" @click="confirm">确 定</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/components/common/upload/uploadList'
  
  export default {
    name: "brandManagement_dialog",
    components: {
      upload
    },
    props: {
      isAlertShow: {
        type: Boolean
      }
    },
    data() {
      return {
      }
    },
    methods: {
      confirm() {
        this.$emit('closeAlert')
      },
      handleClose() {
        this.$emit('closeAlert');
        this.$refs.uploadList.resetFields();
      },
      closed() {
        this.$store.commit('clearUpload')
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
        
      }
    }
  }
</script>

<style scoped lang="stylus">
  #dialogWrapper >>> .el-dialog
    width 300px
    max-width 800px
  
  #dialogWrapper >>> .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  #dialogWrapper >>> .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  #dialogWrapper >>> .avatar-uploader-icon {
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
