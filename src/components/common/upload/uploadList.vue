<template>
  <div class="img-list">
    <div class="img-content">
      <el-form
        :model="form"
        ref="uploadList"
      >
        <el-form-item prop="imgUrl">
          <img :src="imagelist.url" v-model="form.imgUrl">
        </el-form-item>
        
        <el-form-item prop="name">
          <div class="name">
            <div v-model="form.name">{{ imagelist.name }}</div>
            <el-button type="text" @click="handleFileName()">修改名字</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 删除icon -->
      <div class="del">
        <i @click="handleFileRemove()" class="el-icon-delete"></i>
      </div>
      <!-- 放大icon -->
      <div class="layer" @click="handleFileEnlarge(imagelist.url)">
        <i class="el-icon-view"></i>
      </div>
    </div>
    
    <div v-if="!pass && progress !== 0" class="img-content img-progress">
      <el-progress type="circle" :percentage="progress" :status="proStatus"></el-progress>
    </div>
    
    <div class="img-upload">
      <el-upload class="uploader" accept="image/*"
                 ref="upload"
                 list-type="picture"
                 drag
                 :action="params.action"
                 :auto-upload="false"
                 :show-file-list="false"
                 :data="params.data"
                 :on-change="uploadOnChange"
                 :on-progress="uploadOnProgress"
                 :http-request="uploadImg"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-dialog title=""
               :visible.sync="isEnlargeImage"
               size="large"
               :modal-append-to-body="false"
               top="8%"
               width="60%">
      <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
    <el-button type="primary" @click="confirmUpload">确 定</el-button>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'querystringify'
  
  export default {
    name: 'upload-list',
    data() {
      return {
        form: {
          imgUrl: '',
          name: ''
        },
        progress: 0,//上传进度
        pass: null,//是否上传成功
        isEnlargeImage: false,//放大图片
        enlargeImage: '',//放大图片地址
        imagelist: {},
        fileList:{},
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
      }
    },
    methods: {
      uploadImg() {
        console.log('upload');
        let that = this;
        console.log(that.fileList);
        axios.post('http://v2.1shi.com.cn:8078/Company/UpLoadCertified', qs.stringify({
          ID: '12',
          UpBusinessLicense: that.fileList
        }))
        // axios.get('https://api.shi1.cn/yl/YLHandler.ashx?type=PrizeClawB&action=volume&number=999').then(function (data) {
        //   console.log(data);
        // })
        // axios.post('http://yl.1shi.com.cn', qs.stringify({
        //   type: 'PeaceBirdPhone',
        //   image: that.imagelist[ 3 ].url,
        //   action: 'UploadPic',
        //   site: '20',
        //   openid: 'openid'
        // }))
          .then(data => {
            console.log(data);
            that.$message.success("上传成功");
            this.pass = true;
          })
          .catch(e => {
            console.log(e);
          })
      },
      confirmUpload() {
        this.$refs.upload.submit();
      },
      uploadOnProgress(e, file) {//开始上传
        console.log(e.percent, file);
        this.progress = Math.floor(e.percent)
      },
      uploadOnChange(file) {
        console.log("——————————change——————————");
        console.log(file);
        if ( file.status === 'ready' ) {
          console.log("ready");
          this.pass = null;
          this.progress = 0;
          // this.imagelist={
          //   url: file.url,
          //   name: '新增图片'
          // }
  
          const reader = new FileReader();
          reader.readAsDataURL(file.raw);
          var that = this;
          reader.onload = function (e) {
            console.log(e.target.result);
            that.imagelist={
              url: e.target.result,
              name: '新增图片'
            };
            console.log(that.imagelist);
          };
          
        } else if ( file.status === 'fail' ) {
          this.$message.error("图片上传出错，请刷新重试！");
        }
      },
      uploadOnSuccess(e, file, fileList) {//上传附件
        // console.log("——————————success——————————");
        // const reader = new FileReader();
        // reader.readAsDataURL(file.raw);
        // var that = this;
        // reader.onload = function (e) {
        //   console.log(e.target.result);
        //   that.imagelist.push({
        //     url: e.target.result,
        //     name: '新增图片'
        //   });
        //   console.log(that.imagelist);
        // };
        // this.pass = true;
        // this.$message.success("上传成功");
        
      },
      
      handleFileEnlarge(_url) {//放大图片
        console.log(_url)
        if ( _url ) {
          this.enlargeImage = _url;
          this.isEnlargeImage = !this.isEnlargeImage;
        }
      },
      handleFileName(file, i) {//修改名字
        console.log(file, i)
        let that = this;
        this.$prompt("请输入新文件名：", "提示：", {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          if ( !value ) {
            return false;
          }
          //可添加ajax
          this.$message.success("操作成功");
          that.imagelist.name = value;
          console.log(that.fileList);
          
        }).catch(() => {
        })
      },
      handleFileRemove(file, i) {//删除图片
        console.log(file, i);
        if ( !file.url ) {
          return false;
        }
        let that = this;
        this.$confirm('是否删除此附件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //可添加ajax
          that.imagelist.splice(i, 1);
          that.fileList.splice(i, 1);
          this.$message({
            type: 'success',
            message: '删除成功',
            onClose: () => {
            }
          });
          this.$message.success("删除成功")
        }).catch((meg) => console.log(meg))
      },
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }
  
  .img-list {
    overflow: hidden;
    width: 100%;
  }
  
  .img-list .img-content {
    float: left;
    text-align: left;
    position: relative;
    display: inline-block;
    width: 200px;
    height: 270px;
    padding: 5px;
    margin: 5px 20px 20px 0;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    transition: all .3s;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
  
  .img-list .img-upload {
    float: left;
    width: 200px;
    height: 270px;
    display: table;
    text-align: center;
  }
  
  .img-list .uploader {
    width: 100%;
    display: table-cell;
    vertical-align: middle;
  }
  
  .img-list .img-progress {
    text-align: center;
    padding-top: 50px;
  }
  
  .img-list .img-content img {
    display: block;
    width: 100%;
    height: 190px;
    margin: 0 auto;
    border-radius: 4px;
  }
  
  .img-list .img-content .name {
    margin-top: 10px;
  }
  
  .img-list .img-content .name > div {
    width: 90%;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 25px;
    line-height: 25px;
  }
  
  .img-list .img-content:hover .del,
  .img-list .img-content:hover .layer {
    opacity: 1;
  }
  
  .img-list .img-content .del,
  .img-list .img-content .layer {
    opacity: 0;
    transition: all .3s;
  }
  
  .img-list .img-content .del {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #8492a6;
    cursor: pointer;
    font-size: 1.1em;
  }
  
  .img-list .img-content .layer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 200px;
    color: #fff;
    text-align: center;
    z-index: 5;
    background-color: rgba(0, 0, 0, .4);
  }
  
  .img-list .img-content .layer i {
    font-size: 1.6em;
    margin-top: 80px;
  }
</style>
