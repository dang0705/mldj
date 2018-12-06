<template>
  <div class="index">
    <!--<homeHeader></homeHeader>-->
    <menu-select></menu-select>
    <router-view></router-view>
  </div>
</template>

<script>
  import menuSelect from '@/component/common/menu/menu'
  
  export default {
    name: 'home',
    components:{
      menuSelect
    },

    methods: {},
    mounted() {
      this.$myFunctions.disableBackAndForward()
    },
  }
</script>
<style lang="stylus">

</style>
