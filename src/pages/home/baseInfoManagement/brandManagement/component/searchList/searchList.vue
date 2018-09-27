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
          '操作', '品牌名称', '品牌编号', '品牌logo', '增加+'
        ],
        liStyleObj: [
          {width: '140px'},
          {width: '280px'},
          {width: '320px'},
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
    margin-top: 80px
    #title
      width: 1220px
      margin 0 auto
      background #fff
      text-align left
    li
      listTitleFont()
</style>
