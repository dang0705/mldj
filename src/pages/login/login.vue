<template>
  <div id="loginBg">
    <div id="loginWrapper">
      <img src="../../assets/img/logo.png" alt="" width="50%" style="margin: 0 auto 40px;display: block">
      <el-form
        ref="login"
        :model="loginData"
        :rules="loginRules"
      >
        <el-form-item prop="userName">
          <el-input v-model="loginData.userName" autofocus="true" placeholder="用户名:" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginData.password" placeholder="密 码:" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginData.holdLogin">保持登录</el-checkbox>
          <el-button type="text">忘记密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="medium" @click="handleLogin">登&nbsp;&nbsp;&nbsp;&nbsp;陆</el-button>
        </el-form-item>
      </el-form>
      <!--<p class="login">login</p>-->
      <!--<div class="login">
		<p>
		  <el-input  placeholder="请输入用户名"></el-input>
		</p>
		<p>
		  <input type="password" placeholder="请输入密码">
		</p>
		<register></register>
		  <input type="button" value="登陆" id="login" @click="login">
		<router-link to="/activityManagement" >点我啊,傻</router-link>
	  </div>-->
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
              max: 10,
              message: '长度请在3~10个字符',
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
        storage.setItem('userName', this.loginData.userName);
        storage.setItem('password', this.loginData.password);
        storage.setItem('isHoldLogin', this.loginData.holdLogin);
        console.log(md5(this.loginData.password));/*md5加密*/
        this.$router.push('/activityManagement')
      }
    },
    mounted() {
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
  #loginWrapper >>> .el-input__inner
    height: 50px
    line-height: 50px
  
  #loginWrapper >>> .el-checkbox__input.is-checked + .el-checkbox__label
    color white
  #loginWrapper >>>.el-checkbox__input.is-checked .el-checkbox__inner
    background-color red
    border-color red
  #loginWrapper >>> .el-checkbox__input.is-focus .el-checkbox__inner
    border-color red
  #loginBg
    height: 100%
    background black
    padding-top 5%
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
          font-size:30px
      .el-button--text
        color white
        float right
</style>
