<template>
  <div id="searchWrapper">
    <el-row
      :gutter="10"
      justify="center"
      type="flex">
      
      <el-col :span="8">
        <el-input
          autofocus
          class="input activeName"
          autocomplete="on"
          placeholder="名称"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
        </el-input>
      </el-col>
      <el-col :span="8">
        <city-select></city-select>
      </el-col>
      
      <el-col :span="8">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import citySelect from '@/components/common/citySelect/citySelect'
  
  export default {
    name: "searchComponent",
    components: {
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
    },
    methods:{
      handleIconClick(ev) {
        console.log(ev);
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #searchWrapper >>> .el-input__inner
    inputNoBorder()
  
  #searchWrapper
    width: 1220px;
    margin: 0 auto 30px
    .el-icon-search
      font-size: 30px
      cursor pointer
      vertical-align sub
    .el-select
      width: 100%
      .el-icon-inner
        height 100%

</style>
