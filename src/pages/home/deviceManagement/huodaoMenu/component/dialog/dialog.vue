<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      :width="editOrAdd==='up_date'?'100%':''"
      max-width="100%"
      v-loading="dataLoading"
    >
      <div class="basInfo">
        <div class="uploadImg">
          <upload :isClose="isClose"
                  :imgUrl="formData.ImgBase "
                  @closeDialog="handleClose"
                  @getBase64Url="getBase64Url"
                  :getUpLoadTitle="upLoadTitle"
                  :getUploadType="uploadType">
          </upload>
        </div>
        <el-form
          label-width="120px"
          class="upImgForm"
          :rules="uploadRules"
          :model="formData"
        >
          <el-form-item
            prop="CargoName"
            label="货道名称："
          >
            <el-input v-model="formData.CargoName"
                      clearable
                      maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item prop="CargoCode" label="型号：">
            <el-input
              v-model="formData.CargoCode"
              clearable
              maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input
              v-model="formData.CargoDec"
              type="textarea"
              clearable
              maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </div>
      
      <div id="editCargoWay" v-if="editOrAdd==='up_date'">
        <el-form
          :model="formData"
          :rules="uploadRules"
          label-width="180px"
          align="left"
        >
          <el-form-item prop="EmployeeName" label="每层单元格数（Y）：">
            <el-input-number v-model="defaultColumn"
                             :min="1"
                             class="defaultColumn"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="货道层数（X）：">
            <el-input-number v-model="defaultRows"
                             :min="1"
                             class="defaultRows"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="产品尺寸（mm×mm）：">
            <el-input-number v-model="productSize1"
                             :min="5"
                             class="defaultRows"
                             size="small"
            ></el-input-number>
            ×
            <el-input-number v-model="productSize2"
                             :min="5"
                             class="defaultRows"
                             size="small"
            ></el-input-number>
          </el-form-item>
        </el-form>
      
      </div>
      <div class="table" v-if="DataColumnCount.length&&editOrAdd==='up_date'">
        <div class="header">
          <span class="x">x/y</span>
          <el-tag size="small" type="info" class='headColumn'
                  v-for="(item,i) in DataColumnCount"
                  :key="i"
          >
            {{'Y'+(i+1)}}
          </el-tag>
        </div>
        <div class="tableMain"
             v-for="(item,i) in DataRowCount">
          <div>
            <el-tag size="small" type="success" class="columnTitle">
              {{'X' + (i+1)}}
            </el-tag>
            <span v-for="(listItem,i) in tableDataList" v-if="listItem.CargoX===item">
                  <el-input class="input" type="text" v-model="listItem.CargoIndex"></el-input>
                </span>
          </div>
        </div>
      
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="creatCargoWay" v-if="editOrAdd==='up_date'">生成新货道</el-button>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import upload from '@/component/common/upload/uploadList'
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "cargoWay_dialog",
    components: {
      upload
    },
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String
      },
      sendDialogData: {
        type: Object
      }
    },
    data() {
      return {
        tableHeader: '',
        hasAjaxData: false,
        dataLoading: true,
        tableMain: '',
        tableTextArr: [],
        DataRowCount: [],
        DataColumnCount: [],
        tableDataList: [],
        cargoWayName: '',
        upLoadTitle: '',
        uploadType: 'image/jpeg,image/png',
        defaultColumn: 8,
        defaultRows: 5,
        productSize1: 50,
        productSize2: 50,
        alertTitle: '',
        formData: {
          CargoName: '',
          CargoCode: '',
          CargoDec: '',
          ImgBase: '',
          ID: ''
        }
        ,
        editFormData: {
          ImgBase: '',
        },
        uploadRules: {
          CargoName: [
            {
              required: true,
              message: '设备名称为必填项',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '长度请在1~10个字符',
              trigger: 'blur'
            }
          ]
          , CargoCode: [
            {
              required: true,
              message: '分配所有人编号为必填项',
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
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.formData = this.sendDialogData;
            this.formData.DogType = this.editString;
            this.alertTitle = '编辑货道';
            this.tableOnload();
            Msg = '编辑成功'
          } else {
            this.dataLoading=false
            this.alertTitle = '新增货道';
            Msg = '增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        } else {
          for ( var i in this.formData ) {
            this.formData[i]=''
          }
        }
      }
    },
    methods: {
      creatCargoWay() {
        let getMax;
        
        if ( this.DataRowCount.length ) {
          getMax = Math.max.apply(null, this.DataRowCount);
        } else {
          getMax = 0;
        }
        for ( var i = 1; i <= this.defaultRows; i++ ) {
          for ( var j = 1; j <= this.defaultColumn; j++ ) {
            this.tableDataList.push({
              CargoX: i + getMax + '',
              CargoY: j + '',
              CargoIndex: i + '' + j,
              CargoSize: this.productSize1.toString() + 'mm*' + this.productSize2.toString() + 'mm'
            })
          }
        }
        this.tableOnload()
      },
      tableOnload() {
        this.DataRowCount = [];
        this.DataColumnCount = [];
        
        const that = this;
        that.$axios.post('/Home/CargoTypeListByCargoId', {
          ID: that.formData.ID
        })
          .then(data => {
            // console.log(data);
            if ( data.data.state === 1 && !that.hasAjaxData ) {
              that.tableDataList = data.data.Content;
            }
            for ( var i = 0; i < that.tableDataList.length; i++ ) {
              if ( i === 0 ) {
                that.DataRowCount.push(that.tableDataList[ i ][ "CargoX" ]);
                that.DataColumnCount.push(that.tableDataList[ i ][ "CargoY" ]);
              } else {
                if ( that.DataRowCount.indexOf(that.tableDataList[ i ][ "CargoX" ]) < 0 ) {
                  that.DataRowCount.push(that.tableDataList[ i ][ "CargoX" ]);
                }
                if ( that.DataColumnCount.indexOf(that.tableDataList[ i ][ "CargoY" ]) < 0 ) {
                  that.DataColumnCount.push(that.tableDataList[ i ][ "CargoY" ]);
                }
              }
            }
            that.hasAjaxData = true;
            that.dataLoading = false;
            console.log(that.DataColumnCount);
          });
        
        
      },
      
      getBase64Url(url) {
        this.formData.ImgBase = url;
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeAlert', 'n')
        } else {
          this.$emit('closeAlert')
        }
        this.formData.ImgBase = '';
        
        this.hasAjaxData = false;
        this.dataLoading = true;
        this.tableDataList = [];
        this.defaultColumn = 8;
        this.defaultRows = 5
      },
      confirmUpload(obj) {
        this.add(obj);
        console.log(this.tableDataList);
      },
      add(obj) {
        console.log(this.formData);
        const that = this;
        if ( that.formData.CargoName === '' ) {
          that.$message.error('货道名称不能为空');
          return
        } else if ( that.formData.CargoCode === '' ) {
          that.$message.error('货道编号不能为空');
          return
        }
        if ( this.editOrAdd === 'up_date' ) {
          if ( !this.defaultRows ) {
            that.$message.error('货道层数不能为空');
            return;
          } else if ( !this.defaultColumn ) {
            that.$message.error('每层单元格不能为空');
            return;
          } else if ( !this.productSize1 || !this.productSize2 ) {
            that.$message.error('请完善产品长宽尺寸');
            return;
          }
          
        }
        console.log(that.tableDataList);
        let json = {
          CargoTypeList: that.tableDataList
        };
        that.$axios.post('/Home/CargoTypeSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj)
              if ( this.editOrAdd === 'up_date' ) {
                that.$axios.post('/Home/CargoTypeSave', {
                  DogType: 'CargoBind',
                  CargoId: that.formData.ID,
                  CargoTypeListString: JSON.stringify(json)
                })
                  .then(data => {
                    console.log(data);
                    if ( data.data.state == 1 ) {
                    } else {
                      that.$message.error(data.data.msg);
                    }
                  })
              }
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
        
      },
      edit() {
      },
      provincesAndCities(code) {
        this.formData.ProvinceCode = code[ 0 ];
        this.formData.CityCode = code[ 1 ]
        
      },
      
      onChange(val) {
        this.formData.CargoCode = val;
      }
    },
    mounted() {
    }
  }
</script>

<style scoped lang="stylus">
  
  .dialogWrapper >>> .el-form
    vertical-align text-top
  
  .dialogWrapper >>> .el-table .el-input
    width: 40%
  
  .dialogWrapper >>> .table
    margin 0 auto
    display inline-block
    text-align left
    
    div
    .header
      .x
        width: 50px
        color red
    
    .headColumn
      width: 60px
      color red
      margin 0 5px
    
    span
      display inline-block
      text-align center
    
    .columnTitle
      width: 50px
      color red
    
    .input
      width: 60px
      height: 30px
      border: none
      text-align center
      margin 0 5px
    
    input
      text-align center
      height: 30px

</style>
