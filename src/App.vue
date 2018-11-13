<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #app
    height: 100%
  
  #app >>> .filterComponents
    width 1220px
    margin-bottom 40px
  
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
  #app>>>.el-form-item__label
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
