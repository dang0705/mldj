<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
        label-width="120px"
      >
        <el-form-item prop="DeviceName" label="设备名称：">
          <el-input
            v-model="formData.DeviceName"
            clearable
            placeholder=""
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        
        <el-form-item prop="EmployeeName" label="设备所有人：">
          <el-select
            v-model="formData.EmployeeName"
            filterable
            clearable
            autocomplete
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
        <el-form-item label="设备所在省市：">
          <city-select
            v-if="isAlertShow"
            @provincesAndCities="provincesAndCities"
            :getEditCities="provinceTotalArr"
          ></city-select>
        </el-form-item>
        <el-form-item prop="Address" label="设备所在地址：">
          <el-input
            v-model="formData.Address"
            minlength="1"
            maxlength="30"></el-input>
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
  
  let Msg = '';
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
            Msg = '编辑成功'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增设备';
            this.provinceTotalArr = '省 / 市';
            Msg = '增加成功'
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
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert','n')
        } else {
          this.$emit('closeAlert')
        }
        
      },
      confirmUpload(obj) {
        const that = this;
        if ( that.formData.DeviceName === '' ) {
          that.$message.error('设备名称不能为空');
          return
          
        } else if ( that.formData.AddEmployeeCode === '' ) {
          that.$message.error('设备所属人不能为空');
          return
        }
        that.$axios.post('/Home/EmployeeDeviceSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj)
            } else {
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
        that.$axios.post('/HOME/OnloadEmployeeList', {
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
  .dialogWrapper >>> .el-select
    width: 100%
</style>
