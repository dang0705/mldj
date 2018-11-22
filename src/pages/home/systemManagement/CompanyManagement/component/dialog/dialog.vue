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
        <el-form-item prop="CompanyName">
          <el-input v-model="formData.CompanyName" clearable placeholder="公司名称" minlength="1"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="AccountName">
          <el-input v-model="formData.AccountName" clearable placeholder="开户人" minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="BankName">
          <el-input v-model="formData.BankName" clearable placeholder="开户银行" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="BankCard">
          <el-input v-model="formData.BankCard" clearable placeholder="银行卡号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="BeginTimeAndEndTime">
          <date-select
            :isAlertShow="alertShow"
            :selectedDate="formData.serviceTime"
            @getDate="getDate"
          ></date-select>
        </el-form-item>
        <!--  <div id="imgWrapper">
			<img :src="editFormData.ImgBase" alt="" v-show="!formData.ImgBase" width="200" >
		  </div>-->
      </el-form>
      
      <!--<div slot="footer" class="dialog-footer">-->
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  // import upload from '@/component/common/upload/uploadList'
  import dateSelect from '@/component/common/dateSelect/dateSelect'
  import axios from 'axios'
  
  let Msg = '';
  
  export default {
    // inject:['reload'],
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
        uploadType: '.apk',
        file: false,
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
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增公司';
            Msg = '增加成功';
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
      getDate(val) {
        console.log(val);
        if ( val ) {
          this.formData.serviceTime = val;
        }
      },
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        this.formData.serviceTime = [];
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
        if ( that.formData.CompanyName === '' ) {
          that.$message.error('公司名称不能为空');
          return
        }
        else if ( that.formData.AccountName === '' ) {
          that.$message.error('开户人不能为空');
          return
        }
        else if ( that.formData.BankName === '' ) {
          that.$message.error('开户银行不能为空');
          return
        }
        else if ( that.formData.BankCard === '' ) {
          that.$message.error('银行卡号不能为空');
          return
        }
        else if ( that.formData.serviceTime === [] || !that.formData.serviceTime ) {
          that.$message.error('续费起止日期不能为空');
          return
        }
        
        if ( that.formData.DogType === 'a_dd' ) {
          that.postData('AddCompany')
        } else {
          that.postData('UpdComany')
        }
        
      }
      ,
      postData(url) {
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
        axios.post('/api/Company/' + url, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
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
    ,
    mounted() {
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
