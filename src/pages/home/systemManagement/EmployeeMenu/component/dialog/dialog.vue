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
        <el-form-item prop="Phone" label="手机号：" label-width="120px">
          <el-input v-model="formData.Phone" clearable minlength="1"
                    maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="EmployeeName" label="用户名：" label-width="120px">
          <el-input v-model="formData.EmployeeName" clearable minlength="1"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="Email" label="邮箱：" label-width="120px">
          <el-input v-model="formData.Email" clearable minlength="1"></el-input>
        </el-form-item>
        
        <el-form-item prop="RoleName" label="角色：" label-width="120px">
          <el-select v-model="formData.roleID" v-loading="roleLoading">
            <el-option
              v-for="(item,i) in parentOrgNameList"
              :key="i"
              :label="item.RoleName"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="OrganizationID" label="所在组织：" label-width="120px" v-if="OrganizationIDList.length">
          <el-select v-model="formData.OrganizationID">
            <el-option
              v-for="(item,i) in OrganizationIDList"
              :key="i"
              :label="item.OrganizationName"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="IsOrgLeader" label="是否负责人：" label-width="120px">
          <el-select v-model="formData.IsOrgLeader">
            <el-option
              v-for="(item,i) in IsOrgLeaderList"
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
  let Msg = '';
  export default {
    // inject:['reload'],
    name: "EmployeeMenu_dialog",
    
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
        OrganizationIDList: [],
        IsOrgLeaderList: [
          {label: '是', value: 1},
          {label: '否', value: 0}
        ],
        isEdit: false,
        alertTitle: '',
        alertShow: false,
        roleLoading: true,
        isDisplay: true,
        uploadType: '.apk',
        file: false,
        formData: {
          Phone: '',
          Email: '',
          OrganizationID: '',
          EmployeeName: '',
          RoleName: '',
          roleID: '',
          ID: '',
          IsOrgLeader: '',
          DogType: "a_dd"
        }
        ,
        editFormData: {},
        
        uploadRules: {
          Phone: [
            {
              required: true,
              message: '手机号称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 11,
              message: '长度请在1~11个字符',
              trigger: 'blur'
            }
          ]
          ,
          EmployeeName: [
            {
              required: true,
              message: '用户名为必填项',
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
          Email: [
            {
              required: true,
              message: '邮箱为必填项',
              trigger: 'blur'
            }
          ]
          ,
          RoleName: [
            {
              required: true,
              message: '角色为必填项',
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
            // this.formData = this.editData;
            this.getUserInfo();
            this.alertTitle = '编辑用户';
            Msg = '编辑成功';
          }
          else {
            this.alertTitle = '新增用户';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
          // console.log(this.formData);
        }
      }
    },
    
    methods: {
      getUserInfo() {
        const that = this;
        that.formData.ID = this.editData.ID;
        that.$axios.post('/api/Account/GetUser', {
          ID: that.formData.ID
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            // that.formData = that.editData;
            that.formData.roleID = parseInt(data.data.Content.RoleId);
            that.formData.OrganizationID = data.data.Content.OrganizationID;
            that.formData.IsOrgLeader = data.data.Content.IsOrgLeader;
            that.formData.Phone = that.editData.Phone;
            that.formData.Email = that.editData.Email;
            that.formData.EmployeeName = that.editData.EmployeeName;
            that.formData.RoleName = that.editData.RoleName;
            console.log(that.formData);
          } else {
            that.$message.error(data.data.msg)
          }
          // console.log(data);
        })
      },
      getRoleNameList() {
        const that = this;
        that.$axios.post('/api/OrganizationalRole/GetRoleList', {
          pageindex: 0,
          validity: 1
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            that.parentOrgNameList = data.data.Content.DataList;
          }
          console.log(that.parentOrgNameList);
          that.roleLoading = false
        })
      },
      
      handleClose(obj) {
        console.log(obj);
        if ( obj.target && obj.target.innerText === '取 消' ) {
          this.$emit('closeAlert', 'n');
        }else {
          this.$emit('closeAlert');
        }
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
        if ( that.formData.Phone === '' ) {
          that.$message.error('组织名称不能为空');
          return
        }
        else if ( that.formData.EmployeeName === '' ) {
          that.$message.error('用户名不能为空');
          return
        }
        else if ( that.formData.Email === '' ) {
          that.$message.error('邮箱不能为空');
          return
        }
        else if ( that.formData.roleID === '' ) {
          that.$message.error('角色不能为空');
          return
        }
        /* else if ( that.formData.OrganizationID === '' ) {
		   that.$message.error('所在组织不能为空');
		   return
		 }*/
        
        
        if ( that.formData.DogType === 'a_dd' ) {
          that.postData('AddUser')
        } else {
          that.postData('UpdUser')
        }
        
      }
      ,
      postData(url) {
        const that = this;
        var params = '';
        params += '&Phone=' + that.formData.Phone;
        params += '&EmployeeName=' + that.formData.EmployeeName;
        params += '&Email=' + that.formData.Email;
        params += '&RoleId=' + that.formData.roleID;
        params += '&OrganizationID=' + that.formData.OrganizationID;
        params += '&IsOrgLeader=' + that.formData.IsOrgLeader;
        
        if ( url === 'UpdUser' ) {
          params += '&ID=' + that.formData.ID;
        }
        that.$axios.post('/api/Account/' + url, params)
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
      this.getRoleNameList();
      // this.OrganizationIDList = this.$store.state.organizationList;
      // console.log(this.OrganizationIDList);
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog
    width 300px
    max-width 800px
    text-align center
  
  .dialogWrapper >>> .el-select
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
