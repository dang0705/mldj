<template>
  <div id="wrapper">
    <search-component></search-component>
    <search-list></search-list>
  </div>
</template>

<script>
  import axios from 'axios'
  import searchComponent from './component/searchComponent'
  import searchList from './component/searchList/searchList'
  export default {
    name: "activityManagement",
    data() {
      return {
        list: []
      };
    },
    components:{
      searchComponent,
      searchList
    },
    methods:{
      handelList(){
        axios.get('../../../static/list.json').then(this.getRes)
      },
      getRes(res){
        this.list=res.data
      },
      handelClick(i){
        alert(i)
      }
    }
    ,
    mounted(){
      // axios.get('../../../static/list.json').then(function (res) {
      //     handelList(res)
      // })
      this.handelList()
    }
  }
</script>

<style scoped lang="stylus">
  li
    height: 50px
    span
      margin:0 10px 0;
</style>
