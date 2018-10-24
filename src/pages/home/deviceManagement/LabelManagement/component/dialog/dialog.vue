<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
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
            autocomplete
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
      <el-table
        ref="select"
        :data="selectList"
        style="width: 400px;float: left;max-height: 350px;overflow: auto"
        @selection-change="handleSelectChange"
        v-show="this.editOrAdd==='up_date'"
      >
        <el-table-column
          label="待选设备"
          align="left"
          :render-header="renderHeader"
        >
          
          <el-table-column
            type="selection"
            prop='ID'
            width="30">
          </el-table-column>
          
          <el-table-column
            prop="DeviceName"
            label="设备名称"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Address"
            label="设备地址"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
      
      
      <el-table
        ref="selected"
        :data="selectedList"
        style="width: 400px;float: right;max-height: 350px;overflow: auto"
        v-if="this.editOrAdd==='up_date'"
      
      >
        <el-table-column
          label="已选设备"
          align="center"
        >
          <el-table-column
            width="100"
            label=""
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="small"
                         @click="deleteItem(scope.$index,scope.row)"></el-button>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="DeviceName"
            label="设备名称"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Address"
            label="设备地址"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="confirmUpload" class="confirmUpdate">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "LabelManagement_dialog",
    
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String
      },
      editData: {
        type: Object
      },
    },
    data() {
      return {
        list: [],
        selectList: [],
        provinceTotalArr: '',
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
        selectedArr: [],
        selectedList: [],
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
          that.formData.ID = that.editData.ID;
          this.getSelectList();
          if ( that.editOrAdd === 'up_date' ) {
            that.isAdd = false;
            that.formData.LabelName = that.editData.LabelName;
            that.formData.EmployeeCode = storage.getItem('userName');
            that.formData.EmployeeName = that.editData.EmployeeName;
            that.alertTitle = '编辑标签';
            that.provinceTotalArr = that.formData.ProvinceName + ' / ' + that.formData.CityName;
            /*       for ( var i = 0; i < length; i++ ) {
					 if ( that.formData.EmployeeName === that.list[ i ].label ) {
					   that.formData.AddEmployeeCode = that.list[ i ].value;
					   console.log(that.formData.AddEmployeeCode);
					   break;
					 }
				   }*/
            Msg = '编辑成功';
            that.formData.DogType = that.editOrAdd;
            
          }
          else {
            this.isAdd = true;
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增标签';
            this.provinceTotalArr = '省 / 市';
            Msg = '增加成功'
          }
        } else {
          that.selectList = [];
        }
      }
    },
    methods: {
      renderHeader:(h, params) => {
        return h('div', [
          h('el-input', {
            props: {
              type: 'alert'
            }
          }),
          h('strong', params.column.title)
        ]);
      },
      deleteItem(val, row) {
        console.log(val, row);
        this.selectedList.splice(val, 1);
        this.$refs.select.toggleRowSelection(this.selectedArr[val]);
        this.selectedArr.splice(val, 1);
        console.log(this.selectedArr);
      },
      getSelectList() {
        let that = this, selectedLength = '';
        if ( that.editOrAdd === 'up_date' ) {
          that.selectedArr=[];
          axios.post('api/HOME/EmployeeDeviceMappingByLabelId', {
            ID: that.formData.ID
          })
            .then(selectedData => {
              console.log(selectedData);
              const res = selectedData.data.Content;
              selectedLength = res.length;
              that.selectedList = res;
              axios.post('api/HOME/OnloadEmployeeDeviceList')
                .then(selectData => {
                  console.log(selectData);
                  const res = selectData.data.Content, selectLength = res.length;
                  if ( selectLength ) {
                    that.selectList = res;
                    for ( var i = 0; i < selectLength; i++ ) {
                      for ( var j = 0; j < selectedLength; j++ ) {
                        if ( that.selectList[ i ].ID === that.selectedList[ j ].ID ) {
                          console.log(i);
                          that.selectedArr.push(that.selectList[ i ])
                        }
                      }
                    }
                    console.log(that.selectedArr);
                    that.$nextTick(function () {
                      that.selectedArr.forEach(row => {
                        that.$refs.select.toggleRowSelection(row, true);
                      })
                    })
                  }
                })
            });
        }
        
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
        for ( var i = 0; i < that.selectedList.length; i++ ) {
          selectedIdStr += that.selectedList[ i ].ID + ','
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
        axios.post('/api/Home/DeviceLabelSave', data)
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
        axios.post('/api/HOME/OnloadEmployeeList', {
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
            console.log(that.list);
          });
        
      }
      ,
      handleSelectChange(val) {
        console.log(val);
        this.selectedList = val;
      }
      
    },
    mounted() {
      this.getUserList();
      
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .dialogWrapper >>> .el-select
    width: 100%
  
  .confirmUpdate
    position: absolute
    width: 20%
    left calc(50% - (20% / 2))
    bottom: 2%
  
  .dialogWrapper >>> .el-form
    .el-form-item
      display inline-block
      margin 0 40px 40px
  
  .dialogWrapper >>> .el-table::before
    height: 0
  
  .dialogWrapper >>> .el-dialog__body
    overflow hidden
  
  .dialogWrapper >>> .el-input__inner
    inputNoBorder()
  
  .dialogWrapper >>> .el-dialog
    width 900px
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
