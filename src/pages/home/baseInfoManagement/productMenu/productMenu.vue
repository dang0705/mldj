<template>
  <div id="productMenu">
    <content-list>
    </content-list>
  </div>
</template>

<script>
  import contentList from './component/contentList/contentList'
  
  export default {
		name: "productMenu",
    components:{
      contentList
    }
	}
</script>

<style scoped lang="stylus">

</style>
