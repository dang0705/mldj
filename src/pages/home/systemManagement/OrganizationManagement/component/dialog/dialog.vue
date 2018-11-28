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
        <el-form-item prop="OrganizationName" label="组织名称：" label-width="120px">
          <el-input v-model="formData.OrganizationName" clearable  minlength="1"
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="OrganizationAbb" label="组织简称：" label-width="120px">
          <el-input v-model="formData.OrganizationAbb" clearable  minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        
        <el-form-item prop="ParentOrgName" label="上级组织：" label-width="120px">
          <el-select v-model="formData.ParentOrgID"  v-loading="selectLoading" >
            <el-option
              v-for="(item,i) in parentOrgNameList"
              :key="i"
              :label="item.OrganizationName"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button  @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let Msg = '';
  export default {
    // inject:['reload'],
    name: "organizationManagement_dialog",
    
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
        parentOrgNameList: [],
        alertTitle: '',
        alertShow: false,
        selectLoading: true,
        isDisplay: true,
        uploadType: '.apk',
        file: false,
        formData: {
          OrganizationName: '',
          OrganizationAbb: '',
          ParentOrgName: '',
          ParentOrgID:'',
          ID: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          OrganizationName: [
            {
              required: true,
              message: '组织名称为必填项',
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
          OrganizationAbb: [
            {
              required: true,
              message: '组织简称为必填项',
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
          ParentOrgName: [
            {
              required: true,
              message: '上级组织为必填项',
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
   
    watch: {
      'isAlertShow': function () {
        this.alertShow = this.isAlertShow;
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData.OrganizationName = this.editData.OrganizationName;
            this.formData.OrganizationAbb = this.editData.OrganizationAbb;
            this.formData.ParentOrgName = this.editData.ParentOrgName;
            this.formData.ParentOrgID = this.editData.ParentOrgID;
            this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑组织';
            Msg = '编辑成功';
          }
          else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增组织';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
          console.log(this.formData);
        }
      }
    },
    
    methods: {
      
      getParentOrgNameList() {
        const that = this;
        that.$axios.post('/Organization/GetOrganizationList', {
          pageindex: 0,
          validity: 1
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            that.parentOrgNameList = data.data.Content.DataList;
            that.$store.commit('sendOrganizationList',that.parentOrgNameList);
          }
          console.log(that.parentOrgNameList);
          that.selectLoading = false
        })
      },
     
      handleClose() {
        this.$emit('closeAlert');
        this.editString = '';
        this.formData.serviceTime = [];
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
        if ( that.formData.OrganizationName === '' ) {
          that.$message.error('组织名称不能为空');
          return
        }
        else if ( that.formData.OrganizationAbb === '' ) {
          that.$message.error('组织简称不能为空');
          return
        }
       
        else if ( that.formData.ParentOrgID === '' ) {
          that.$message.error('上级组织不能为空');
          return
        }
       
        
        if ( that.formData.DogType === 'a_dd' ) {
          that.postData('AddOrganization')
        } else {
          that.postData('UpdOrganization')
        }
        
      }
      ,
      postData(url) {
        const that = this;
        var params = '';
        params += '&OrganizationName=' + that.formData.OrganizationName;
        params += '&OrganizationAbb=' + that.formData.OrganizationAbb;
        params += '&ParentID=' + that.formData.ParentOrgID;
        
        if ( url === 'UpdOrganization' ) {
          params += '&ID=' + that.formData.ID;
        }
        that.$axios.post('/Organization/' + url, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
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
      this.getParentOrgNameList()
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog
    width 300px
    max-width 800px
    text-align center
  .dialogWrapper>>>.el-select
    width: 100%
  
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
