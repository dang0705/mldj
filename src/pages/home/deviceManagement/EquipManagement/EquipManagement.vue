<template>
  <div id="apkManagementWrapper">
    <search-list>
    </search-list>
    <content-list>
    </content-list>
  </div>
</template>

<script>
  import searchList from './component/searchList/searchList'
  import contentList from './component/contentList/contentList'
	export default {
		name: "ApkManagement",
    components: {
      searchList,
      contentList
    }
	}
</script>

<style scoped lang="stylus">

</style>
