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
        <el-form-item prop="WarehouseCode">
          <el-input v-model="formData.WarehouseCode" clearable placeholder="仓库编号" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseName">
          <el-input v-model="formData.WarehouseName" clearable placeholder="仓库名称" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseAdd">
          <el-input v-model="formData.WarehouseAdd" clearable placeholder="仓库地址" minlength="1"
                    maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseDec">
          <el-input type="textarea" v-model="formData.WarehouseDec" placeholder="仓库描述"></el-input>
        </el-form-item>
      </el-form>
      <!--上传图片插件-->
      <upload :isClose="isClose" @closeDialog="handleClose" :isDisplay="isDisplay"></upload>
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/component/common/upload/uploadList'
  import axios from 'axios'
  let Msg='';
  export default {
    // inject:['reload'],
    name: "SupplierManagement_dialog",
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
          WarehouseCode: '',
          WarehouseName: '',
          WarehouseAdd: '',
          WarehouseDec: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        uploadRules: {
          WarehouseCode: [
            {
              required: true,
              message: '仓库编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          WarehouseName: [
            {
              required: true,
              message: '仓库名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          WarehouseAdd: [
            {
              required: true,
              message: '仓库地址为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~50个字符',
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
            this.formData.WarehouseCode = this.editData.WarehouseCode;
            this.formData.WarehouseName = this.editData.WarehouseName;
            this.formData.WarehouseAdd = this.editData.WarehouseAdd;
            this.formData.WarehouseDec = this.editData.WarehouseDec;
            this.formData.ID = this.editData.ID;
            console.log(this.formData.DogType);
            this.alertTitle = '编辑仓库';
            Msg='编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增仓库';
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
        if ( that.formData.WarehouseCode === '' ) {
          that.$message.error('仓库编号不能为空');
          return
        }
        else if ( that.formData.WarehouseName === '' ) {
          that.$message.error('仓库名称不能为空');
          return
        }
        else if ( that.formData.WarehouseAdd === '' ) {
          that.$message.error('仓库地址不能为空');
          return
        }
        
        axios.post('/api/Home/WarehouseSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('WarehouseUpdateData');
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
