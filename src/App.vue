<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
     this.$myFunctions.disableBackAndForward()
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  @import '~@/assets/styles/varibles.styl'
  @import '~@/assets/styles/common.styl'
 
</style>
