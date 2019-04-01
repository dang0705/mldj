<template>
  <div class="uploaderWrapper">
    <el-upload
      :accept="uploadType"
      ref="upload"
      :action="params.action"
      :auto-upload="false"
      :show-file-list="false"
      :data="params.data"
      :on-change="uploadOnChange"
    >
      <el-button size="large" class="add">增加+</el-button>
    </el-upload>
    <video src="" hidden id="video"></video>
  </div>
</template>

<script>
  import md5 from 'md5'
  
  const storage = window.localStorage;
  let xhr = new XMLHttpRequest();
  
  export default {
    name: 'uploader',
    props: {
      isAlertShow: {
        type: Boolean
      }
      ,
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
      }
    },
    data() {
      return {
        progressValue: 0,
        maxSize: 1024 * 1024 * 4,
        chunkSize: 1024 * 1024 * 4,
        hash: '',
        requestCount: 0,
        startPosition: '',
        chunksLength: '',
        file: '',
        fileName: '',
        fileType: '',
        fileSize: '',
        videoDuration: '',
        checkFileParams: '',
        EmployeeCode: storage.getItem('userName'),
        uploadUrl: '/Handler/UploadFileHandler.ashx',
        uploadType: '',
        params: {
          action: '',
          data: {}
        }
      }
    },
    watch: {
      'isAlertShow': function () {
        console.log(this.isAlertShow);
        if ( !this.isAlertShow ) {
          this.progressValue = 0;
          this.fileName = '';
        }
      }
    },
    methods: {
      uploadOnChange(file) {
        const that = this,
          val = file.raw,
          mp4 = "video/mp4",
          jpg = "image/jpeg",
          png = "image/png",
          apk = 'application/vnd.android.package-archive';
        that.file = val;
        if ( val && (val.type === mp4 || val.type === jpg || val.type === png || val.type === apk || /\.apk$/.test(val.name.toLocaleLowerCase())) ) {
          if ( (val.type === jpg || val.type === png) && val.size > that.maxSize ) {
            that.$message.error("素材大小超过最大上传限制（4MB），请更换素材！");
            return;
          }
          /*  if ( val.type === png ) {
			  that.$message.error("图片只支持png，请更换素材！");
			  return;
			}*/
          that.fileSize = val.size;
          that.chunksLength = (Math.ceil(that.fileSize / that.chunkSize)).toString();
          if ( val.type === 'video/mp4' ) {
            let url = null,
              video = document.getElementById('video');
            if ( window.createObjectURL !== undefined ) {
              url = window.createObjectURL(val);
            } else if ( window.URL !== undefined ) {
              url = window.URL.createObjectURL(val);
            } else if ( window.webkitURL !== undefined ) {
              url = window.webkitURL.createObjectURL(val);
            }
            video.src = url;
            video.oncanplay = function () {
              that.videoDuration = Math.floor(video.duration);
            };
            that.fileType = 1;
          } else if ( val.type === "image/jpeg" || val.type === "image/png" ) {
            that.fileType = 0
          } else {
            that.fileType = 2
          }
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(val);
          fileReader.onload = function (e) {
            that.hash = md5(e.target.result);
            console.log(that.hash);
            that.checkFileParams += '&action=checkfile&filename=' + val.name + '&hash=' + that.hash + '&EmployeeCode=' + that.EmployeeCode;
            that.checkFile(val)
          };
          
        } else {
          that.$message.error("只能上传.mp4，.jpg，.png,.apk素材！"); /*抽象*/
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
              that.fileName = val.name;
              if ( data.StartPos < val.size ) {
                that.requestCount = 0;
                that.startPosition = data.StartPos;
                that.uploadFile(Math.floor(that.startPosition / that.chunkSize))
              } else {
                that.$message.error('服务器已存在相同素材,请更换素材')
                that.fileName = '';
              }
            } else {
              that.$message.error(data.msg)
            }
          }).catch(e => {
          that.checkFileParams = '';
        })
      }
      ,
      uploadFile(i) {
        let that = this;
        if ( that.fileType == 1 ) {
          if ( isNaN(that.videoDuration) ) {
            that.$message.error('无法获取视频时长，请更换素材！');
            return false;
          }
        }
        if ( i < that.chunksLength ) {
          var url = that.uploadUrl + '?action=uploadfile&filename=' + that.fileName + "&hash=" + that.hash + "&endPosition=" + that.fileSize + "&EmployeeCode=" + that.EmployeeCode;
          if ( that.requestCount === 0 ) {
            url += '&Keyid=' + 0;
          }
          xhr.upload.onprogress = function (evt) {
            if ( evt.lengthComputable ) {
              that.progressValue = Math.round((that.chunkSize * i + evt.loaded) * 100 / that.fileSize);
              that.$emit('getProgressValue', that.progressValue)
            } else {
              console.log('无法计算');
            }
          };
          let chunks;
          if ( i < that.chunksLength ) {
            chunks = (that.requestCount === 0 ? that.file.slice(that.startPosition, that.chunkSize * (i + 1)) : that.file.slice(that.chunkSize * i, that.chunkSize * (i + 1)));
          } else {
            chunks = that.file.slice(that.chunkSize * i, that.fileSize);
          }
          // alert(1);
          xhr.open("POST", url);
          xhr.onload = function (evt) {
            if ( (i + 1) == that.chunksLength ) {
              var params = '&action=endfileupload&filename=' + that.fileName
                + '&hash=' + that.hash
                + '&endPosition=' + that.fileSize
                + '&time_long=' + (that.fileType !== 1 ? 0 : that.videoDuration)
                + '&EmployeeCode=' + that.EmployeeCode
                + '&FileType=' + that.fileType;
              that.$axios.post(that.uploadUrl, params)
                .then(data => {
                  let res = data.data;
                  if ( res.state == 200 && res.msg === '成功!' ) {
                    that.$message.success("上传成功");
                    that.$emit('closeAlert');
                    that.file = chunks = null;
                  } else {
                    that.$message.error(res.msg);
                  }
                })
            }
          };
          
          xhr.onreadystatechange = function () {
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
              ++that.requestCount;
              that.uploadFile(i + 1);
            }
          };
          
          
          xhr.onerror = function (evt) {
            that.$message.error("上传素材发生了错误尝试");
          };
          xhr.onabort = function (evt) {
            that.$message.error("上传被取消或者浏览器断开连接");
            
          };
          xhr.send(chunks)
        }
      }
      ,
      handleFileEnlarge(_url) {//放大图片
        // console.log(_url);
        if ( _url ) {
          this.enlargeImage = _url;
          this.isEnlargeImage = !this.isEnlargeImage;
        }
      },
    },
    mounted() {
      this.uploadType = this.getUploadType;
      this.isShow = this.isDisplay;
    }
  }
</script>

<style lang="stylus" scoped>

</style>
