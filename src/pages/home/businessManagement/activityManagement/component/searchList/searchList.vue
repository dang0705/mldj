<template>
  <div id="searchListWrapper">
    <list-title>
      <li
        v-for="(item,i) in titleList"
        :key="i"
        @click="create(i)"
        :style="liStyleObj[i]"
      >
        {{item}}
      </li>
    </list-title>
    
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert"></alert-dialog>
  </div>
</template>

<script>
  import listTitle from '@/components/common/listTitle/listTitle'
  import alertDialog from './components/dialog/dialog'
  
  export default {
    name: "searchList",
    components: {
      listTitle,
      alertDialog
    },
    data() {
      return {
        titleList: [
          '操作', '活动名称', '活动编号', '活动地点', 'Crm门店', '活动时间', '增加+'
        ],
        liStyleObj: [
          {width: '60px'},
          {width: '200px'},
          {width: '100px'},
          {width: '200px'},
          {width: '160px'},
          {width: '160px'},
          {
            width: '100px',
            margin: 0,
            float: 'right',
            'text-align': 'center',
            cursor: 'pointer'
          }
        ],
        isAlertShow: false
      }
    },
    methods: {
      create(i) {
        if ( i !== this.titleList.length - 1 ) {
          return;
        }
        this.isAlertShow = true;
        console.log(this.isAlertShow);
      },
      
      /*父组件监听子组件关闭弹窗事件,改变隐藏标志*/
      closeAlert() {
        this.isAlertShow = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #searchListWrapper
    text-align center
    #title
      width: 1220px
      margin 0 auto
      background #fff
      text-align left
    li
      listTitleFont()
</style>
