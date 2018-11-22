<template>
  <div class="index">
    <!--<homeHeader></homeHeader>-->
    <menu-select></menu-select>
    <router-view></router-view>
  </div>
</template>

<script>
  import menuSelect from '@/component/common/menu/menu'
  // import homeHeader from '@/component/common/header/header'
  import axios from 'axios'
  
  export default {
    name: 'home',
    components:{
      menuSelect
      // homeHeader
    },
    // data() {
    //
    // },
    methods: {},
    mounted() {
      this.$router.push('/activityManagement')
    },
  }
</script>
<style lang="stylus">
</style>
