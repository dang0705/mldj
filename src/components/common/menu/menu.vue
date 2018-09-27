<template>
  <div class="menu">
    <img src="../../../assets/img/logo.png" alt="" width="80px" style="position: absolute;left: 5%;top: 0; z-index: 10">
    <ul id="firstLevelNavigation">
      <li
        v-for="(item,i) of firstLevelNavigationArr"
        :key="i"
        :class="{ active: isActive ===i}"
        @click="showSecondNavigation(i)"
      >
        {{item.navName}}
      </li>
    </ul>
    
    <ul id="secondLevelNavigation">
      <router-link
        tag="li"
        v-for="(eachSub,index) of firstLevelNavigationArr[firstLevelNavigationIndex].subNav"
        class="secondNavigation"
        :to="eachSub.subIndex"
        :key="index"
      >
        {{eachSub.subNavNam}}
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'head-Menu',
    data() {
      return {
        isActive: 0,
        isSubActive: 0,
        firstLevelNavigationArr: [
          {
            navName: '业务管理',
            subNav: [
              {subNavNam: '活动管理', subIndex: '/activityManagement'},
              {subNavNam: '库存管理', subIndex: '/InventoryManagement'},
              {subNavNam: '订单管理', subIndex: '/orderManagement'},
              {subNavNam: '运维管理', subIndex: '/operationsManagement'} ]
          },
          {
            navName: '基础信息管理',
            subNav: [
              {subNavNam: '品牌管理', subIndex: '/brandManagement'},
              {subNavNam: '门店管理', subIndex: '/storeManagement'},
              {subNavNam: '产品管理', subIndex: '/productManagement'},
              {subNavNam: '仓库管理', subIndex: '/warehouseManagement'},
              {subNavNam: '渠道管理', subIndex: '/channelManagement'} ]
          },
          {
            navName: '设备管理',
            subNav: [
              {subNavNam: '设备管理', subIndex: '/deviceManagementPage'},
              {subNavNam: '设备版本管理', subIndex: '/deviceVersionManagement'},
              {subNavNam: '媒体管理', subIndex: '/mediaManagement'} ]
          },
          {
            navName: '人员管理',
            subNav: [
              {subNavNam: '用户管理', subIndex: '/personnelManagementPage'},
              {subNavNam: '角色管理', subIndex: '/roleManagement'} ]
          },
        ],
        firstLevelNavigationIndex: 0,
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
      showSecondNavigation(i) {
        this.firstLevelNavigationIndex = i;
        this.isActive = i
        // console.log(this.firstLevelNavigationIndex);
      },
      secondNavigation(i) {
        this.isSubActive = i;
        alert(0)
      },
      handleSelect(key, keyPath) {
        // this.$store.commit('changeMenu', key);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/varibles.styl'
  .active
    color white
  #firstLevelNavigation
    font-size 27px
    font-weight: bold
    height: 80px
    line-height: 80px
    background #000
    color #a5a5a5
    text-align center
    li
      display inline-block
      margin 0 40px
      cursor: pointer
  .menu
    #secondLevelNavigation
      text-align center
      background white
      margin-bottom: 10px
      box-shadow $boxShadow
    .secondNavigation
      cursor pointer
      display inline-block
      margin 0 40px
      padding: 0
      font-size: 20px
      height: 60px
      line-height: 60px
    .router-link-exact-active.router-link-active
      color red
    

  

</style>
