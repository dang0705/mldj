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
    <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" ></alert-dialog>
  </div>
</template>

<script>
  import listTitle from '@/components/common/listTitle/listTitle'
  import alertDialog from '../dialog/dialog'
  
  export default {
    name: "searchList",
    components: {
      listTitle,
      alertDialog
    },
    data() {
      return {
        keyWord:'',
        titleList: [
          '操作','供应商名称','供应商编号', '联系人电话', '联系人姓名', '供应商描述', '增加+'
        ]
        ,
        liStyleObj: [
          {width: '60px',textAlign:'center'},
          {width: '140px',textAlign:'center'},
          {width: '140px',textAlign:'center'},
          {width: '140px',textAlign:'center'},
          {width: '140px',textAlign:'center'},
          {width: '260px',textAlign:'center'},
          {
            width: '100px',
            margin: 0,
            float: 'right',
            'text-align': 'center',
            cursor: 'pointer'
          }
        ]
        ,
        isAlertShow: false,
        isUpdateDate:false
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
        this.add='';
        this.isAlertShow = false
      }
   
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  @import '~@/assets/styles/varibles.styl'
  #searchListWrapper
    margin: 80px 0 10px 0
    #title
      width: $listWidth
      margin 0 auto
      background #fff
      text-align left
    li
      listTitleFont()
</style>
