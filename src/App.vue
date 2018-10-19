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
  
  #app >>> .el-input__inner
    inputNoBorder()
  #app>>>.el-textarea__inner
    inputNoBorder()

  /*分页居右  */
  #app >>> .el-pagination
    float right
  
  /*表格无内填充  */
  #app >>> .el-table td
    padding: 0
</style>
