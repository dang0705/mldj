<template>
  <uploader
    ref="uploader"
    :options="options"
    class="uploader-example"
    @file-added="fileAdded"
    :autoStart="false"
    :file-status-text="statusText"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>可将文件拖拽至此</p>
      <uploader-btn :attrs="attrs">上传素材</uploader-btn>
      <!--<uploader-btn :attrs="attrs">select images</uploader-btn>-->
      <!--<uploader-btn :directory="true">select folder</uploader-btn>-->
    </uploader-drop>
    <uploader-list v-show="isUploaderListShow"></uploader-list>
    <video src="" hidden id="video"></video>
  </uploader>
</template>

<script>
  import md5 from 'md5'
  
  const storage = window.localStorage;
  export default {
    props: {
      isAlertShow: Boolean
    },
    data() {
      return {
        maxSize: 1024 * 1024 * 512,
        isUploaderListShow: false,
        hash: '',
        uploadUrl: 'api/Handler/UploadFileHandler.ashx',
        fileName: '',
        fileType: '',
        fileSize:'',
        videoDuration: '',
        checkFileParams: '',
        EmployeeCode: storage.getItem('userName'),
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          singleFile: true,
          testChunks: false,
       /*   uploadMethod: 'POST',
          testMethod:'POST',*/
          target: 'api/Handler/UploadFileHandler.ashx'
        ,
          query: {
            EmployeeCode:this.EmployeeCode,
            action: 'uploadfile',
            // hash:this.hash,
            // endPosition:this.fileSize,
          },
          chunkSize: 4 * 1024 * 1024,
          // uploadMethod: this.uploadMethod
          // testChunks: false
        },
        statusText: {
          success: '上传成功',
          error: '上传失败 ',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        }
        ,
        attrs: {
          accept: 'image/jpg,image/png,video/mp4,.apk',
        }
      }
    }
    ,
    methods: {
      uploadMethod() {
        const that = this;
        this.$axios.post(that.uploadUrl)
          .then(res => {
            console.log(res);
          })
      },
      fileAdded(val) {
        console.log(val);
        const that = this,
          mp4 = "video/mp4",
          jpg = "image/jpeg",
          png = "image/png",
          apk = 'application/vnd.android.package-archive';
        
        if ( val && (val.fileType === mp4 || val.fileType === jpg || val.fileType === png || val.fileType === apk || /\.apk$/.test(val.name.toLocaleLowerCase())) ) {
          if ( val.size > that.maxSize ) {
            that.$message.success("素材大小超过最大上传限制（512MB），请更换素材！");
            return;
          }
          that.fileName = val.name;
          that.fileSize=val.size;
          if ( val.fileType === 'video/mp4' ) {
            let url = null,
              video = document.getElementById('video');
            if ( window.createObjectURL !== undefined ) {
              url = window.createObjectURL(val.file);
            } else if ( window.URL !== undefined ) {
              url = window.URL.createObjectURL(val.file);
            } else if ( window.webkitURL !== undefined ) {
              url = window.webkitURL.createObjectURL(val.file);
            }
            video.src = url;
            video.oncanplay = function () {
              that.videoDuration = Math.floor(video.duration);
            };
            // this.$emit('getVideoUrl', url);
            that.fileType = 1;
          } else if ( val.fileType === "image/jpeg" || val.fileType === "image/png" ) {
            that.fileType = 0
          } else {
            that.fileType = 2
          }
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(val.file);
          fileReader.onload = function (e) {
            that.hash = md5(e.target.result);
            console.log(that.hash);
            that.checkFileParams += '&action=checkfile&filename=' + val.name + '&hash=' + that.hash + '&EmployeeCode=' + that.EmployeeCode;
            /* that.checkFileParams += '&filename=' + val.name;
			 that.checkFileParams += '&hash=' + that.hash;
			 that.checkFileParams += '&EmployeeCode=' + that.EmployeeCode;*/
            that.checkFile(val)
          };
          
        } else {
          that.$message.error("只能上传.mp4，.jpg，.png,.apk素材！");
          return false;
        }
        
      }
      ,
      checkFile(val) {
        const that = this;
        that.$axios.post(that.uploadUrl, that.checkFileParams)
          .then(res => {
            console.log(res);
            const data = res.data;
            that.checkFileParams = '';
            if ( data.state == 200 ) {
              that.checkFileParams = '';
              if ( data.StartPos < val.size ) {
                that.isUploaderListShow = true;
              } else {
                that.$message.error('服务器已存在相同素材!')
              }
            } else {
              that.$message.error(data.msg)
            }
          }).catch(e => {
          that.checkFileParams = '';
        })
      }
    }
    ,
    watch: {
      'isAlertShow': function () {
        this.isUploaderListShow = !this.isAlertShow
        
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader.uploader
      })
      // this.isUploaderListShow = this.isAlertShow;
    }
  }
</script>

<style>
  .uploader-example {
    width: 100%;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
