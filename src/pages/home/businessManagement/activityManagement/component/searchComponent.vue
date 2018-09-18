<template>
  <div id="searchWrapper">
    <input type="text" class="textSearch" placeholder="名称">
    <i class="el-icon-search"></i>
    
    <city-select></city-select>
    
    <el-select
      v-model="value"
      placeholder="请选择"
      multiple
      collapse-tags
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        >
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import citySelect from '@/components/common/citySelect/citySelect'
	export default {
		name: "searchComponent",
    components:{
      citySelect
    },
    data() {
      return {
        options: [ {
          value: '选项1',
          label: '01店'
        }, {
          value: '选项2',
          label: '01店'
        }, {
          value: '选项3',
          label: '01店'
        }, {
          value: '选项4',
          label: '01店'
        }, {
          value: '选项5',
          label: '01店'
        } ],
        value: ''
      }
    }
	}
</script>

<style scoped lang="stylus">
  @import  '~@/assets/styles/inputNoBorder.styl'
  #searchWrapper >>> .el-input__inner
    inputNoBorder()
  #searchWrapper
    text-align center
    margin-bottom: 30px
    .textSearch
      width: 500px
      inputNoBorder()
    .el-icon-search
      font-size: 30px
      cursor pointer
      vertical-align middle
    #storeSelect
      inputNoBorder()
      inputNoFocusLine()

</style>
