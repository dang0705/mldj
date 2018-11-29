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
        v-loading="formLoading"
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
        <el-form-item prop="OrganizationID" label="所在组织：" label-width="120px" v-show="OrganizationIDList.length">
          <el-select v-model="formData.OrganizationID" placeholder="请选择组织">
            <el-option
              v-for="(item,i) in OrganizationIDList"
              :key="i"
              :label="item.OrganizationName"
              :value="item.ID"
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
        formLoading: true,
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
      }
    },
    
    watch: {
      'isAlertShow': function () {
        this.alertShow = this.isAlertShow;
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.getUserInfo();
            this.alertTitle = '编辑用户';
            Msg = '编辑成功';
          }
          else {
            this.formLoading = false;
            this.alertTitle = '新增用户';
            this.formData.roleID = this.OrganizationIDList = '';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      getUserInfo() {
        const that = this;
        that.formLoading = true;
        that.formData.ID = this.editData.ID;
        that.$axios.post('/Organization/GetOrganizationList', {
          pageindex: 0,
          validity: 1,
          companyid: 0
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            that.OrganizationIDList = data.data.Content.DataList
          }
        })
        that.$axios.post('/Account/GetUser', {
          ID: that.formData.ID
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            that.formData.roleID = parseInt(data.data.Content.RoleId);
            that.formData.OrganizationID = data.data.Content.OrganizationID ? data.data.Content.OrganizationID : '';
            that.formData.IsOrgLeader = data.data.Content.IsOrgLeader;
            that.formData.Phone = that.editData.Phone;
            that.formData.Email = that.editData.Email;
            that.formData.EmployeeName = that.editData.EmployeeName;
            that.formData.RoleName = that.editData.RoleName;
            that.formLoading = false
            console.log(that.formData);
          } else {
            that.$message.error(data.data.msg)
          }
        })
      },
      getRoleNameList() {
        const that = this;
        that.$axios.post('/OrganizationalRole/GetRoleList', {
          pageindex: 0,
          validity: 1
        }).then(data => {
          console.log(data);
          if ( data.data.state == 1 ) {
            that.parentOrgNameList = data.data.Content.DataList;
          }
          that.roleLoading = false
        })
      },
      
      handleClose(obj) {
        console.log(obj);
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
        }
      },
      confirmUpload(obj) {
        let that = this;
        if ( !that.formData.Phone ) {
          that.$message.error('手机号码不能为空');
          return
        }
        else if ( !/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(that.formData.Phone) ) {
          that.$message.error('手机号码格式不正确');
          return
        }
        else if ( !that.formData.EmployeeName ) {
          that.$message.error('用户名不能为空');
          return
        }
        else if ( !that.formData.Email ) {
          that.$message.error('邮箱不能为空');
          return
        }
        else if ( !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(that.formData.Email) ) {
          that.$message.error('邮箱格式不正确');
          return
        }
        else if ( !that.formData.roleID ) {
          that.$message.error('角色不能为空');
          return
        }
        
        if ( that.formData.DogType === 'a_dd' ) {
          that.postData('AddUser',obj)
        } else {
          that.postData('UpdUser',obj)
        }
        
      }
      ,
      postData(url,obj) {
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
        that.$axios.post('/Account/' + url, params)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
            }
            else {
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
      this.getRoleNameList();
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-select
    width: 100%
  
</style>
