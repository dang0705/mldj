<template>
	<div id="citySelectWrapper">
    <el-cascader
      :options="options2"
      @active-item-change="handleItemChange"
      :props="props"
      placeholder="省份>市"
      expand-trigger="hover"
    ></el-cascader>
  </div>
</template>

<script>
	export default {
		name: "citySelect",
    data() {
      return {
        options2: [{
          label: '江苏',
          cities: []
        }, {
          label: '浙江',
          cities: []
        }],
        props: {
          value: 'label',
          children: 'cities'
        }
      };
    },
    methods: {
      handleItemChange(val) {
        console.log('active item:', val);
        setTimeout(_ => {
          if (val.indexOf('江苏') > -1 && !this.options2[0].cities.length) {
            this.options2[0].cities = [{
              label: '南京'
            }];
          } else if (val.indexOf('浙江') > -1 && !this.options2[1].cities.length) {
            this.options2[1].cities = [{
              label: '杭州'
            }];
          }
        }, 300);
      }
    }
	}
</script>
<style scoped lang="stylus">
  @import  '~@/assets/styles/inputNoBorder.styl'
  #citySelectWrapper
    display inline-block
  #citySelectWrapper >>> .el-input__inner
    inputNoBorder()
  #citySelectWrapper >>> .el-input__inner:focus
    inputNoFocusLine()


</style>
