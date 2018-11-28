<template>
  <div id="storeManagementWrapper">
  
    <content-list>
    </content-list>
  </div>
</template>

<script>
  import contentList from './component/contentList/contentList'
	export default {
		name: "storeManagement",
    components: {
      contentList
    }
	}
</script>

<style scoped lang="stylus">

</style>
