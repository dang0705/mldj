<template>
  <div>
    activityManagement
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "activityManagement",
    data() {
      return {
        list: []
      };
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
