<template>
  <div>
    <el-dialog
      :visible.sync="isAlertShow"
      :before-close="handleClose"
    >
      <el-form :model="form">
        <div id="" v-show="next1Flag">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动编号" :label-width="formLabelWidth">
            <el-input v-model="form.number" autocomplete="off"></el-input>
          </el-form-item>
          <city-select></city-select>
          <el-input v-model="form.address" autocomplete="off" placeholder="详细地址"></el-input>
          <el-form-item label="Crm门店" :label-width="formLabelWidth">
            <el-input v-model="form.store" autocomplete="off"></el-input>
          </el-form-item>
          <date-select @click="sendPickerTitle('startAndEndDateSelect')"></date-select>
          <date-select @click="sendPickerTitle('advanceAndWithDrawlDateSelect')"></date-select>
        </div>
        <el-form-item label="活动区域" :label-width="formLabelWidth" v-show="prevFlag">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="cancel" >取 消</el-button>-->
        <el-button type="primary" @click="next1" v-show="next1Flag">下一步</el-button>
        <el-button type="primary" @click="prev" v-show="prevFlag">上一步</el-button>
        <el-button type="primary" @click="next2" v-show="next2Flag">下一步</el-button>
        <el-button type="primary" @click="confirm" v-show="confirmFLag">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import citySelect from '@/components/common/citySelect/citySelect'
  import dateSelect from '@/components/common/dateSelect/dateSelect'
  
  export default {
    name: "alertDialog",
    props: {
      isAlertShow: {
        type: Boolean
      }
    },
    components: {
      citySelect, dateSelect
    },
    data() {
      return {
        dialogFormVisible: this.isAlertShow,
        next1Flag: true,
        prevFlag: false,
        next2Flag: false,
        confirmFLag: false,
        gridData: [ {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        } ],
        // dialogTableVisible: false,
        form: {
          name: '',
          number: '',
          city: '',
          address: '',
          store: '',
          startDate:'',
          endDate:'',
          advanceDate:'',/*进场时间*/
          withDrawlDate:'',/*撤场时间*/
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    },
    methods: {
      sendPickerTitle (val){
        this.$store.state.pickerTitle=val;
        alert(this.$store.state.pickerTitle)
      },
      next1() {
        console.log(this.form.name);
        this.form.city = this.$store.state.city;
        this.form.startDate = this.$store.state.startDate;
        this.form.endDate = this.$store.state.endDate;
        this.form.advanceDate = this.$store.state.advanceDate;
        this.form.withDrawlDate = this.$store.state.withDrawlDate;
        console.log(this.form.city);
        this.prevFlag = true;
        this.next1Flag = false
      },
      prev() {
      
      },
      next2() {
      },
      confirm() {
        this.$emit('closeAlert')
      },
      handleClose() {
        this.next1Flag = true;
        this.prevFlag = false;
        this.next2Flag = false;
        this.confirmFLag = false;
        this.$emit('closeAlert')
      }
    }
  }
</script>

<style scoped>

</style>
