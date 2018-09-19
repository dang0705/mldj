<template>
	<div id="listTitleWrapper">
    <ul id="title">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
	export default {
		name: "listTitle",
	}
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/varibles.styl'
  #title
    height: 60px
    background #fff
    box-shadow $boxShadow
    width: 1220px
    margin 0 auto
    li
      height: 100%
      display inline-block
      line-height: 60px
    li:last-child
      background red
      color white
</style>
