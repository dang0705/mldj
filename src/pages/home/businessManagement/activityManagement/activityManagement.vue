<template>
  <div id="wrapper">
    <search-component></search-component>
  </div>
</template>

<script>
  import axios from 'axios'
  import searchComponent from './component/searchComponent'
  export default {
    name: "activityManagement",
    data() {
      return {
        list: []
      };
    },
    components:{
      searchComponent
    },
    methods:{
      handelList(){
        axios.get('../../../static/list.json').then(this.getRes)
      },
      getRes(res){
        console.log('res.data='+res.data);
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
