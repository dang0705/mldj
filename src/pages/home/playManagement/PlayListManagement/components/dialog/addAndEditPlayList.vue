<template>
  <div id="playListAlert">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="playList"
        :model="formData"
        :rules="playListRules"
      >
        <el-form-item
          prop="PlayListName"
          label="播放列表名称："
          label-width="120px"
          align="left"
        >
          <el-input
            v-model="formData.PlayListName" clearable maxlength="10"
          ></el-input>
        </el-form-item>
        
        <el-form-item
          prop="PlayListStartDate"
          label="播放起止日期"
          label-width="120px"
          align="left"
        >
          <data-picker :selectedDate="selectedDate"
                       :isAlertShow="isAlertShow"
                       @getDate="getDate"
          ></data-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const storage = window.localStorage;
  import dataPicker from '@/component/common/dateSelect/dateSelect'
  
  export default {
    name: "addAndEditPlayList",
    components: {
      dataPicker
    },
    props: {
      isAddAndEditPlayListShow: {type: Boolean},
      dialogType: {type: String},
      editData: {type: Object}
    },
    data() {
      return {
        isAlertShow: false,
        alertTitle: '编辑播放列表',
        formData: {
          OperationType: 'up_date',
          PlayListStartDate: '',
          PlayListEndDate: '',
          PlayListName: '',
          PlayListType: 0,
          PlayListDefault: 0,
          EmployeeCode: storage.getItem('userName')
        },
        selectedDate: [],
        playListRules: {}
        
      }
    }
    ,
    methods: {
      handleClose() {
        this.$emit('closePlayListAlert');
        this.formData.serviceTime = [];
      }
      ,
      getDate(val) {
        this.formData.PlayListStartDate = val[ 0 ];
        this.formData.PlayListEndDate = val[ 1 ]
      }
      ,
      confirmUpload() {
        const that = this;
        that.$axios.post('/api/PlayManage/EmployeePlayListOperation', that.formData)
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              if ( that.formData.OperationType === 'up_date' ) {
                that.$message.success('编辑播放列表成功')
              } else {
                that.$message.success('新增播放列表成功')
              }
              that.$emit('closePlayListAlert')
              
            } else {
              that.$message.error(data.data.msg)
            }
          })
      }
    },
    watch: {
      'isAddAndEditPlayListShow': function () {
        this.isAlertShow = this.isAddAndEditPlayListShow;
        this.formData.OperationType = this.dialogType;
        if ( this.isAddAndEditPlayListShow ) {
          if ( this.formData.OperationType === 'up_date' ) {
            this.formData.PlayListName = this.editData.PlayListName;
            this.selectedDate = [ this.editData.PlayListStartDate, this.editData.PlayListEndDate ]
          } else {
            this.selectedDate = [];
            this.formData.PlayListName = ''
          }
        }
        console.log(this.formData.OperationType);
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
