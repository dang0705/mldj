<template>
  <div id="employeeMenuWrapper">

    <content-list>
    </content-list>
  </div>
</template>

<script>
  import contentList from './component/contentList/contentList'
	export default {
		name: "EmployeeMenu",
    components: {
      contentList
    },
    mounted(){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
	}
</script>

<style scoped lang="stylus">

</style>
