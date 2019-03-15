<template>
  <div id="contentListWrapper">
    <!--    <div class="filterComponents">
		  <el-input
			autofocus
			class="input activeName"
			v-model="keyWord"
			autocomplete="on"
			placeholder="名称"
			@keyup.enter.native="getList"
		  >
			<i
			  class="el-icon-search el-input__icon"
			  slot="suffix"
			  @click="getList"
			>
			</i>
		  </el-input>
		</div>-->
    <el-table width="100%"
              :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :header-row-style="headerStyle"
              :header-cell-class-name="addBtn"
              :row-style="rowStyle"
              @header-click="add"
              v-loading="listLoading"
    
    >
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" circle @click="getData(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"
                     @click="deleteItem(scope.$index,scope.row)">
          </el-button>
        </template>
      </el-table-column>
      
      <el-table-column
        label="渠道名称"
        prop="ChannelName"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="渠道编号"
        prop="ChannelCode"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="渠道描述"
        prop="ChannelDec"
        width="660"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>
 <!--     <el-table-column label="增加+">
      </el-table-column>-->
    
    </el-table>
    <pagination
      :tableList="list"
      :isListChange="isListChange"
      @currentPage="getCurrentPage"
      @pageSize="getPageSize"
      @defaultPaginationData="defaultPaginationData"
      @listChanged="listChanged"
    
    ></pagination>
   <!-- <alert-dialog :isAlertShow.sync="isAlertShow" @closeAlert="closeAlert" :editOrAdd="dialogType" :id="id"
                  :editData="sendDialogData"></alert-dialog>-->
  
  </div>
</template>

<script>
  import pagination from '@/component/common/pagination/pagination'
  
  export default {
    name: "contentList",
    components:{
      pagination
    },
    data() {
      return {
        list: [],
        listLoading: true,
        isListChange: false,
        currentPage: 1, //初始页
        pageSize: 5,    //    每页的数据
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
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const that = this;
        that.$axios.post('/Home/Saledata')
          .then(data => {
          
          })
      },
      listChanged() {
        this.isListChange = false
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
      }
      ,
      addBtn({row, column, rowIndex, columnIndex}) {
        // return this.$myFunctions.tableHeadReset(row, column, rowIndex, columnIndex);
      },
      add(column, event) {
        if ( column.label === '增加+' ) {
          this.isAlertShow = true;
          this.dialogType = 'a_dd';
          console.log(this.dialogType);
        }
      },
    }
  }
</script>

<style scoped lang="stylus">

</style>
