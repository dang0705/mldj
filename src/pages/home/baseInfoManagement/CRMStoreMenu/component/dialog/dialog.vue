<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      align="center"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
        label-width="150px"
      >
        <el-form-item prop="StoreName"
                      label="CRM门店名称："
        >
          <el-input
            v-model="formData.StoreName"
            clearable
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="CRMStoreCode"
                      label="CRM门店编号："
        >
          <el-input
            v-model="formData.CRMStoreCode"
            clearable
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        
        
        <el-form-item prop="CRMType" label="CRM类型：">
          <el-select
            v-model="formData.type"
          >
            <el-option
              v-for="(item,i) in formData.typeList"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  
  let Msg = '',
    storage = window.localStorage;
  export default {
    name: "storeManagement_dialog",
    
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
        // typeList: [],
        alertTitle: '',
        formData: {
          CRMStoreCode: '',
          type: '',
          StoreName: '',
          DogType: ""
        }
        ,
        editFormData: {},
        
        uploadRules: {
          CRMStoreCode: [
            {
              required: true,
              message: 'CRM门店编号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ],
          StoreName: [
            {
              required: true,
              message: 'CRM门店名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ],
          CRMType: [
            {
              required: true,
              message: 'CRM门店类型为必填项',
              trigger: 'blur'
            },
          ]
        }
        ,
        editString: ''
      }
    },
    
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            this.alertTitle = '编辑CRM门店';
            Msg = '编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.formData.typeList = this.editData.typeList;
            this.alertTitle = '新增CRM门店';
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
      
      confirmUpload(obj) {
        let that = this;
        if ( !that.formData.StoreName ) {
          that.$message.error('CRM门店名称不能为空');
          return
        } else if ( !that.formData.CRMStoreCode ) {
          that.$message.error('CRM门店编号不能为空');
          return
        } else if ( !that.formData.type ) {
          that.$message.error('CRM门店类型不能为空');
          
        }
        that.$axios.post('/Home/CRMsave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      
    },
    mounted() {
      // this.getCrmTypeList()
    }
    
  }
</script>

<style scoped lang="stylus">

</style>
