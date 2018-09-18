<template>
  <div class="menu">
    <img src="../../../assets/img/logo.png" alt="" width="3%" style="position: absolute;left: 3%;top: 2%; z-index: 10">
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu"
      @select="handleSelect"
      mode="horizontal"
      background-color="#000"
      text-color="#ccc"
      active-text-color="#fff">
      <el-submenu index="businessManagement">
        <template slot="title">业务管理</template>
        <el-menu-item index="activityManagement">活动管理</el-menu-item>
        <el-menu-item index="InventoryManagement">库存管理</el-menu-item>
        <el-menu-item index="orderManagement">订单管理</el-menu-item>
        <el-menu-item index="operationsManagement">运维管理</el-menu-item>
      </el-submenu>
      <el-submenu index="baseInfoManagement">
        <template slot="title">基础信息管理</template>
        <el-menu-item index="brandManagement">品牌管理</el-menu-item>
        <el-menu-item index="storeManagement">门店管理</el-menu-item>
        <el-menu-item index="productManagement">产品管理</el-menu-item>
        <el-menu-item index="channelManagement">渠道管理</el-menu-item>
      </el-submenu>
      
      <el-submenu index="deviceManagement">
        <template slot="title">设备管理</template>
        <el-menu-item index="deviceManagementPage">设备管理</el-menu-item>
        <el-menu-item index="deviceVersionManagement">设备版本管理</el-menu-item>
        <el-menu-item index="mediaManagement">媒体管理</el-menu-item>
      </el-submenu>
      
      <el-submenu index="personalManagement">
        <template slot="title">人员管理</template>
        <el-menu-item index="personnelManagementPage">人员管理</el-menu-item>
        <el-menu-item index="roleManagement">角色管理</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        activeIndex: 'businessManagement/activityManagement'
      }
    },
    // props:{
    //   active:{
    //     type:String,
    //     required:true,
    //     default:'personnelManagement'
    //   }
    // },
    beforeMount() {
    },
    
    methods: {
      handleSelect(key, keyPath) {
        //console.log(key, keyPath);
        //console.log(key);
        // this.$emit('update:active',key)
        this.$store.commit('changeMenu', key)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .menu >>> .el-submenu__title
    font-size 27px
    font-weight: bold
    height: 80px
    line-height: 80px
  
  .menu >>> .el-submenu__title:hover
    color #fff !important
  
  .menu >>> .el-submenu
    float none
    display inline-block
    margin 0 40px
  
  .menu
    position: relative
    width 100%
    left 0
    top 0
    text-align center
    .el-menu-item:hover
      color red !important
  /*height 80px*/
</style>
