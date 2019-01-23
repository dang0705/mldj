<template>
  <div id="menuWrapper">
    <div id="logoWrapper">
      <img src="../../../assets/img/logo.png" alt="" width="100%" style="display: block;">
    </div>
    <div id="menu">
      <ul id="firstLevelNavigation">
        <li
          v-for="(item,i) of firstLevelNavigationArr"
          :key="i"
          :class="{ active: firstLevelNavigationIndex ===i}"
          @click="showSecondNavigation(i,item)"
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
          :key="index+1"
          @click.native="checkSession"
        >
          {{eachSub.navName}}
        </router-link>
      </ul>
      <div id="info">
        <p id="editPsw" @click="editPassword">修改密码</p>
        <a @click="logOut">欢迎您：{{userName}}</a>
      </div>
    </div>
    <psw-dialog
      :isAlertShow="isAlertShow"
      @closeAlert="closeAlert"
    ></psw-dialog>
  </div>
 
</template>

<script>
  import pswDialog from './dialog/dialog'
  import md5 from 'md5'

  const storage = window.localStorage;
  export default {
    name: 'head-Menu',
    components:{
      pswDialog
    },
    data() {
      return {
        isAlertShow:false,
        userName: storage.getItem('name'),
        isActive: 0,
        isSubActive: 0,
        firstLevelNavigationArr: [ {navName: '', subNav: []} ],
        secondNavigationArr: [],
        firstLevelNavigationIndex: 0,
      }
    },
    
    mounted() {
      this.getMenu()
    },
    
    methods: {
      getMenu() {
        var that = this;
        that.$axios.post('/Menu/GetRoleMenListByTree')
          .then(data => {
            console.log(data);
            that.firstLevelNavigationArr = [];
            if ( data.data.state !== 1 ) {
              that.$router.push('/');
              return
            }
            const myData = data.data.Content;
            for ( var i = 0; i < myData.length; i++ ) {
              that.firstLevelNavigationArr.push({
                navName: myData[ i ].MenuName,
                subNav: [],
                subIndex: myData[ i ].MenuCode
              });
              for ( var j = 0; j < myData[ i ].MenuList.length; j++ ) {
                var MenuList = myData[ i ].MenuList[ j ];
                that.firstLevelNavigationArr[ i ].subNav.push({navName: MenuList.MenuName, subIndex: MenuList.MenuCode})
              }
            }
            that.firstLevelNavigationArr.unshift({navName: '首页'});
            const sendArr = that.firstLevelNavigationArr.filter((ele, idx, arr) => {
              return idx !== 0;
            });
            console.log(sendArr);
            storage.setItem('menu', JSON.stringify(sendArr));
            if ( storage.getItem('menuSelected') ) {
              that.firstLevelNavigationIndex = parseInt(storage.getItem('menuSelected'))
            } else {
              that.firstLevelNavigationIndex = 0
            }
            
          })
      },
      checkSession() {
        this.$axios.post('/Home/checkSession').then(data => {
          console.log(data);
          if ( data.data.state === 3 ) {
            this.$router.push('/')
          }
        });
      }
      ,
      showSecondNavigation(i, item) {
        this.checkSession()
        console.log(item);
        this.firstLevelNavigationIndex = i;
        storage.setItem('menuSelected', i);
        if ( this.firstLevelNavigationIndex !== 0 ) {
          this.$router.push(this.firstLevelNavigationArr[ this.firstLevelNavigationIndex ].subNav[ 0 ].subIndex);
        } else {
          this.$router.push('/homePage');
        }
        storage.removeItem('catalog');
        storage.removeItem('CRMStore');
        storage.removeItem('brand');
        storage.removeItem('store');
        storage.removeItem('source');
        storage.removeItem('device');
        storage.removeItem('activityList');
        storage.removeItem('productList');
        storage.removeItem('channel');
        storage.removeItem('cargoWayList');
        storage.removeItem('employeeList')
      }
      ,
      editPassword(){
        this.isAlertShow=true
      },
      closeAlert(){
        this.isAlertShow=false
    
      },
      
      logOut() {
        this.$confirm('确定退出此账号?', '退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$router.push('../../pages/login/login')
          this.$router.push('/')
        }).catch(() => {
        
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/varibles.styl'
  .active
    color $color
  #editPsw
    height: 30px
    line-height: 30px
    cursor pointer
  #menuWrapper
    width: 1280px
    margin 0 auto
    background #000
    height: 120px
    position relative
    
    div
      float left
    
    #logoWrapper
      width: 120px
    
    #menu
      padding-left: 30px
      width: 1128px
      height 100%
      color #fff
      font-size $listFontSize
      
      #firstLevelNavigation
        height 100%
        line-height: 180px
        background #000
        
        li
          display inline-block
          padding 0 30px
          height: 100%
          cursor: pointer
      
      #secondLevelNavigation
        text-align center
        position: absolute
        left -160px
        top: 120px
        
        .secondNavigation
          cursor pointer
          width: 160px
          margin-bottom: 2px
          padding: 0
          height: 40px
          line-height: 40px
          background #000
        
        .router-link-exact-active.router-link-active
          background-color $color
      
      #info
        position: absolute
        right: 0;
        bottom: 25px
        width: 150px
        
        a
          cursor pointer
  
  /*color blue*/


</style>
