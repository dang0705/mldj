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
        label-width="120px"
      
      >
        <el-form-item prop="WarehouseCode" label="仓库编号">
          <el-input v-model="formData.WarehouseCode" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseName" label="仓库名称">
          <el-input v-model="formData.WarehouseName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseAdd" label="仓库地址">
          <el-input v-model="formData.WarehouseAdd" clearable minlength="1"
                    maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="WarehouseDec" label="仓库描述">
          <el-input type="textarea" v-model="formData.WarehouseDec"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  let Msg = '';
  export default {
    name: "warehouseManagement_dialog",
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
            Msg = '编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增仓库';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        }
        
      }
    },
    
    methods: {
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
        }
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
      confirmUpload(obj) {
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
        
        that.$axios.post('/Home/WarehouseSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              
              that.$message.success(Msg);
              that.handleClose(obj)
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
