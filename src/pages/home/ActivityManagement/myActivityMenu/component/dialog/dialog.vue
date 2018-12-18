<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
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
        <el-steps direction="vertical" class="stepContent">
          <el-step :title="'步骤'+(index+1)"
                   v-for="(item,index) in stepList.length"
                   :key="index"
          >
            <el-input></el-input>
          </el-step>
        
        </el-steps>
        <el-form
          class="stepContent"
          label-width="120px"
          align="left"
        >
          <el-form-item
            v-for="(item,index) in stepList"
            :label="item.ActivityStepName+'：'"
            :key="index"
          >
            <span>{{item.employName}}</span>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteStep(index)"
            ></el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="addStep">增加步骤</el-button>
        </div>
        <!--<el-input
          v-show="isStepAlertShow"
          v-model="labelName"
          clearable
          @blur="inputBlur"
        ></el-input>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">拒 绝</el-button>
        <el-button type="primary" @click="confirmUpload">通 过</el-button>
      </div>
    </el-dialog>
    <step-alert
      :isAlertShow.sync="isStepAlertShow"
      @closeAlert="closeAlert"
      @getEmployee="getEmployee"
    ></step-alert>
  </div>
</template>

<script>
  import stepAlert from './stepAlert/stepAlert'
  
  let Msg = '';
  const storage = window.localStorage
  export default {
    // inject:['reload'],
    name: "myActivity_dialog",
    components: {
      stepAlert
    },
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
        alertTitle: '',
        labelName: '',
        isStepAlertShow: false,
        stepList: [],
        userList: [],
        userSelect: '',
        formData: {}
        ,
        editFormData: {},
        
        // uploadRules: {
        //   ChannelCode: [
        //     {
        //       required: true,
        //       message: '渠道编号为必填项',
        //       trigger: 'blur'
        //     },
        //     {
        //       min: 1,
        //       max: 20,
        //       message: '长度请在1~20个字符',
        //       trigger: 'blur'
        //     }
        //   ],
        //   ActivityName: [
        //     {
        //       required: true,
        //       message: '渠道名称为必填项',
        //       trigger: 'blur'
        //     },
        //     {
        //       min: 1,
        //       max: 20,
        //       message: '长度请在1~20个字符',
        //       trigger: 'blur'
        //     }
        //   ]
        // }
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            console.log(this.formData);
            this.alertTitle = '活动审批';
            Msg = '编辑成功';
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增渠道';
            Msg = '增加成功';
          }
          this.formData.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      addStep() {
        this.isStepAlertShow = true
      },
      deleteStep(index) {
        this.stepList.splice(index, 1)
      },
      closeAlert() {
        this.isStepAlertShow = false;
      },
      handleClose(obj) {
        if ( obj.target && !obj.target.innerText || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else if ( obj.target.innerText === '拒 绝' ) {
          this.refuse()
        } else {
          this.$emit('closeAlert');
          
        }
      },
      getEmployee(val) {
        console.log(val);
        this.stepList.push(val);
        console.log(this.stepList);
      },
      /*      getAllEmployeeList() {
			  const that = this;
			  if ( storage.getItem('employeeList') ) {
				that.userList = JSON.parse(storage.getItem('employeeList'))
			  } else {
				that.$axios.post('/Account/GetEmployeeList')
				  .then(data => {
					if ( data.data.state === 1 ) {
					  that.userList = data.data.Content.DataList;
					}
				  })
				
			  }
			  console.log(that.userList);
			},*/
      refuse(){
        const that=this;
        that.$axios.post('/Home/ActivitySave',{
          dogtype:'check',
          type:'nope',
          ID:this.formData.ID
        }).then(data=>{
          console.log(data);
          if ( data.data.state === 1 ) {
            this.$emit('closeAlert');
          }
        })
      },
      confirmUpload(obj) {
        let that = this;
        that.$axios.post('/Home/ActivityStepSave', {tag: JSON.stringify(this.stepList), ActivityID: this.formData.ID})
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
    ,
    mounted() {
      // this.getAllEmployeeList()
    }
  }
</script>

<style scoped lang="stylus">
  .dialogWrapper >>> .el-dialog__body
    overflow hidden
  
  .stepContent
    margin 0 30px
    display inline-block
    
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
    float right
</style>
