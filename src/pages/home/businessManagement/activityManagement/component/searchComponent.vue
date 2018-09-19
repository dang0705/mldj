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
          value: '1',
          label: '01店'
        }, {
          value: '2',
          label: '02店'
        }, {
          value: '3',
          label: '03店'
        }, {
          value: '4',
          label: '04店'
        }, {
          value: '5',
          label: '05店'
        } ],
        value: ''
      }
    }
	}
</script>

<style scoped lang="stylus">
  @import  '~@/assets/styles/mixin.styl'
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
    .el-select
      width: 300px

</style>
