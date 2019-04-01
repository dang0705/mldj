<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      @closed="closed"
      align="center"
    >
      <div class="basInfo">
        <div class="uploadImg">
          <upload
            :isClose="isClose"
            :imgUrl="formData.ImgBase"
            @closeDialog="handleClose"
            @getBase64Url="getBase64Url"
            :getUpLoadTitle="upLoadTitle"
            :getUploadType="uploadType"
          >
          </upload>
        </div>
        <el-form
          ref="upload"
          :model="formData"
          :rules="uploadRules"
          label-width="130px"
          class='upImgForm'
          v-loading="dialogLoading"
        
        >
          <el-form-item prop="DeviceName" label="设备名称：">
            <el-input
              v-model="formData.DeviceName"
              clearable
              placeholder=""
              minlength="1"
              maxlength="15"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="回KV时长(秒)：">
            <el-input
              v-model="formData.showTime"
              clearable
              placeholder=""
              minlength="1"
              maxlength="15"></el-input>
          </el-form-item>
          <el-form-item prop="EmployeeName" label="设备所有人：">
            <el-select
              v-model="formData.EmployeeCode"
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
          <el-form-item prop="CRMStore" label="CRM门店">
            <el-select
              v-model="formData.CRMCode"
              filterable
              clearable
            >
              <el-option-group
                v-for="(group,index) in CRMSoreList"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="(item,index) in group.options"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                >
                </el-option>
              </el-option-group>
            
            </el-select>
          
          </el-form-item>
          <el-form-item prop="DeviceType" label="设备类型：">
            <el-select
              v-model="formData.DeviceType"
              filterable
              clearable
              @change="deviceChange"
              :disabled="formData.DeviceMac==='未绑定'"
            >
              <el-option
                v-for="(item,i) of deviceTypeList"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="APK" label="系统版本：">
            <el-select
              v-model="formData.APKCode"
              filterable
              clearable
              :disabled="formData.DeviceMac==='未绑定'"
            
            >
              <el-option
                v-for="(item,i) of apkList"
                :key="i"
                :label="item.label"
                :value="parseInt(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          
          
          <el-form-item prop="payment" label="版本类型：">
            <el-select
              v-model="formData.PayCode"
              filterable
              clearable
              @change="creatSelect"
              :disabled="formData.DeviceMac==='未绑定'"
            >
              <el-option
                v-for="(item,i) of paymentList"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item
            label="支付账户："
            v-show="isAccountShow"
          >
            <el-select
              v-model="formData.PayUser"
            >
              <el-option
                v-for="(item,i) of accountList"
                :key="i"
                :label="item.payname"
                :value="item.ID"
              ></el-option>
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
          
          <el-form-item
            label="货道名称："
            prop="cargoWay"
            v-if="editOrAdd==='up_date'"
          >
            <el-select
              v-model="formData.CargoCode"
              filterable
              @change="cargoWayChange"
              :disabled="formData.DeviceMac==='未绑定'"
            >
              <li class="el-select-dropdown__item isSelect">
                <el-checkbox v-model="isSelectCargoWay">货道是否可选</el-checkbox>
              </li>
              <el-option
                v-for="(item,i) in cargoWayList"
                :label="item.label"
                :value="item.value"
                :key="item.i"
                :disabled="!isSelectCargoWay"
              ></el-option>
            </el-select>
            <div class="cargoWayImgWrapper">
              <img :src="cargoWayImg" width="100%" alt=" ">
              <!-- <el-popover
				 placement="right"
				 trigger="click"
			   >
				 <img :src="cargoWayImg" alt="图片出错">
				 <img class="thumbnail" slot="reference" width="100px" :src="cargoWayImg" alt=" ">
			   </el-popover>-->
              <!--<img width="100%" :src="cargoWayImg" alt="">-->
            </div>
          </el-form-item>
        
        </el-form>
      
      </div>
      <div class="cargoWay">
      
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import citySelect from '@/component/common/citySelect/citySelect'
  import upload from '@/component/common/upload/uploadList'
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "EquipManagement_dialog",
    components: {
      citySelect,
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
        uploadType: 'image/jpeg,image/png',
        isSelectCargoWay: false,
        isAccountShow: false,
        dialogLoading: true,
        upLoadTitle: '',
        cargoWayImg: '',
        accountList: [],
        list: [],
        deviceTypeList: [],
        CRMSoreList: [
          {
            label: '阿里',
            options: []
          },
          {
            label: '微信',
            options: []
            
          } ],
        apkList: [],
        paymentList: [],
        cargoWayList: [],
        provinceTotalArr: '',
        alertTitle: '',
        formData: {
          AddEmployeeCode: '',
          PayUser: '',
          showTime: 0,
          CRMCode: '',
          CargoCode: '',
          ImgBase: '',
          DeviceType: '',
          DeviceName: '',
          APKCode: '',
          PayCode: '',
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
              max: 15,
              message: '长度请在1~15个字符',
              trigger: 'blur'
            }
          ]
          ,
          time: [
            {
              required: true,
              message: 'KV时长为必填项',
              trigger: 'blur'
            },
          ],
          EmployeeName: [
            {
              required: true,
              message: '设备所有人为必填项',
              trigger: 'blur'
            }
          
          ],
          
          
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
          this.isSelectCargoWay = false;
          this.getCargoWayList();
          if ( this.editOrAdd === 'up_date' ) {
            
            this.formData = this.editData;
            console.log(this.formData);
            
            if ( this.formData.PayCode == 0 ) {
              const that = this;
              that.$axios.post('/Home/payList')
                .then(data => {
                  console.log(data);
                  if ( data.data.state === 1 ) {
                    that.isAccountShow = true;
                    that.accountList = data.data.Content;
                    console.log(that.accountList);
                  }
                  that.dialogLoading = false
                })
            } else {
              this.dialogLoading = false
            }
            
            console.log(this.formData);
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
            this.dialogLoading = false;
            this.isAccountShow = false;
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增设备';
            this.provinceTotalArr = '省 / 市';
            Msg = '增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        }
      }
    },
    methods: {
      getBase64Url(url) {
        this.formData.ImgBase = url;
        console.log(this.formData.ImgBase);
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n')
        } else {
          this.$emit('closeAlert')
        }
        
        this.cargoWayList = [];
        this.formData.ImgBase = this.cargoWayImg = '';
      },
      closed() {
        this.isClose = true;
      },
      confirmUpload(obj) {
        console.log(this.formData);
        const that = this;
        if ( that.formData.DeviceName === '' ) {
          that.$message.error('设备名称不能为空');
          return
        } else if ( !that.formData.EmployeeCode ) {
          that.$message.error('设备所属人不能为空');
          return
        }
        
        if ( !this.isSelectCargoWay ) {
          this.formData.CargoCode = '';
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
      ,
      deviceChange(val) {
        this.formData.DeviceType = val;
      }
      ,
      
      cargoWayChange(val) {
        console.log(val);
        if ( val ) {
          this.cargoWayList.forEach((item, index, arr) => {
            if ( val === item.value ) {
              this.cargoWayImg = item.ImgBase;
            }
          })
          
        }
      },
      getDeviceType() {
        const that = this;
        that.$axios.post('/Home/DeviceType')
          .then(data => {
            console.log(data);
            if ( data.data.state === 1 ) {
              console.log(data.data.Content);
              data.data.Content.forEach((item, index, arr) => {
                that.deviceTypeList.push({
                  label: item.Name,
                  value: item.Name
                })
              });
              console.log(that.deviceTypeList);
            }
          })
      }
      ,
      getApkList() {
        let that = this;
        if ( storage.getItem('apkList') ) {
          const list = JSON.parse(storage.getItem('apkList'));
          list.forEach((item, index, arr) => {
            that.apkList.push({
              label: item.ApkName,
              value: item.ID
            })
          });
        } else {
          that.$axios.post('/Home/OnloadApkList')
            .then(data => {
              if ( data.data.state === 1 ) {
                const list = data.data.Content;
                list.forEach((item, index, arr) => {
                  that.apkList.push({
                    label: item.ApkName,
                    value: item.ID
                  })
                });
              }
            })
        }
      }
      ,
      getPaymentList() {
        let that = this;
        that.$axios.post('/Home/OnloadMetaDataByType', {
          InputType: 'CRMDATA'
        })
          .then(data => {
            if ( data.data.state === 1 ) {
              const list = data.data.Content;
              list.forEach((item, index, arr) => {
                that.paymentList.push({
                  label: item.Name,
                  value: item.Value,
                })
              });
            }
          })
      }
      ,
      getCargoWayList() {
        let that = this;
        if ( !that.cargoWayList.length ) {
          if ( storage.getItem('cargoWayList') ) {
            const list = JSON.parse(storage.getItem('cargoWayList'));
            console.log(list);
            list.forEach((item, index, arr) => {
              if ( that.formData.CargoCode === item.ID ) {
                that.cargoWayImg = item.ImgBase;
                console.log(that.cargoWayImg);
              }
              that.cargoWayList.push({
                label: item.CargoName,
                value: item.ID,
                ImgBase: item.ImgBase
                
              })
            })
          } else {
            that.$axios.post('/Home/OnloadCargoTypeList')
              .then(data => {
                if ( data.data.state === 1 ) {
                  const list = data.data.Content;
                  list.forEach((item, index, arr) => {
                    if ( that.formData.CargoCode === item.ID ) {
                      that.cargoWayImg = item.ImgBase
                    }
                    that.cargoWayList.push({
                      label: item.CargoName,
                      value: item.ID,
                      ImgBase: item.ImgBase
                      
                    })
                  })
                }
              })
          }
        }
        
      }
      ,
      getCRMSoreList() {
        const that = this;
        that.$axios.post('/Home/CRMonload')
          .then(data => {
            if ( data.data.state === 1 ) {
              const res = data.data.Content, length = data.data.Content.length;
              for ( var i = 0; i < length; i++ ) {
                if ( res[ i ].type === '1' ) {
                  that.CRMSoreList[ 0 ].options.push({
                    label: res[ i ].StoreName,
                    value: res[ i ].ID
                  })
                } else {
                  that.CRMSoreList[ 1 ].options.push({
                    label: res[ i ].StoreName,
                    value: res[ i ].ID
                  })
                  
                }
              }
              console.log(that.CRMSoreList);
            }
          })
      },
      creatSelect(val) {
        console.log(val);
        if ( val == 0 ) {
          const that = this;
          that.$axios.post('/Home/payList')
            .then(data => {
              console.log(data);
              if ( data.data.state === 1 ) {
                that.isAccountShow = true;
                that.accountList = data.data.Content;
                that.formData.PayUser = that.accountList[ 0 ].ID;
                console.log(that.accountList);
              }
            })
        } else {
          this.isAccountShow = false;
          this.formData.PayUser = '';
        }
      }
    },
    mounted() {
      this.getUserList();
      this.getDeviceType();
      this.getApkList();
      this.getPaymentList();
      this.getCRMSoreList()
      // this.getCargoWayList()
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog
    width: 750px !important
  
  .dialogWrapper >>> .el-select
    width: 100%
  
  
  .cargoWayImgWrapper img
    position: absolute
    left -180%
    bottom 0
  .el-select
    width: 100% !important
  
  .isSelect
    background #ccc
</style>
