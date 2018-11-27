<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted(){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #app
    height: 100%
  
  #app >>> #contentListWrapper
    width: 1220px
    margin 0 auto
  
  #app >>> .filterComponents
    width 1220px
    margin-bottom 40px
    >div
      margin 0 1% 0
    .el-icon-search
      font-size 30px
      cursor pointer
      vertical-align sub
  #app >>> .el-table
    box-shadow 0 5px 8px rgba(0, 0, 0, .2)
    margin-bottom: 40px
    
  #app >>> .el-table__body-wrapper, #app >>> .el-table__body
    width: 100% !important
  
  #app >>> .addBtn
    height: 100%
    cursor pointer
    background red
    color #fff
    text-align center
    font-size 20px
  
  #app >>> .el-dialog
    width: 450px
  
  #app >>> .el-form-item__label
    text-align left
  
  #app >>> .el-input__inner
    inputNoBorder()
  
  #app >>> .el-textarea__inner
    inputNoBorder()
  
  /*分页居右  */
  #app >>> .el-pagination
    float right
  
  /*表格无内填充  */
  #app >>> .el-table td
    padding: 0
  
  #app >>> .listLoading
    width: 100%
    font-size: 3rem
    text-align center
</style>
