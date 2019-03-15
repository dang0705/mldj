<template>
  <div id="contentListWrapper">
    <ul id="homepageModule">
      <li v-for="(moduleItem,moduleIndex) in moduleList" @click="goto(moduleIndex)">
        <el-carousel height="100%">
          <el-carousel-item v-if="moduleItem.title==='待审活动'" v-for="(item,index) in activityList" :key="item.ID">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{moduleItem.title}}</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">在首页编辑</el-button>-->
              </div>
              <span>{{index+1}}</span>
              <el-tag>{{item.ActivityName}}</el-tag>
             <!-- <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>-->
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "homePage",
    data() {
      return {
        moduleList: [
          {
            title: '待审活动',
            index:'/myActivityMenu'
          }
          ,
          {
            title:'素材库',
            index:'/SourceManagement'
          }
        ],
        activityList:[]
      }
    },
    methods: {
      
      goto(index){
        if ( this.activityList.length ) {
          this.$router.push({path:this.moduleList[index].index})
        }
      }
    },
    mounted() {
      const that=this;
      that.$axios.post('/Home/ActicityOnload',{
        ApprovalStataus:1
      }).then(data=>{
        if ( data.data.state === 1 ) {
          that.activityList=data.data.Content
        }
      })
    }
  }
</script>

<style scoped lang="stylus">
  
  #contentListWrapper
    padding 0 !important
    width 1280px !important
  >>>.el-carousel
   height 100%
   color #fff
  #homepageModule
    border-top: 1px solid #fff
    
    li
      width 25%
      border-right: 1px solid #fff
      border-bottom: 1px solid #fff
      float left
      height 400px
      background #000
</style>
