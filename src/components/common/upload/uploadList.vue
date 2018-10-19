<template>
  <div class="img-list" v-if="!isShow">
    <div class="img-content" v-show="imagelist.url">
      <el-form
        :model="form"
        ref="uploadList"
      >
        <el-form-item prop="imgUrl">
          <img :src="clearSrc" v-model="form.imgUrl" width="200px">
        </el-form-item>
        <!-- <el-form-item prop="name">
		   <div class="name">
			 <div v-model="form.name">{{ imagelist.name }}</div>
			 <el-button type="text" @click="handleFileName()">修改名字</el-button>
		   </div>
		 </el-form-item>-->
      </el-form>
      <!-- 删除icon -->
      <!-- <div class="del">
		 <i @click="handleFileRemove()" class="el-icon-delete"></i>
	   </div>-->
      <!-- 放大icon -->
      <div class="layer" @click="handleFileEnlarge(imagelist.url)">
        <i class="el-icon-view"></i>
      </div>
    </div>
    
    <div v-if="!pass && progress !== 0" class="img-content img-progress">
      <el-progress type="circle" :percentage="progress" :status="proStatus"></el-progress>
    </div>
    
    <div class="img-upload">
      <el-upload class="uploader" :accept="uploadType"
                 ref="upload"
                 list-type="picture"
                 drag
                 :action="params.action"
                 :auto-upload="false"
                 :show-file-list="false"
                 :data="params.data"
                 :on-change="uploadOnChange"
                 :on-progress="uploadOnProgress"
      >
        <el-button type="primary">{{uploadTitle}}</el-button>
      </el-upload>
    </div>
    <el-dialog title=""
               :visible.sync="isEnlargeImage"
               size="large"
               :modal="false"
               :modal-append-to-body="true"
               top="8%"
               width="60%">
      <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
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
      /* uploadImg() {
		 // console.log('upload');
		 let that = this;
		 console.log(that.imagelist.url);
   
		 axios.post('/api/Home/BrandSave', {
		   DogType: 'a_dd',
		   BrandCode: '4',
		   BrandName: '品牌名称',
		   BrandShowText: '品牌简介',
		   BrandComments: '品牌描述',
		   ImgBase: that.imagelist.url
		 })
		   .then(data => {
			 console.log(data);
			 that.$message.success("上传成功");
			 that.pass = true;
			 that.$emit('closeDialog')
			 // that.isClose=false
		   })
		   .catch(e => {
			 console.log(e);
		   })
	   },*/
      /* confirmUpload() {
		 this.$refs.upload.submit();
	   },*/
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
          this.$emit('hasFile', file.raw);
          let reader = new FileReader();
          reader.readAsArrayBuffer(file.raw);
          reader.onload=function(e){
            console.log(this.result);
          };
          if ( file.raw.type.indexOf('image') > -1 ) {
            reader.readAsDataURL(file.raw);
            var that = this;
            reader.onload = function (e) {
              console.log(e.target.result);
              that.imagelist = {
                url: e.target.result,
                name: '新增图片'
              };
              // console.log(that.imagelist);
              that.$emit('getBase64Url', that.imagelist.url)
            };
          }
          
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
        // console.log(_url);
        if ( _url ) {
          this.enlargeImage = _url;
          this.isEnlargeImage = !this.isEnlargeImage;
        }
      },
      /* handleFileName(file, i) {//修改名字
		 console.log(file, i);
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
	   },*/
    },
    mounted() {
      this.uploadTitle = this.getUpLoadTitle;
      this.uploadType = this.getUploadType;
      this.isShow = this.isDisplay;
    }
  }
</script>

<style lang="stylus" scoped>
  * {
    box-sizing: border-box;
  }
  
  .img-list >>> .el-upload-dragger
    width: 200px
    height auto
    border: none
  
  .img-list {
    overflow: hidden;
    width: 100%;
    position: relative
  }
  
  .img-list .img-content {
    /*height: 270px;*/
    transition: all .3s;
  }
  
  .img-list .img-upload {
    width: 200px;
    text-align: center;
    margin: 0 auto;
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
    height: 190px;
    margin: 0 auto;
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
