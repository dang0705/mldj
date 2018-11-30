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
      >
        <el-form-item>
          <upload-files
            :isAlertShow="isAlertShow"
            :getUploadType="uploadType"
            @uploaded="getUploadStatus"
          >
          </upload-files>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  // import upload from '@/component/common/upload/uploadList'
  import uploadFiles from '../contentList/uploader/uploader'
  
  export default {
    // inject:['reload'],
    name: "sourceManagement_dialog",
    components: {
      uploadFiles
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
        alertTitle: '新增素材',
        isUploaded:false,
        uploadType: 'image/jpg,image/jpeg,image/png,video/mp4,.apk',
        formData: {
          ApkCode: '',
          ApkName: '',
          ApkDec: '',
          DogType: "up_date"
        }
        ,
        editFormData: {},
        editString: ''
      }
    },
    methods: {
      getUploadStatus(val){
        const that=this;
        that.isUploaded=val;
        setTimeout(function () {
          that.$emit('closeAlert');
          that.$emit('updateList')
        },2000)
      },
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
      },
    }
    
  }
</script>

<style scoped lang="stylus">

</style>
