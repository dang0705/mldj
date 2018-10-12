<template>
  <div class="filter">
    <input type="text" v-model="keyWord">
    <input type="button" value="搜索" @click="filter">
  </div>
</template>

<script>
  export default {
    name: "filter",
    data() {
      return {
        keyWord: ''
      }
    },
    props: {}
    ,
    methods: {
      filter() {
        this.$emit('filter', this.keyWord)
      }
    }
    ,
    mounted() {
    }
  }
</script>

<style scoped lang="stylus">

</style>
