<template>
  <div>
    <!--<p class="login">login</p>-->
    <div class="login">
      <p>
        <el-input  placeholder="请输入用户名"></el-input>
      </p>
      <p>
        <input type="password" placeholder="请输入密码">
      </p>
      <register></register>
        <input type="button" value="登陆" id="login" @click="login">
      <router-link to="/activityManagement" >点我啊,傻</router-link>
      <!--<router-link to="../home/baseInfoManagement/brandManagement" >点我啊,傻</router-link>-->
      <!--<router-view></router-view>-->
    </div>
  </div>
</template>

<script>
  import register from './components/register'
  import axios from 'axios'
  
  export default {
    name: "login",
    components: {register},
    methods:{
      login:function () {
        window.localStorage.clear()
      }
    }
  }
</script>

<style scoped lang="stylus">
  input
    margin 10px 0 0;
    width: 100%;
    height: 50px
  .login
    width: 20%;
    position: absolute;
    left:-webkit-calc(50% - (20%/2));
    top:100px;
</style>
