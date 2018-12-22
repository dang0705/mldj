<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
    >
      <el-form
        ref="upload"
        :model="formData"
        :rules="uploadRules"
      >
        <el-form-item
          prop="FileName"
          label="播放素材："
          label-width="120px"
          align="left"
        >
          <p v-show="formData.FileId" class="fileName">{{formData.FileName}}</p>
          <el-button type="primary" size="large" @click="selectSource" class="selectSource">选择素材
          </el-button>
        </el-form-item>
        <el-form-item
          prop="PlayItemName"
          label="播放项名称："
          label-width="120px"
        >
          <el-input v-model="formData.PlayItemName" clearable minlength="1" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item
          prop="Duration"
          label="播放时长："
          label-width="120px"
        >
          <el-input v-model="formData.Duration" maxlength="5">
            <i
              slot="suffix"
            >秒
            </i>
          </el-input>
        </el-form-item>
        <el-form-item
          label="素材时长："
          label-width="120px"
          v-if="formData.FileName!=='上传素材'"
          align="left"
        >
          <span>
            {{formData.TimeLong}}
            <i slot="suffix">秒</i>
          </span>
        </el-form-item>
        <el-form-item
          label="素材类型："
          label-width="120px"
          v-if="formData.sourceType"
          align="left"
        >
          <span>
            {{formData.sourceType}}
          </span>
        </el-form-item>
        
        <el-form-item
          prop="Navigation"
          label="跳转路径："
          label-width="120px"
          v-if="formData.Navigation"
        >
          <el-input v-model="formData.Navigation"
                    clearable
                    minlength="1"
          ></el-input>
        </el-form-item>
      
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
    <sourcelist-dialog
      :isSourceListShow.sync="sourceListShow"
      @closeThis="closeThis"
      :OperationType="formData.OperationType"
      @selectedSource="selectedSource"
      :sendFileId="formData.FileId"
    ></sourcelist-dialog>
  </div>
</template>

<script>
  import sourcelistDialog from './sourceListDialog/sourceListDialog'
  
  export default {
    name: "playItemManagement_dialog",
    components: {
      sourcelistDialog
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
        sourceDuration: '',
        hasRedirectUrl: false,
        sourceListShow: false,
        alertTitle: '',
        uploadType: '',
        formData: {
          FileName: '上传素材',
          FileType: '',
          PlayItemName: '',
          Duration: '',//播放时长
          TimeLong: '',//素材时长
          OperationType: "up_date",
          FileId: '',
          EmployeeCode: '',
          Navigation: '',
          sourceType: ''
        }
        ,
        editFormData: {},
        uploadRules: {
          FileName: [
            {
              required: true,
              message: '播放素材必须上传',
              trigger: 'blur'
            }
          ],
          PlayItemName: [
            {
              required: true,
              message: '播放项名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度请在1~20个字符',
              trigger: 'blur'
            }
          ],
          Duration: [
            {
              required: true,
              message: '播放时长为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 5,
              message: '长度请在1~5个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.editData;
            // this.formData.ID = this.editData.ID;
            this.alertTitle = '编辑播放项'
          } else {
            for ( var i in  this.formData ) {
              this.formData[ i ] = ''
            }
            this.alertTitle = '新增播放项';
            this.formData.FileName = '上传素材'
          }
        }
        this.formData.OperationType = this.editOrAdd;
      }
    },
    
    methods: {
      selectedSource(val) {
        this.formData.FileName = val.FileName;
        this.formData.FileId = val.FileId;
        this.formData.FileType = val.FileType;
        this.formData.OperationType = val.dialogType;
        this.formData.TimeLong = val.TimeLong;
        this.formData.Duration = val.TimeLong > 0 ? val.TimeLong : '';
        this.formData.sourceType = val.sourceType;
        this.formData.PlayItemName = val.FileName.replace(/\.(mp4|jpg|png|apk|jpeg)$/gi, "");
        this.formData.FileUrl = val.FileUrl;
        this.formData.EmployeeCode = val.EmployeeCode;
        console.log(this.formData);
      },
      closeThis() {
        this.sourceListShow = false
      },
      selectSource() {
        this.sourceListShow = true;
      },
      
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n');
        } else {
          this.$emit('closeAlert');
        }
      },
  /*    closed() {
        this.$refs[ 'upload' ].resetFields();
      },*/

      confirmUpload(obj) {
        let that = this;
        if ( that.formData.FileId === '' ) {
          that.$message.error('播放素材不能为空');
          return
        }
        else if ( that.formData.PlayItemName === '' ) {
          that.$message.error('播放项名称不能为空');
          return
        } else if ( that.formData.Duration === '' ) {
          that.$message.error('播放时长不能为空');
          return
        }
        
        let params = '';
        for ( var i in this.formData ) {
          params += '&' + i + '=' + this.formData[ i ];
        }
        console.log(params);
        that.$axios.post('/PlayManage/EmployeePlayItemOperation', params)
          .then(data => {
            // console.log(data);
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success("上传成功");
              that.handleClose(obj)
            } else {
              that.$message.error(res.msg)
            }
            // that.reload()
            // that.isClose=false
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
    ,
    mounted() {
      console.log(this.formData.FileName);
    }
    
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .fileName {
    max-width: 100%;
    textOverFlow()
  }
</style>
