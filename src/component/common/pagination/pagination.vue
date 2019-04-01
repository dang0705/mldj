<template>
  <div id="paginationWrapper">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="isSortable?[5,10,15,tableLength]:[5,10,15]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.length">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "pagination",
    props: {
      tableList: {
        type: Array,
        default: []
      },
      tableLength:{
        type:Number
      },
      isSortable: {
        type: Boolean,
        default: false
      },
      isListChange: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        list: [],
        currentPage: 1, //初始页
        pageSize: 15,    //    每页的数据
        sendPaginationData: []
      }
    },
    watch: {
      'isListChange': function () {
        this.list = this.tableList;
        this.$emit('listChanged')
      }
    },
    
    methods: {
      handleSizeChange(size) {
        this.pageSize = size;
        this.$emit('pageSize', size);
        //每页下拉显示数据
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.$emit('currentPage', currentPage);
        //点击第几页
      }
    },
    mounted() {
      this.$emit('defaultPaginationData', [ this.currentPage, this.pageSize ]);
    }
  }
</script>

<style scoped lang="stylus">

</style>
