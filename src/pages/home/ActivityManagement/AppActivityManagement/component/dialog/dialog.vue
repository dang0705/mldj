<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      v-loading="dataLoading"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
        label-width="120px"
      >
        <el-form-item prop="ActivityName" label="活动名称：">
          <el-input v-model="formData.ActivityName" ref="autoFocus" :autofocus="true" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="activityDate" label="活动起止时间" :show-message="false">
          <date-picker
            @getDate="getDate"
            :selectedDate="selectedDate"
            :isAlertShow="isAlertShow"
          ></date-picker>
        </el-form-item>
        
        <el-form-item prop="store" label="选中的门店：" align="left">
          <el-button @click="toSelectStore" type="danger">选择门店</el-button>
          <!--          <div v-if="!selectedStoreObj.StoreValidity&&!storeSelectedModel">
					  <el-tag type="info">选择的门店已被删除,请重新选择门店</el-tag>
					  <el-form
						label-width="100px"
						v-if="selectedStoreObj.AddInfo"
					  >
						<el-form-item label="门店名称：">
						  <el-tag size="small" type="danger">{{selectedStoreObj.StoreName}}</el-tag>
						</el-form-item>
					  </el-form>
					</div>-->
          <div v-if="selectedStoreObj.StoreValidity||storeSelectedModel">
            <el-form
              label-width="100px"
            >
              <el-form-item label="门店名称：">
                <el-tag size="small" type="danger">{{selectedStoreObj.StoreName}}</el-tag>
              </el-form-item>
              <el-form-item label="门店地址：">
                <el-tag size="small" type="danger">{{selectedStoreObj.AddInfo}}</el-tag>
              </el-form-item>
              <el-form-item label="门店编号：">
                <el-tag size="small" type="danger">{{selectedStoreObj.StoreCode}}</el-tag>
              </el-form-item>
              <el-form-item label="渠道名：">
                <el-tag size="small" type="danger">{{selectedStoreObj.ChannelName}}</el-tag>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-form
              label-width="140px"
            >
              <el-form-item label="已被删除的门店：">
                <el-tag size="small" type="info">{{selectedStoreObj.StoreName}}</el-tag>
              </el-form-item>
            </el-form>
          
          </div>
        </el-form-item>
        
        <el-form-item prop="product" label="选中的产品：" align="left">
          <el-button @click="toSelectProduct" type="success">选择产品</el-button>
        </el-form-item>
        <el-form-item>
          <template
            v-for="(item,i) in selectedProductList"
          >
            <el-form-item class="shoppingCart"
                          v-if="item.number>0"
            >
              <el-tag size="small" type="success">{{item.ProductName}}</el-tag>
              <img :src="item.ImgBase" alt="">
              <el-input-number
                size="small"
                v-model="item.number"
                @change="ifNumberIsZero"
                @input.native="ifNumberIsZero"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-form-item>
        
        <el-form-item prop="device" label="选中的设备：">
          <el-select v-model="selectedDeviceArr"
                     :multiple="true">
            <el-option
              v-for="(item,i) in deviceList"
              :key="i"
              :label="item.Validity?item.DeviceName:item.DeviceName+'-----设备已停用'"
              :disabled="!item.Validity"
              :value="item.ID"
            ></el-option>
          </el-select>
          <div id="disabledDevice" style="text-align: left;">
            
            <span v-if="disabledDeviceArr.length">已停用的设备：</span>
            <template v-for="(item,i) in disabledDeviceArr">
              <el-tag  type="info">{{item}}</el-tag>
            </template>
          </div>
        </el-form-item>
        <el-form-item label="活动简介：">
          <el-input type="textarea" v-model="formData.ActivityDec"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
    <product-select-alert
      :isProductAlertShow="isProductAlertShow"
      :isProductSelected="isProductSelected"
      :selectedProductList="selectedProductList"
      @closeProductSelect="closeProductSelect"
      @productSelected="productSelected"
    ></product-select-alert>
    
    <store-select-alert
      :isStoreAlertShow="isStoreAlertShow"
      :isStoreSelected="isStoreSelected"
      :storeSelectedModel="storeSelectedModel"
      :selectedStoreObj="selectedStoreObj"
      @closeStoreSelect="closeStoreSelect"
      @storeSelected="storeSelected"
      @sendRadioSelectedModel="sendRadioSelectedModel"
    >
    
    </store-select-alert>
  </div>
</template>

<script>
  const storage = window.localStorage;
  let Msg = '';
  import datePicker from '@/component/common/dateSelect/dateSelect'
  import productSelectAlert from './component/productSelectAlert'
  import storeSelectAlert from './component/storeSelectAlert'
  
  export default {
    // inject:['reload'],
    name: "activity_Management_dialog",
    components: {
      datePicker,
      productSelectAlert,
      storeSelectAlert
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
        dataLoading: true,
        isProductAlertShow: false,
        isStoreAlertShow: false,
        isProductSelected: false,
        isStoreSelected: false,
        productList: [],
        defaultProductNum: 1,
        selectedProductCode: [],
        selectedProductList: [],
        selectedStoreObj: {},
        deviceList: [],
        storeSelectedModel: '',
        selectedDeviceArr: [],
        disabledDeviceArr: [],
        isDisplay: true,
        selectedDate: [],
        formData: {
          ActivityName: '',
          ActivityCode: '',
          OpenStartDate: '',
          OpenEndDate: '',
          ActivityAdd: '',
          ActivityStoreCode: '',
          ActivityEmployeeCode: '',
          DeviceList: '',
          ProductList: '',
          ActivityDec: '',
          DogType: ''
        }
        ,
        uploadRules: {
          ActivityName: [
            {
              required: true,
              message: '活动名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          activityDate: [
            {
              required: true,
              message: '活动起止时间必填项',
              trigger: 'blur'
            }
          
          ],
          store: [
            {
              required: true,
              message: '门店为必填项',
              trigger: 'blur'
            }
          
          ],
          product: [
            {
              required: true,
              message: '商品为必填项',
              trigger: 'blur'
            }
          
          ],
          device: [
            {
              required: true,
              message: '商品为必填项',
              trigger: 'blur'
            }
          ],
          
        }
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          this.$nextTick(() => {
            this.$refs.autoFocus.focus()
          });
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            this.selectedStoreObj.StoreName = this.formData.StoreName;
            this.selectedStoreObj.AddInfo = this.formData.ActivityAdd;
            this.selectedStoreObj.StoreCode = this.formData.realStoreCode;
            this.selectedStoreObj.ChannelName = this.formData.ChannelName;
            this.selectedStoreObj.StoreValidity = this.formData.StoreValidity;
            this.selectedDate = [ this.formData.OpenStartDate, this.formData.OpenEndDate ];
            this.isStoreSelected = true;
            this.selectedStoreObj.StoreValidity ? this.storeSelectedModel = this.formData.ActivityStoreCode : 0;
            this.selectedProductList = this.formData.ProductList;
            
            console.log(this.storeSelectedModel);
            // console.log(this.formData.ProductList);
            // console.log(this.selectedProductList);
            const deviceArr = this.formData.DeviceList
              , length = deviceArr.length
            console.log(deviceArr);
            for ( var i = 0; i < length; i++ ) {
              if ( deviceArr[ i ].Validity ) {
                this.selectedDeviceArr.push(parseInt(deviceArr[ i ].DeviceCode))
              } else {
                this.disabledDeviceArr.push(deviceArr[ i ].DeviceName)
              }
            }
            // this.selectedDeviceArr = JSON.parse(this.formData.DeviceList);
            console.log(this.formData);
            console.log(this.disabledDeviceArr);
            this.alertTitle = '编辑活动';
            Msg = '编辑成功';
          } else {
            
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            
            this.formData.DogType = 'a_dd';
            this.alertTitle = '新增活动';
            Msg = '增加成功';
          }
        } else {
          this.selectedDeviceArr = [];
          this.disabledDeviceArr = []
        }
      }
    },
    
    methods: {
      getDate(val) {
        console.log(val);
        this.formData.OpenStartDate = val[ 0 ];
        this.formData.OpenEndDate = val[ 1 ]
      },
      toSelectProduct() {
        this.isProductAlertShow = true;
        if ( this.selectedProductList.length ) {
          this.isProductSelected = true
        }
      },
      toSelectStore() {
        this.isStoreAlertShow = true;
        if ( JSON.stringify(this.selectedStoreObj) !== '{}' ) {
          this.isStoreSelected = true;
          
        }
        
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
          this.isProductSelected = false;
          this.selectedProductList = [];
        } else {
          this.$emit('closeAlert');
        }
        this.selectedProductList = [];
        this.selectedDate = [];
        this.selectedDeviceArr = [];
        this.selectedStoreObj = {};
        this.storeSelectedModel = '';
      },
      
      ifNumberIsZero(val, index) {
        console.log(val, index);
        if ( !val || (val.target && val.target.value <= 0) ) {
          this.$nextTick(() => {
            for ( var i = 0; i < this.selectedProductList.length; i++ ) {
              if ( !this.selectedProductList[ i ].number ) {
                this.selectedProductList.splice(i, 1)
              }
            }
          })
        }
        console.log(this.selectedProductList);
      },
      closeProductSelect() {
        this.isProductAlertShow = false
      }
      ,
      closeStoreSelect() {
        this.isStoreAlertShow = false
      },
      /*      productSelect(val, label) {
			  console.log(val, label);
			  this.selectedProductList = [];
			  const length = val.length;
			  for ( var i = 0; i < length; i++ ) {
				this.selectedProductList.push({
				  ProductCode: val[ i ].split('^')[ 0 ],
				  ProductName: val[ i ].split('^')[ 1 ],
				  number: this.defaultProductNum
				})
			  }
			  console.log(this.selectedProductList);
			},*/
      productSelected(val) {
        console.log(val);
        
        this.selectedProductList = [];
        const length = val.length;
        for ( var i = 0; i < length; i++ ) {
          this.selectedProductList.push({
            ProductCode: val[ i ].id,
            ProductName: val[ i ].ProductName,
            number: this.defaultProductNum
          })
        }
        console.log(this.formData.ProductList);
      },
      storeSelected(val) {
        console.log(val);
        this.selectedStoreObj = val;
        this.storeSelectedModel = val.ID.toString()
        console.log(this.storeSelectedModel);
        
        this.formData.ActivityAdd = this.selectedStoreObj.AddInfo;
        this.formData.ActivityStoreCode = this.selectedStoreObj.ID
      },
      sendRadioSelectedModel(val) {
        console.log(this.storeSelectedModel);
      },
      confirmUpload(obj) {
        let that = this;
        this.formData.ProductList = JSON.stringify(this.selectedProductList);
        this.formData.DeviceList = JSON.stringify(this.selectedDeviceArr);
        this.formData.ActivityEmployeeCode = storage.getItem('userName');
        console.log(this.storeSelectedModel);
        
        if ( !that.formData.ActivityName ) {
          that.$message.error('活动名称不能为空');
          return
        } else if ( !this.formData.OpenStartDate ) {
          that.$message.error('活动起止时间不能为空');
          return
        } else if ( !this.storeSelectedModel ) {
          that.$message.error('门店必须选择');
          return
          
        } else if ( this.formData.ProductList === '[]' ) {
          that.$message.error('至少要选择一个产品');
          return
        } else if ( this.formData.DeviceList === '[]' ) {
          that.$message.error('至少要选择一个设备');
          return
          
        }
        
        that.$axios.post('/Home/ActivitySave', this.formData)
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
      }
    }
    ,
    mounted() {
      let that = this;
      if ( storage.getItem('productList') ) {
        that.productList = JSON.parse(storage.getItem('productList'))
      } else {
        that.$axios.post('/Home/OnloadProductList')
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.productList = data.data.Content;
            }
          })
      }
      if ( storage.getItem('device') ) {
        that.deviceList = JSON.parse(storage.getItem('device'));
      } else {
        that.$axios.post('/Home/OnloadEmployeeDeviceList')
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.deviceList = data.data.Content;
            }
          })
      }
      
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog
    width: 600px !important
  
  .dialogWrapper >>> .shoppingCart
    text-align left
    
    > div
      margin-left: 0 !important
    
    .el-tag--small
      vertical-align super
    
    div.el-input-number
      float right
      width: 130px !important
</style>
