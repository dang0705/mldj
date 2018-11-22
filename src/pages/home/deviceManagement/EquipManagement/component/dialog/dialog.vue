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
        <el-form-item prop="DeviceName">
          <el-input
            v-model="formData.DeviceName"
            clearable
            placeholder="设备名称"
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        
        <el-form-item prop="EmployeeName">
          <el-select
            v-model="formData.EmployeeName"
            filterable
            clearable
            autocomplete
            placeholder="请选择"
            @change="onChange"
          >
            <el-option
              v-for="(item,index) of list"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <city-select
            v-if="isAlertShow"
            @provincesAndCities="provincesAndCities"
            :getEditCities="provinceTotalArr"
          ></city-select>
        </el-form-item>
        <el-form-item prop="Address">
          <el-input
            v-model="formData.Address"
            placeholder="门店地址"
            minlength="1"
            maxlength="30"></el-input>
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
  const storage = window.localStorage;
  export default {
    name: "EquipManagement_dialog",
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
        list: [],
        provinceTotalArr: '',
        alertTitle: '',
        formData: {
          AddEmployeeCode: '',
          DeviceName: '',
          ProvinceCode: '',
          ProvinceName: '省份',
          CityCode: '',
          CityName: '市',
          Address: '',
          DogType: "",
          EmployeeCode: '',
          EmployeeName: ''
        }
        ,
        editFormData: {},
        
        uploadRules: {
          DeviceName: [
            {
              required: true,
              message: '设备名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ]
          , AddEmployeeCode: [
            {
              required: true,
              message: '分配所有人编号为必填项',
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
          if ( this.editOrAdd==='up_date' ) {
            this.formData.DeviceName = this.editData.DeviceName;
            this.formData.ProvinceCode = this.editData.ProvinceCode;
            this.formData.ProvinceName = this.editData.ProvinceName;
            this.formData.CityCode = this.editData.CityCode;
            this.formData.CityName = this.editData.CityName;
            this.formData.Address = this.editData.Address;
            this.formData.EmployeeCode = storage.getItem('userName');
            this.formData.EmployeeName = this.editData.EmployeeName;
            this.formData.ID = this.editData.ID;
            this.formData.DogType = this.editString;
            this.alertTitle = '编辑设备';
            this.provinceTotalArr = this.formData.ProvinceName + ' / ' + this.formData.CityName;
            let length = this.list.length;
            for ( var i = 0; i < length; i++ ) {
              if ( this.formData.EmployeeName === this.list[ i ].label ) {
                this.formData.AddEmployeeCode = this.list[ i ].value;
                console.log(this.formData.AddEmployeeCode);
                break;
              }
            }
            Msg='编辑成功'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增设备';
            this.provinceTotalArr='省 / 市';
            Msg='增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        } else {
          this.formData.AddEmployeeCode = '';
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
        const that = this;
        if ( that.formData.DeviceName === '' ) {
          that.$message.error('设备名称不能为空');
          return
          
        } else if ( that.formData.AddEmployeeCode === '' ) {
          that.$message.error('设备所属人不能为空');
          return
        }
        axios.post('/api/Home/EmployeeDeviceSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('EmployeeDeviceUpdateData');
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
        
      },
      getUserList() {
        const CompanyID = storage.getItem('CompanyID'),
          that = this,
          RoleId = storage.getItem('RoleId');
        axios.post('/api/HOME/OnloadEmployeeList', {
          CompanyID: CompanyID,
          RoleId: RoleId
        })
          .then(data => {
            // console.log(data);
            const res = data.data.Content,
              length = res.length;
            for ( var i = 0; i < length; i++ ) {
              that.list.push({
                label: res[ i ].EmployeeName,
                value: res[ i ].EmployeeCode
              })
            }
            console.log(that.list);
          })
      },
      onChange(val) {
        this.formData.AddEmployeeCode = val;
      }
    },
    mounted() {
      this.getUserList();
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .dialogWrapper >>> .el-select
    width: 100%
  
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
