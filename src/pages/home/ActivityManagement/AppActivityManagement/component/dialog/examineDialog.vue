<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      title="查看活动详情"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      width="900px"
    >
      <div class="baseInfo">
        <el-form
          ref="upload"
          :model="formData"
          label-width="120px"
          align="left"
        >
          <el-form-item label="活动名称：">
            <span>{{formData.ActivityName}}</span>
          </el-form-item>
          <el-form-item label="活动编号：">
            <span>{{formData.ActivityCode}}</span>
          </el-form-item>
          <el-form-item label="负责人：">
            <span>{{formData.EmployeeName}}</span>
          </el-form-item>
          <el-form-item label="时间：">
            <span>{{formData.OpenStartDate+' 至 '+formData.OpenEndDate}}</span>
          </el-form-item>
          <el-form-item label="门店：">
            <span>{{formData.StoreName}}</span>
          </el-form-item>
          <el-form-item label="地点：">
            <span>{{formData.ActivityAdd}}</span>
          </el-form-item>
          <el-form-item label="产品：">
            <ol>
              <li v-for="(item,index) in formData.ProductList">
                {{index+1+'.'}}
                <el-tag size="small" type="success">{{item.ProductName}}</el-tag>
                ×
                <el-tag>{{item.number}}</el-tag>
              </li>
            </ol>
          </el-form-item>
          <el-form-item label="售卖机：">
            <ol>
              <li v-for="(item,index) in formData.DeviceList">
                {{index+1+'.'}}
                <el-tag size="small" v-if="item.Validity">{{item.DeviceName}}</el-tag>
              </li>
            </ol>
          </el-form-item>
          <el-form-item label="简介：">
            <span>{{formData.ActivityDec}}</span>
          </el-form-item>
        
        </el-form>
      </div>
      <div class="step">
        <el-steps direction="vertical" class="stepContent" >
          <template
            v-for="(item,index) in stepList"
          >
          <el-step
                   v-for="(eitem,eindex) in stepList[index].SetpList"
                   :key="index"
          >
            <!--<el-input></el-input>-->
          </el-step>
          </template>
        </el-steps>
        <el-form
          class="stepContent"
          label-width="160px"
          align="left"
        >
          <template
            v-for="(item,index) in stepList"
          >
            <el-form-item
              v-for="(Eitem,Eindex) in stepList[index].SetpList"
              :label="Eitem.ActivityStepName+'：'"
              :key="index"
            >
              <span>{{Eitem.EmployeeName}}</span>
            
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭详情</el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
  
  let Msg = '';
  const storage = window.localStorage
  export default {
    // inject:['reload'],
    name: "examine_dialog",
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String
      },
      editData: {
        type: Object
      }
    },
    data() {
      return {
        list: [],
        labelName: '',
        stepList: [],
        userList: [],
        formData: {}
        ,
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          this.formData = this.editData;
          console.log(this.formData);
          this.getExamine()
        }
      }
    },
    
    methods: {
      
      handleClose(obj) {
        this.$emit('closeExamine');
      },
      getExamine(val) {
        const that = this;
        that.$axios.post('/Home/onloadActivityLog', {
          ActivityID: this.formData.ID
        }).then(data => {
          console.log(data);
          if ( data.data.state === 1 ) {
            that.stepList = data.data.Content
          }
        })
      },
    }
    ,
    mounted() {
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog__body
    overflow hidden
  
  .stepContent
    margin 0 30px
    display inline-block
    vertical-align text-top
    
    .el-step, .el-form-item
      height 40px
      line-height: 40px
      margin: 0
      
      .el-button
        float right
  
  .dialogWrapper >>> .el-step__title
    line-height inherit
  
  .baseInfo
    float left
    padding-right 50px
    border-right: 1px solid green
  
  .step
    float left
</style>
