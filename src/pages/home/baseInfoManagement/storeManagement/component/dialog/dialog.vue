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
        <el-form-item prop="StoreCode">
          <el-input v-model="formData.StoreCode" clearable placeholder="门店编号" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="StoreName">
          <el-input v-model="formData.StoreName" clearable placeholder="门店名称" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="AddInfo">
          <el-input
            v-model="formData.AddInfo"
            placeholder="门店地址"
            minlength="1"
            maxlength="30"></el-input>
        </el-form-item>
        <el-form-item>
          <city-select
            v-if="isAlertShow"
            @provincesAndCities="provincesAndCities"
            :getEditCities="provinceTotalArr"
          ></city-select>
        </el-form-item>
        
        <el-form-item prop="ChannelCode">
          <el-input v-model="formData.ChannelCode" clearable placeholder="渠道编号" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ContactPhone">
          <el-input v-model="formData.ContactPhone" placeholder="联系方式"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import citySelect from '@/component/common/citySelect/citySelect'
  import axios from 'axios'
  
  let Msg='';
  export default {
    name: "storeManagement_dialog",
    components: {
      citySelect
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
        provinceTotalArr: '',
        alertTitle: '',
        formData: {
          StoreCode: '',
          StoreName: '',
          ChannelCode: '',
          ProvinceCode: '',
          ProvinceName: '省份',
          CityCode: '',
          CityName: '市',
          AddInfo: '',
          ContactPhone: '',
          DogType: ""
        }
        ,
        editFormData: {},
        
        uploadRules: {
          StoreCode: [
            {
              required: true,
              message: '门店编号为必填项',
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
              message: '门店名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
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
            this.formData.StoreCode = this.editData.StoreCode;
            this.formData.StoreName = this.editData.StoreName;
            this.formData.ChannelCode = this.editData.ChannelCode;
            this.formData.ProvinceCode = this.editData.ProvinceCode;
            this.formData.ProvinceName = this.editData.ProvinceName;
            this.formData.CityCode = this.editData.CityCode;
            this.formData.CityName = this.editData.CityName;
            this.formData.AddInfo = this.editData.AddInfo;
            this.formData.ContactPhone = this.editData.ContactPhone;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑门店';
            this.provinceTotalArr = this.formData.ProvinceName + ' / ' + this.formData.CityName;
            Msg='编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增门店';
            this.provinceTotalArr = '省 / 市';
            Msg='增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        } else {
          this.formData.ProvinceCode = '';
          this.formData.CityCode = '';
        }
        
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      
      confirmUpload() {
        let that = this;
        if ( that.formData.StoreCode === '' ) {
          that.$message.error('门店编号不能为空');
          return
        }
        else if ( that.formData.StoreName === '' ) {
          that.$message.error('门店名称不能为空');
          return
        }
        axios.post('/api/Home/StoreSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('StoreUpdateData');
              that.$refs[ 'upload' ].resetFields();
            }
            else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      provincesAndCities(code) {
        this.formData.ProvinceCode = code[ 0 ];
        this.formData.CityCode = code[ 1 ]
        
      }
    },
    
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .dialogWrapper >>> .el-input__inner
    inputNoBorder()
  
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
