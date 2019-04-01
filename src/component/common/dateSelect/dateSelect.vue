<template>
  <div id="dateWrapper">
    <el-date-picker
      v-model="value"
      size="large"
      value-format="yyyy-MM-dd"
      @change="getDate"
      :type="dataType"
      align="center"
      unlink-panels
      :clearable="isSearch"
      range-separator="到"
      :start-placeholder="start"
      :end-placeholder="end"
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
      start: {
        type: String,
        default: '开始日期'
      },
      end: {
        type: String,
        default: '结束日期'
      },
      dataType:{
        type:String,
        default:'daterange'
      },
      selectedDate: {
        default: () => []
      },
      allDate: {
        type: Boolean,
        default: false
      },
      beforeToday: {
        type: Boolean,
      },
      isClearDate: {
        type: Boolean,
        
      },
      isSearch: {
        type: Boolean
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow ) {
          console.log(this.selectedDate);
          this.value = this.selectedDate;
        } else {
          this.value = [];
        }
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate: time => {
            
            if ( this.beforeToday === true ) {
              return time.getTime() > Date.now() - 8.64e6
            } else if ( this.allDate === false ) {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
          
        },
        value: [],
      };
    },
    methods: {
      getDate(val) {
        this.value = val;
        this.$emit('getDate', this.value)
      }
    }
    ,
    mounted() {
      console.log(this.beforeToday);
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
