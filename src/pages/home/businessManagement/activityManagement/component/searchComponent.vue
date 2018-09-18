<template>
  <div>
    <input type="text">
    <i class="el-icon-search"></i>
    <city-select></city-select>
  </div>
</template>

<script>
  import citySelect from '@/components/common/citySelect/citySelect'
	export default {
		name: "searchComponent",
    components:{
      citySelect
    }
   
	}
</script>

<style scoped>

</style>
