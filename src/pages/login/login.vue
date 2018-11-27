<template>
  <div id="loginBg" @keyup.enter="handleLogin">
    <div id="loginWrapper">
      <div id="logoWrapper" style="width: 50%;margin: 0 auto 40px;height: 0;padding-bottom: 50%">
        <img src="../../assets/img/logo.png" alt="" width="100%" style="display: block">
      </div>
      <el-form
        ref="login"
        :model="loginData"
        :rules="loginRules"
      >
        <el-form-item prop="userName">
          <el-input v-model="loginData.userName" autofocus="true" placeholder="用户名:" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginData.password" placeholder="密 码:" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="identify" v-model="yanzhengCode" placeholder="验证码" clearable></el-input>
          <input type="button" value="" v-model="checkCode" class="codeBtn" @click="createCode">
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginData.holdLogin">保持登录</el-checkbox>
          <el-button type="text">忘记密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="medium" @click="handleLogin">登&nbsp;&nbsp;&nbsp;&nbsp;陆</el-button>
        </el-form-item>
      </el-form>
    
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from 'md5'
  
  let storage = window.localStorage;
  export default {
    name: "login",
    data() {
      return {
        checkCode: '',
        yanzhengCode: '',
        loginData: {
          userName: '',
          password: '',
          holdLogin: false
        },
        loginRules: {
          userName: [
            {
              required: true,
              message: '请正确输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 30,
              message: '长度请在3~30个字符',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请正确输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度请在3~10个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleLogin: function () {
        if ( this.loginData.userName == '' ) {
          this.$message.error('用户名不能为空');
          return
        } else if ( this.loginData.password == '' ) {
          this.$message.error('密码不能为空');
          return
        } else if ( this.yanzhengCode !== this.checkCode ) {
          this.$message.error('验证码错误');
          this.createCode();
          return
        }
        /*md5加密*/
        axios.post('/api/Account/Login', {
          UserName: this.loginData.userName,
          UserPwd: md5(this.loginData.password),
          ValidateCode: '59898989'
        }).then(data => {
          console.log(data);
          const res = data.data.Content.UserInfo;
          if ( data.data.state == 1 ) {
            this.$router.push('/EmployeeMenu');
            storage.setItem('userName', this.loginData.userName);
            storage.setItem('password', this.loginData.password);
            storage.setItem('isHoldLogin', this.loginData.holdLogin);
            storage.setItem('RoleID', res.RoleID);
            storage.setItem('CompanyID', res.CompanyID)
          } else {
            this.$message.error('用户名或密码错误');
            this.createCode();
          }
        });
        // this.$router.push('/activityManagement')
      },
      createCode() {
        //先清空验证码的输入
        this.code = "";
        this.checkCode = "";
        this.picLyanzhengma = "";
        //验证码的长度
        var codeLength = 4;
        //随机数
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        for ( var i = 0; i < codeLength; i++ ) {
          //取得随机数的索引（0~35）
          var index = Math.floor(Math.random() * 36);
          //根据索引取得随机数加到code上
          this.code += random[ index ];
        }
        //把code值赋给验证码
        this.checkCode = this.code.toLowerCase();
      }
    },
    created() {
      
      this.createCode();
      if ( storage.getItem('isHoldLogin') === 'true' ) {
        this.loginData.userName = storage.getItem('userName');
        this.loginData.password = storage.getItem('password');
        this.loginData.holdLogin = true;
      }
    }
  }
</script>

<style scoped lang="stylus">
  /* input
	 margin 10px 0 0;
	 width: 100%;
	 height: 50px
   .login
	 width: 20%;
	 position: absolute;
	 left:-webkit-calc(50% - (20%/2));
	 top:100px;*/
  @import "~@~@/assets/styles/mixin.styl"
  #loginWrapper >>> .el-input__inner
    height: 50px
    line-height: 50px
    border-color white
    color white
  
  #loginWrapper >>> .el-checkbox__input.is-checked + .el-checkbox__label
    color white
  
  #loginWrapper >>> .el-checkbox__input.is-checked .el-checkbox__inner
    background-color red
    border-color red
  
  #loginWrapper >>> .el-checkbox__input.is-focus .el-checkbox__inner
    border-color red
  
  #loginBg
    height: 100%
    background black
    padding-top 5%
    box-sizing border-box
    #loginWrapper
      box-sizing border-box
      width 500px
      height: 700px
      margin 0 auto 0
      border: 1px solid #fff
      padding 60px
      .el-form-item
        margin-bottom: 40px
      .el-button.el-button--danger
        width: 100%
        height: 50px
        background-color red
        border-color red
        font-size: 30px
      .el-button--text
        color white
        float right
      .identify
        width: 300px
      .codeBtn
        height: 50px
        line-height: 50px
        width: 60px
        background black
        color white
        inputNoBorder()
        float right
        font-size: 20px
</style>
