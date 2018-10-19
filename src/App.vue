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
  #app
    height: 100%
  
  /*分页居右  */
  #app>>>.el-pagination
    float right
   
  /*表格无内填充  */
  #app >>>.el-table td
    padding: 0
</style>
