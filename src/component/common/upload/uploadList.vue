<template>
  <div class="img-list" v-if="!isShow">
    <el-upload
      :accept="uploadType"
      :class="listType==='picture'?'uploader':''"
      ref="upload"
      :list-type="listType"
      :action="params.action"
      :auto-upload="false"
      :show-file-list="false"
      :data="params.data"
      :on-change="uploadOnChange"
      :file-list="myFileList"
    >
      <img v-if="imgUrl||clearSrc" :src="imgUrl||clearSrc" v-model="form.imgUrl" width="200px" class="avatar">
      <i  class="el-icon-plus uploader-icon" v-if="listType==='picture'&&(!imgUrl)"></i>
      <el-button size="small" type="primary" v-if="listType==='text'">上传文件</el-button>
      <!--<el-tag v-if="fileName">{{fileName}}</el-tag>-->
    </el-upload>
    <el-tag v-if="listType==='picture'" size="large" type="danger">{{btnValue||'上传图片'}}</el-tag>
  </div>
</template>

<script>
  export default {
    name: 'upload-list',
    props: {
      listType: {
        type: String,
        default: 'picture'
      },
      isDisplay: {
        type: Boolean
      },
      isClose: {
        type: Boolean
      },
      
      getUploadType: {
        type: String
      },
      imgUrl: {
        type: String,
        default: ''
      },
      btnValue: {
        type: String
      }
    },
    data() {
      return {
        isShow: false,
        uploadType: '',
        form: {
          imgUrl: '',
          name: ''
        },
        fileName: '',
        progress: 0,//上传进度
        pass: null,//是否上传成功
        isEnlargeImage: false,//放大图片
        enlargeImage: '',//放大图片地址
        imagelist: {},
        myFileList: [ {name: ''} ],
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
          const reader = new FileReader();
          if ( file.raw.type.indexOf('image') > -1 ) {
            if ( file.size < 4 * 1024 * 1024 ) {
              
              reader.readAsDataURL(file.raw);
              reader.onload = function (e) {
                that.imagelist = {
                  url: e.target.result,
                  name: '新增图片'
                };
                that.$emit('getBase64Url', that.imagelist.url)
              }
            } else {
              this.$message.error("上传的文件不能超过4MB");
            }
          } else {
            // reader.readAsArrayBuffer(file.raw);
            that.$emit('hasFile', file.raw);
            that.fileName = file.name
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
      console.log(this.fileName);
      this.uploadType = this.getUploadType;
      this.isShow = this.isDisplay;
    }
  }
</script>

<style lang="stylus" scoped>
  .img-list >>> .el-tag
    display block

</style>
