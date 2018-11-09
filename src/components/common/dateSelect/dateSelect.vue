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
      :clearable="false"
      range-separator="到"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: "dateSelect",
    props: {
      isAlertShow: {
        type: Boolean
      }
      ,
      selectedDate: {
        default: []
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow ) {
          console.log(this.selectedDate);
          this.value = this.selectedDate;
        }
      }
    },
    // components:{Bus},
    data() {
      return {
        pickerOptions: {
          disabledDate: time => {
            return time.getTime() < Date.now() - 8.64e7
          }
    
        },
        value: [],
        // pickerTitle:''
      };
    },
    methods: {
      getDate(val) {
        console.log(val);
        let commitName = '';
        this.$emit('getDate', val)
        // if ( val ) {
        //   commitName=this.$store.state.dataPickerTitle==='startAndEndDateSelect'?'startAndEndDateSelect':'advanceAndWithDrawlDateSelect';
        //   this.$store.commit(commitName,val);
        //   console.log(val);
        // }
      }
      
    }
    ,
    mounted() {
      this.value = this.selectedDate;
    }
  }
</script>

<style scoped lang="stylus">
  #dateWrapper
    display inline-block
    > div
      width 100%
</style>
