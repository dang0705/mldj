<template>
  <el-dialog
    :visible.sync="isAlertShow"
    title="修改密码"
    align="center"
    :before-close="handleClose"
  >
    <el-form
      label-width="120px"
      align="left"
      autocomplete="new-password"
    >
      <el-form-item
        label="旧密码："
      >
        <el-input v-model="oldPsw" type="password" clearable></el-input>
      </el-form-item>
      <el-form-item
        label="新密码："
      >
        <el-input v-model="newPsw" type="password" clearable></el-input>
      </el-form-item>
      <el-form-item
        label="确认新密码："
      >
        <el-input v-model="confirmPsw" type="password" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import md5 from 'md5'
  
  const storage = window.localStorage;
  export default {
    name: "psw_dialog",
    props: {
      isAlertShow: {
        type: Boolean
      }
    },
    data() {
      return {
        isOldPswReadOnly: true,
        isNewPswReadOnly: true,
        isConfirmPswReadOnly: true,
        oldPsw: '',
        reg: /^((?!\d+$)(?![a-zA-Z]+$)[a-zA-Z\d_+]{8,20})$/,
        newPsw: '',
        confirmPsw: ''
      }
    },
    methods: {
      handleClose(obj) {
        this.$emit('closeAlert');
        this.oldPsw = this.newPsw = this.confirmPsw = ''
        /*if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert')
        }else {
        
        }*/
      },
      confirm() {
        const that = this;
        if ( that.newPsw !== that.confirmPsw ) {
          that.$message.error('两次输入的新密码不一致,请重新填写')
        }else if(!that.reg.test(that.newPsw)||!that.reg.test(that.confirmPsw)){
          that.$message.error('密码必须数字和大小字母组合，且长度必须大于6位！');
        }
        else {
          if ( storage.getItem('ID') ) {
            that.$axios.post('/Account/UpdatePwd', {
              ID: storage.getItem('ID'),
              OldPassword: md5(that.oldPsw),
              NewPassword: md5(that.newPsw || that.confirmPsw),
            }).then(data => {
              console.log(data);
              if ( data.data.state === 1 ) {
                that.$message.success('密码修改成功')
                that.handleClose()
              }else {
                that.$message.error(data.data.msg)
              }
            })
          } else {
            that.$router.push('/')
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
