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
        <el-form-item prop="StoreName"
                      label="门店名称："
        >
          <el-input v-model="formData.StoreName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="StoreCode"
                      label="门店编号："
        >
          <el-input v-model="formData.StoreCode" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
       
        <el-form-item prop="AddInfo" label="门店地址：">
          <el-input
            v-model="formData.AddInfo"
            minlength="1"
            maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="ChannelCode" label="渠道名称：">
          <el-select
            v-model="formData.ChannelCode">
            <el-option
              v-for="(item,i) in channelList"
              :key="i"
              :label="item.ChannelName"
              :value="item.ID.toString()"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在省市：">
          <city-select
            v-if="isAlertShow"
            @provincesAndCities="provincesAndCities"
            :getEditCities="provinceTotalArr"
          ></city-select>
        </el-form-item>
        
        
        <el-form-item prop="ContactPhone" label="联系方式：">
          <el-input v-model="formData.ContactPhone"></el-input>
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
  import citySelect from '@/component/common/citySelect/citySelect'
  
  let Msg = '',
    storage = window.localStorage;
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
        channelSelected: '',
        channelList: [],
        alertTitle: '',
        formData: {
          StoreCode: '',
          StoreName: '',
          ChannelName: '',
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
          , AddInfo: [
            {
              required: true,
              message: '门店地址为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 30,
              message: '长度请在1~30个字符',
              trigger: 'blur'
            }
          ]
          , ChannelCode: [
            {
              required: true,
              message: '渠道名称为必填项',
              trigger: 'blur'
            }
          
          ],
          
        }
        ,
        editString: ''
      }
    },
    
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData.StoreCode = this.editData.StoreCode;
            this.formData.StoreName = this.editData.StoreName;
            // this.formData.ChannelName = this.editData.ChannelName;
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
            Msg = '编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增门店';
            this.provinceTotalArr = '省 / 市';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        } else {
          this.formData.ProvinceCode = '';
          this.formData.CityCode = '';
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
        this.editString = '';
        
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.StoreCode === '' ) {
          that.$message.error('门店编号不能为空');
          return
        } else if ( that.formData.StoreName === '' ) {
          that.$message.error('门店名称不能为空');
          return
        }else if ( that.formData.AddInfo === '' ) {
          that.$message.error('门店地址不能为空');
          return
        }
        else if ( that.formData.ChannelCode === '' ) {
          that.$message.error('渠道名称不能为空');
          return
        }
        that.$axios.post('/Home/StoreSave', this.formData)
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
      provincesAndCities(code) {
        if ( code.length ) {
          this.formData.ProvinceCode = code[ 0 ];
          this.formData.CityCode = code[ 1 ]
        }
      }
    },
    mounted() {
      if ( storage.getItem('channel') ) {
        this.channelList = JSON.parse(storage.getItem('channel'))
      } else {
        const that = this;
        that.$axios.post('/Home/OnloadChannelList')
          .then(data => {
            if ( data.data.state === 1 ) {
              that.channelList = data.data.Content;
            }
          })
      }
    }
    
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
