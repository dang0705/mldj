<template>
  <div id="roleManagementWrapper">
    <content-list></content-list>
  </div>
</template>

<script>
  import contentList from './component/contentList/contentList'
  export default {
    name: "RoleManagement",
    components: {
      contentList
    }
  }
</script>

<style scoped lang="stylus">

</style>
