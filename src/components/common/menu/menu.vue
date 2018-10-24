<template>
  <div class="menu">
    <div id="logoWrapper" style="width: 80px;height: 0;padding-bottom: 80px;position: absolute;left: 5%;top: 0; z-index: 10">
      <img src="../../../assets/img/logo.png" alt="" width="100%" >
    </div>
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
        v-for="(eachSub,index) in firstLevelNavigationArr[firstLevelNavigationIndex].subNav"
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
  import axios from 'axios'
  
  export default {
    name: 'head-Menu',
    data() {
      return {
        isActive: 0,
        isSubActive: 0,
        firstLevelNavigationArr: [ {navName: '', subNav: []} ],
        secondNavigationArr: [],
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
    mounted() {
      var that = this;
      axios.post('/api/Menu/GetRoleMenListByTree')
        .then(data => {
          console.log(data);
          this.firstLevelNavigationArr=[];
          if ( data.data.state !== 1 ) {
            that.$router.push('/login');
            return
          }
          const myData = data.data.Content;
          for ( var i = 0; i < myData.length; i++ ) {
            that.firstLevelNavigationArr.push({navName: myData[ i ].MenuName, subNav: []});
            for ( var j = 0; j < myData[ i ].MenuList.length; j++ ) {
              var MenuList = myData[ i ].MenuList[ j ];
              that.firstLevelNavigationArr[ i ].subNav.push({subNavNam: MenuList.MenuName, subIndex: MenuList.MenuCode})
            }
          }
          console.log(that.firstLevelNavigationArr);
        })
    },
    
    methods: {
      showSecondNavigation(i) {
        this.firstLevelNavigationIndex = i;
        this.isActive = i;
        this.$store.commit('changeMenu', i)
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
