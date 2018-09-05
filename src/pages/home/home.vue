<!--<template>
	<div>home</div>
</template>

<script>
	export default {
		name: "home"
	}
</script>

<style scoped>

</style>-->
<template>
  <div class="index">
    <menu-select :active.sync="active"></menu-select>
    <router-view></router-view>
  </div>
</template>

<script>
  import menuSelect from '@/components/commen/menu/menu'
  
  export default {
    name: 'home',
    components: {
      menuSelect
    },
    data() {
      return {
        active: 'a'
      };
    },
    methods: {
    
    },
    mounted:function () {
      // this.active='a';
    },
    watch:{
      active(newVal){
        console.log(newVal);
        this.$router.push({
          path:`${this.active}`
        })
      }
    }
  }
</script>
