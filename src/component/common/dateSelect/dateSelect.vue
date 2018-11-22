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
        type: Boolean,
        default: () => true
      }
      ,
      selectedDate: {
        default: () => []
      },
      allDate: {
        type: Boolean,
        default:false
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
    data() {
      return {
        pickerOptions: {
          disabledDate: time => {
            if ( !this.allDate ) {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
          
        },
        value: [],
      };
    },
    methods: {
      getDate(val) {
        console.log(val);
        this.$emit('getDate', val)
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
    vertical-align top
    > div
      width 100%
  
  #dateWrapper >>> .el-range-input
    background transparent
</style>
