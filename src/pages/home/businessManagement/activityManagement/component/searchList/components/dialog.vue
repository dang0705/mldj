<template>
  <div id="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :before-close="handleClose"
      width="600px"
      title="新增活动"
      :close-on-click-modal='false'
    >
      <el-form :model="form">
        <div id="" v-show="next1Flag">
          <el-row
            :gutter="50"
            type="flex"
            justify="center"
            align="bottom"
          >
            <el-col :span="12">
              <el-input v-model="form.name"
                        autofocus
                        clearable
                        class="input activeName"
                        autocomplete="on"
                        placeholder="请输入活动名称">
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.number"
                        clearable
                        class="input activeNumber"
                        size="medium"
                        autocomplete="on"
                        placeholder="请输入活动编号">
              </el-input>
            </el-col>
          </el-row>
          
          <el-row
            type="flex"
            :gutter="10"
            justify="center"
            align="bottom"
          >
            <el-col :span="4">
              <span>活动地址：</span>
            </el-col>
            <el-col :span="6">
              <city-select @click.native="sendCitySelectTitle('changeActiveCity')"></city-select>
            </el-col>
            <el-col :span="14">
              <el-input v-model="form.activeAddress" clearable class="input" autocomplete="on"
                        placeholder="详细地址"></el-input>
            </el-col>
          </el-row>
          
          <el-row
            type="flex"
            :gutter="10"
            justify="center"
            align="bottom"
          >
            <el-col :span="4">
              <span>Crm门店：</span>
            </el-col>
            <el-col :span="20">
              <el-input v-model="form.store" clearable class="input crmStore" autocomplete="on"></el-input>
            </el-col>
          </el-row>
          
          <el-row
            type="flex"
            :gutter="10"
            justify="center"
            align="bottom"
          >
            <el-col :span="4">
              <span>起止时间：</span>
            </el-col>
            <el-col :span="20">
              <date-select @click.native="sendDataPickerTitle('startAndEndDateSelect')"></date-select>
            </el-col>
          </el-row>
          
          <el-row
            type="flex"
            :gutter="10"
            justify="center"
            align="bottom"
          >
            <el-col :span="4">
              <span>进场撤场：</span>
            </el-col>
            <el-col :span="20">
              <date-select @click.native="sendDataPickerTitle('advanceAndWithDrawlDateSelect')"></date-select>
            </el-col>
          </el-row>
          
          <el-row type="flex"
                  :gutter="10"
                  justify="center"
                  align="bottom"
          >
            <el-col :span="4">
              <span>撤场地址：</span>
            </el-col>
            <el-col :span="6">
              <city-select @click.native="sendCitySelectTitle('changeWithDrawlCity')"></city-select>
            </el-col>
            <el-col :span="14">
              <el-input v-model="form.withDrawAddress" class="input" clearable autocomplete="off"
                        placeholder="详细地址">
              
              </el-input>
            </el-col>
          </el-row>
          
          <el-row
            type="flex"
            :gutter="10"
            justify="center"
            align="bottom"
          >
            <el-col :span="4">
              <span>发货时间：</span>
            </el-col>
            <el-col :span="20">
              <date-select @click.native="sendDataPickerTitle('deliveryDate')"></date-select>
            </el-col>
          </el-row>
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
          activeCity: [],
          withDrawlCity: [],
          activeAddress: '',
          withDrawAddress: '',
          store: '',
          startDate: '',
          endDate: '',
          advanceDate: '', /*进场时间*/
          withDrawlDate: '', /*撤场时间*/
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '80px'
      };
    },
    methods: {
      sendCitySelectTitle(val) {
        this.$store.state.citySelectTitle = val;
      },
      sendDataPickerTitle(val) {
        this.$store.state.dataPickerTitle = val;
      },
      next1() {
        //console.log('this.$store.state.startDate='+this.$store.state.startDate,' this.$store.state.endDate='+ this.$store.state.endDate);
        //console.log('this.$store.state.advanceDate='+this.$store.state.advanceDate,' this.$store.state.withDrawlDate='+ this.$store.state.withDrawlDate);
        this.form.activeCity = this.$store.state.activeCity;
        this.form.withDrawlCity = this.$store.state.withDrawCity;
        this.form.startDate = this.$store.state.startDate;
        this.form.endDate = this.$store.state.endDate;
        this.form.advanceDate = this.$store.state.advanceDate;
        this.form.withDrawlDate = this.$store.state.withDrawlDate;
        // console.log('this.form.activeCity='+this.form.activeCity,'this.form.withDrawlCity='+this.form.withDrawlCity);
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

<style scoped lang="stylus">
  /*@import '~@/assets/styles/varibles.styl'*/
  @import '~@/assets/styles/mixin.styl'
  #dialogWrapper >>> .el-input__inner
    inputNoBorder()
    height: 50px
    color red
  #dialogWrapper >>> .el-cascader__label
    line-height: 50px
    color red
  #dialogWrapper >>> .el-range-separator
    line-height: 43px
  #dialogWrapper >>> .el-range-input
    color red
  #dialogWrapper
    text-align left
    .activeName
      float: left;
    .activeNumber
      float: right
      span, .addressWrapper
        display inline-block
        height: 100%
        line-height: 60px
      .addressWrapper
        float: right
</style>
