<template>
 <div id="dateWrapper">
   <el-date-picker
     v-model="value"
     size="large"
     value-format="yyyy-MM-dd"
     @change="getDate"
     type="daterange"
     align="center"
     unlink-panels
     range-separator="到"
     start-placeholder="开始日期"
     end-placeholder="结束日期"
     :picker-options="pickerOptions2">
   </el-date-picker>
 </div>
</template>

<script>
	export default {
		name: "dateSelect",
    // components:{Bus},
    data() {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: '',
        // pickerTitle:''
      };
    },
    methods:{
      getDate (val) {
        // const val=this.value;
        // this.$store.commit(this.pickerTitle,val);
        // console.log(this.$store.state.pickerTitle);
        let commitName='';
        if ( val ) {
          commitName=this.$store.state.dataPickerTitle==='startAndEndDateSelect'?'startAndEndDateSelect':'advanceAndWithDrawlDateSelect';
          this.$store.commit(commitName,val)
          console.log(val);
        }
        // console.log(commitName);
        // console.log('startDate'+startDate,'endDate'+endDate);
      }
    }
	}
</script>

<style scoped lang="stylus">
  #dateWrapper
    display inline-block
    >div
      width 100%
</style>
