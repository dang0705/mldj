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
        <el-form-item prop="CompanyName" label="公司名称">
          <el-input v-model="formData.CompanyName" clearable minlength="1"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="AccountName" label="开户人">
          <el-input v-model="formData.AccountName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="BankName" label="开户银行">
          <el-input v-model="formData.BankName" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="BankCard" label="银行卡号">
          <el-input v-model="formData.BankCard" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="BeginTimeAndEndTime" label="续费起止时间">
          <date-select
            :isAlertShow="alertShow"
            :selectedDate="formData.serviceTime"
            @getDate="getDate"
          ></date-select>
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
  import dateSelect from '@/component/common/dateSelect/dateSelect'
  
  let Msg = '';
  
  export default {
    name: "companyManagement_dialog",
    components: {
      dateSelect
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
        alertShow: false,
        isDisplay: true,
        formData: {
          CompanyName: '',
          AccountName: '',
          BankName: '',
          BankCard: '',
          BeginTime: '',
          EndTime: '',
          serviceTime: [],
          ID: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        uploadRules: {
          CompanyName: [
            {
              required: true,
              message: '公司名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ]
          ,
          AccountName: [
            {
              required: true,
              message: '开户人为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ]
          ,
          BankName: [
            {
              required: true,
              message: '开户银行为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ]
          ,
          BankCard: [
            {
              required: true,
              message: '银行卡号为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ]
          ,
          BeginTimeAndEndTime: [
            {
              required: true,
              message: '续费起止时间为必选项',
              trigger: 'blur'
            }
          ]
        }
        
      }
    },
    
    watch: {
      'isAlertShow': function () {
        this.alertShow = this.isAlertShow;
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData.CompanyName = this.editData.CompanyName;
            this.formData.AccountName = this.editData.AccountName;
            this.formData.BankName = this.editData.BankName;
            this.formData.BankCard = this.editData.BankCard;
            this.formData.serviceTime = this.editData.serviceTime;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑公司';
            Msg = '编辑成功';
          } else {
            this.alertTitle = '新增公司';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
          
        }
      }
    },
    
    methods: {
      getDate(val) {
        if ( val ) {
          this.formData.serviceTime = val;
        }
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
        }
        for ( var i in this.formData ) {
          this.formData[ i ] = ''
        }
        this.formData.serviceTime = [];
        
      },
      
      confirmUpload(obj) {
        let that = this;
        if ( that.formData.CompanyName === '' ) {
          that.$message.error('公司名称不能为空');
          return
        } else if ( that.formData.AccountName === '' ) {
          that.$message.error('开户人不能为空');
          return
        } else if ( that.formData.BankName === '' ) {
          that.$message.error('开户银行不能为空');
          return
        } else if ( that.formData.BankCard === '' ) {
          that.$message.error('银行卡号不能为空');
          return
        } else if ( that.formData.serviceTime === [] || !that.formData.serviceTime ) {
          that.$message.error('续费起止日期不能为空');
          return
        }
        
        if ( that.formData.DogType === 'a_dd' ) {
          that.postData('AddCompany', obj)
        } else {
          that.postData('UpdComany', obj)
        }
        
      }
      ,
      postData(url, obj) {
        const that = this;
        var params = '';
        params += '&CompanyName=' + that.formData.CompanyName;
        params += '&AccountName=' + that.formData.AccountName;
        params += '&BankName=' + that.formData.BankName;
        params += '&BankCard=' + that.formData.BankCard;
        console.log(that.formData.serviceTime);
        if ( that.formData.serviceTime.length ) {
          params += '&BeginTime=' + that.formData.serviceTime[ 0 ];
          params += '&EndTime=' + that.formData.serviceTime[ 1 ];
        }
        
        if ( url === 'UpdComany' ) {
          params += '&ID=' + that.formData.ID;
        }
        that.$axios.post('/Company/' + url, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
              that.$refs[ 'upload' ].resetFields();
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
