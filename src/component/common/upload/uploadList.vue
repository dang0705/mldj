<template>
  <div class="img-list" v-if="!isShow">
    <el-upload class="uploader"
               :accept="uploadType"
               ref="upload"
               list-type="picture"
               :action="params.action"
               :auto-upload="false"
               :show-file-list="false"
               :data="params.data"
               :on-change="uploadOnChange"
    >
      <img v-if="imgUrl||clearSrc" :src="imgUrl||clearSrc" v-model="form.imgUrl" width="200px" class="avatar">
      <i v-else class="el-icon-plus uploader-icon"></i>
    </el-upload>
    <el-tag size="large" type="danger">{{btnValue||'上传图片'}}</el-tag>
  </div>
</template>

<script>
  export default {
    name: 'upload-list',
    props: {
      isDisplay: {
        type: Boolean
      },
      isClose: {
        type: Boolean
      },
      getUpLoadTitle: {
        type: String
      },
      getUploadType: {
        type: String
      },
      imgUrl: {
        type: String,
        default: ''
      },
      btnValue:{
        type:String
      }
    },
    data() {
      return {
        isShow: false,
        uploadTitle: '',
        uploadType: '',
        form: {
          imgUrl: '',
          name: ''
        },
        progress: 0,//上传进度
        pass: null,//是否上传成功
        isEnlargeImage: false,//放大图片
        enlargeImage: '',//放大图片地址
        imagelist: {},
        fileList: {},
        params: {
          action: '',
          data: {}
        }
      }
    },
    computed: {
      proStatus() {//上传状态
        if ( this.pass ) {
          return 'success'
        } else if ( this.pass === false ) {
          return 'exception'
        } else {
          return ''
        }
      },
      clearSrc() {
        let clearImg = this.isClose;
        return this.imagelist.url = clearImg ? '' : this.imagelist.url
      }
    },
    methods: {
      uploadOnChange(file) {
        console.log("——————————change——————————");
        console.log(file);
        let that = this;
        if ( file.status === 'ready' ) {
          // console.log("ready");
          this.pass = null;
          this.progress = 0;
          if ( file.size < 4 * 1024 * 1024 ) {
            const reader = new FileReader();
            if ( file.raw.type.indexOf('image') > -1 ) {
              reader.readAsDataURL(file.raw);
              reader.onload = function (e) {
                that.imagelist = {
                  url: e.target.result,
                  name: '新增图片'
                };
                that.$emit('getBase64Url', that.imagelist.url)
              };
            } else {
              // reader.readAsArrayBuffer(file.raw);
              that.$emit('hasFile', file.raw);
            }
          } else {
            that.$message.error('请上传小于4MB的图片')
          }
          
          
        } else if ( file.status === 'fail' ) {
          this.$message.error("图片上传出错，请刷新重试！");
        }
      },
      
      handleFileEnlarge(_url) {//放大图片
        if ( _url ) {
          this.enlargeImage = _url;
          this.isEnlargeImage = !this.isEnlargeImage;
        }
      },
    },
    mounted() {
      this.uploadTitle = this.getUpLoadTitle;
      this.uploadType = this.getUploadType;
      this.isShow = this.isDisplay;
    }
  }
</script>

<style lang="stylus" scoped>

</style>
