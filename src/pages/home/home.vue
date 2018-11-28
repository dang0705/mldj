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
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    },
  }
</script>
<style lang="stylus">
</style>
