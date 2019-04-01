<template>
  <div id="table">
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      width="100%"
      :height="windowHeight"
      border
      :header-row-style="headerStyle"
      :header-cell-class-name="addBtn"
      :row-style="rowStyle"
      :cell-class-name="data_column"
      v-loading="listLoading"
    >
      <template v-for="(item,index) in tableHeader">
        <el-table-column
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :fixed="item.label.indexOf('201')<0"
          :width="item.label.indexOf('201')<0?'180':'140'"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </template>
    </el-table>
    <pagination
      :tableList="tableData"
      :isListChange="isListChange_data"
      :isSortable="true"
      :tableLength="tableData.length"
      @currentPage="getCurrentPage"
      @pageSize="getPageSize"
      @defaultPaginationData="defaultPaginationData"
      @listChanged="listChanged"
    ></pagination>
  </div>
</template>

<script>
  // import TableColumn from './TableColumn'
  import pagination from '@/component/common/pagination/pagination'
  
  export default {
    components: {
      pagination,
    },
    props: {
      windowHeight: {
        type: Number
      },
      // 多级表头的数据
      tableHeader: {
        type: Array,
        required: true
      },
      // 表格的数据
      tableData: {
        type: Array,
        required: true
      },
      listLoading: {
        type: Boolean,
        required: true
      },
      isListChange: {
        type: Boolean,
        required: true
      },
      
    },
    
    data() {
      return {
        isListChange_data: true,
        currentPage: 1, //初始页
        pageSize: 5,
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '20px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
      }
    },
    methods: {
      listChanged() {
        this.isListChange_data = false
      },
      defaultPaginationData(val) {
        if ( val && val.length ) {
          this.currentPage = val[ 0 ];
          this.pageSize = val[ 1 ]
        }
      },
      getCurrentPage(currentPage) {
        this.currentPage = currentPage
      },
      getPageSize(pageSize) {
        this.pageSize = pageSize
      },
      addBtn({row, column, rowIndex, columnIndex}, noAdd) {
        return this.$myFunctions.tableHeadReset({row, column, rowIndex, columnIndex}, noAdd);
      },
      data_column({row, column, rowIndex, columnIndex}) {
        console.log(row);
        // return row[ 'StoreName' ] === '沈阳K11店' ? 'high' : 'data_column'
        // for ( var key in row ) {
        //   if ( key.indexOf('201') > -1 ) {
        //     return row[ key ] < 100 ? 'data_column' : 'high'
        //   }
        // }
      }
    },
    watch: {
      'isListChange': function () {
        this.isListChange_data = this.isListChange
      }
    },
    mounted() {
      this.isListChange_data = this.isListChange;
    }
  }
</script>

<style scoped lang="stylus">
  #table >>> .data_column
    background #ededed
</style>

