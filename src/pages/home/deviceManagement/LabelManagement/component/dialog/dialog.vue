<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :width="width"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      @closed="closed"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
      >
        <el-form-item prop="LabelName">
          <el-input
            v-model="formData.LabelName"
            clearable
            placeholder="标签名称"
            minlength="1"
            maxlength="10"></el-input>
        </el-form-item>
        
        <el-form-item prop="EmployeeCode">
          <el-select
            v-model="formData.EmployeeCode"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) of list"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-transfer
        style="text-align: left; display: inline-block"
        v-if="editOrAdd==='up_date'"
        v-model="selected"
        filterable
        filter-placeholder="请输入设备名称"
        :render-content="renderFunc"
        :titles="['待选设备名称', '已选设备名称']"
        :button-texts="['去除设备', '添加设备']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="selectList">
        <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
      </el-transfer>
      <el-button type="primary" @click="confirmUpload" class="confirmUpdate">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "LabelManagement_dialog",
    
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String,
        default: 'add'
      },
      editData: {
        type: Object
      },
    },
    data() {
      return {
        selectList: [],
        width: '30%',
        list: [],
        selected: [],
        keyWord: '',
        alertTitle: '',
        formData: {
          LabelName: '',
          DogType: "",
          EmployeeCode: '',
          EmployeeName: '',
          ID: ''
        }
        ,
        isAdd: false,
        editFormData: {},
        
        uploadRules: {
          LabelName: [
            {
              required: true,
              message: '标签名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ]
          , EmployeeName: [
            {
              required: true,
              message: '分配所有人为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ]
          
        }
      }
      
    },
    computed: {
      isClose: {
        get: function () {
          let clearImg = this.isAlertShow;
          return !clearImg
        },
        set: function () {
        
        }
      }
    },
    watch: {
      'isAlertShow': function () {
        const that = this;
        if ( that.isAlertShow ) {
          if ( that.editOrAdd === 'up_date' ) {
            that.getSelectList();
            that.width = '1220px';
            that.isAdd = false;
            that.formData.LabelName = that.editData.LabelName;
            that.formData.EmployeeCode = storage.getItem('userName');
            that.formData.EmployeeName = that.editData.EmployeeName;
            that.alertTitle = '编辑标签';
            Msg = '编辑成功';
            that.formData.DogType = that.editOrAdd;
          }
          else {
            that.width = '30%';
            this.isAdd = true;
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增标签';
            // this.provinceTotalArr = '省 / 市';
            Msg = '增加成功'
          }
        } else {
          that.keyWord = '';
          that.selected = [];
          
        }
      }
    },
    methods: {
      
      generateData() {
        const that = this;
        that.$axios.post('/HOME/OnloadEmployeeDeviceList')
          .then(data => {
            console.log(data);
            let res = data.data.Content, length = res.length;
            for ( let i = 0; i < length; i++ ) {
              that.selectList.push({
                key: res[ i ].ID,
                label: res[ i ].Validity ? res[ i ].DeviceName : res[ i ].DeviceName + '-已停用',
                disabled: !res[ i ].Validity,
                deviceAddress: res[ i ].Address
              });
            }
          });
      },
      renderFunc(h, option) {
        console.log(option);
        // return <p><span class='deviceName'>{option.label}</span><span class='deviceAddress'>{option.deviceAddress}</span></p>;
        if ( option.disabled ) {
          return h(
            'p', {}, [
              h('span', {
                class: 'deviceName',
                attrs: {
                  title: '可以进入设备列表启用该设备'
                }
              }, option.label),
              h('span', {
                class: 'deviceAddress',
                attrs: {
                  title: '设备地址'
                }
              }, option.deviceAddress)
            ]
          )
        } else {
          return h(
            'p', {}, [
              h('span', {
                class: 'deviceName',
                attrs: {
                  title: '设备名称'
                }
              }, option.label),
              h('span', {
                class: 'deviceAddress',
                attrs: {
                  title: '设备地址'
                }
              }, option.deviceAddress)
            ]
          )
          
        }
        
      },
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      
      getSelectList() {
        const that = this;
        that.selected = [];
        that.formData.ID = that.editData.ID;
        that.$axios.post('/HOME/EmployeeDeviceMappingByLabelId', {
          ID: that.formData.ID
        })
          .then(data => {
            const res = data.data.Content, length = res.length;
            for ( var i = 0; i < length; i++ ) {
              that.selected.push(res[ i ].ID)
            }
            console.log(that.selected);
          })
      }
      
      ,
      handleClose() {
        this.$emit('closeAlert');
      },
      closed() {
        this.$store.commit('clearUpload');
        this.$refs[ 'upload' ].resetFields();
        this.isClose = true;
      },
      confirmUpload() {
        const that = this;
        let selectedIdStr = '';
        for ( var i = 0; i < that.selected.length; i++ ) {
          selectedIdStr += that.selected[ i ] + ','
        }
        console.log(selectedIdStr);
        if ( that.formData.LabelName === '' ) {
          that.$message.error('标签名称不能为空');
          return
          
        } else if ( that.formData.EmployeeCode === '' ) {
          that.$message.error('设备所属人不能为空');
          return
        }
        if ( that.editOrAdd === 'up_date' ) {
          that.addOrEdit({
            DogType: 'LabelMapping',
            LabelMappingList: selectedIdStr,
            EmployeeCode: storage.getItem('userName'),
            ID: that.formData.ID
          })
        } else {
          that.addOrEdit({
            DogType: that.editOrAdd,
            LabelName: that.formData.LabelName,
            EmployeeCode: storage.getItem('userName'),
          })
        }
      },
      addOrEdit(data) {
        let that = this;
        that.$axios.post('/Home/DeviceLabelSave', data)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.pass = true;
              that.$emit('closeAlert');
              that.$store.commit('DeviceLabelUpdateData');
              that.$refs[ 'upload' ].resetFields();
            }
            else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      getUserList() {
        const CompanyID = storage.getItem('CompanyID'),
          that = this,
          RoleId = storage.getItem('RoleId');
        that.$axios.post('/HOME/OnloadEmployeeList', {
          CompanyID: CompanyID,
          RoleId: RoleId
        })
          .then(data => {
            // console.log(data);
            const res = data.data.Content,
              length = res.length;
            for ( var i = 0; i < length; i++ ) {
              that.list.push({
                label: res[ i ].EmployeeName,
                value: res[ i ].EmployeeCode
              })
            }
          });
      },
      rightChange(val) {
        console.log(val);
      }
    },
    
    mounted() {
      console.log(storage.getItem('RoleId'));
      this.getUserList();
      this.generateData();
      
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .dialogWrapper >>> .el-transfer-panel__body
    height auto
  
  .dialogWrapper >>> .el-transfer-panel__list.is-filterable, .dialogWrapper >>> .el-transfer-panel__list
    height: 350px
    overflow auto
  
  .dialogWrapper >>> .el-transfer-panel
    width: 400px
    vertical-align top
    height: 450px
  
  .dialogWrapper >>> .el-checkbox__label
    text-align center
    p
      border-bottom 1px solid #eee
      height: 30px;
    span
      display inline-block
      border-right 1px solid #eee
      line-height 30px
      overflow hidden
      textOverFlow()
    
    .deviceName
      width: 40%
    .deviceAddress
      width: 60%
  
  .confirmUpdate
    width: 20%
    margin-top: 1%
  
  .dialogWrapper >>> .el-form
    .el-form-item
      display inline-block
      margin 0 40px 40px
  
  .dialogWrapper >>> .el-dialog__body
    overflow hidden
  
  .dialogWrapper >>> .el-input__inner
    inputNoBorder()
  
  .dialogWrapper >>> .el-dialog
    text-align center
  
  .dialogWrapper >>> .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .dialogWrapper >>> .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .dialogWrapper >>> .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
