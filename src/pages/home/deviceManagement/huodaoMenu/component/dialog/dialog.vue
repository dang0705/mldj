<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      width="80%"
      :height="editOrAdd==='a_dd'?'':'300px'"
    >
      <div id="addCargoWayName" v-if="editOrAdd==='a_dd'">
        <div id="uploadCargoWayImg">
          <upload :isClose="isClose" @closeDialog="handleClose" @getBase64Url="getBase64Url"
                  :getUpLoadTitle="upLoadTitle"
                  :getUploadType="uploadType">
          
          </upload>
        </div>
        <el-form
          label-width="120px"
          class="form"
          :rules="uploadRules"
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
      
      <div id="editCargoWay" v-else>
        <el-form
          :model="formData"
          :rules="uploadRules"
          label-width="150px"
          inline
        >
          <el-form-item prop="EmployeeName" label="每层单元格数（Y）：">
            <el-input-number v-model="defaultColumn"
                             :min="1"
                             :max="15"
                             class="defaultColumn"
                             @change="tableChange"></el-input-number>
          </el-form-item>
          <el-form-item label="货道层数（X）：">
            <el-input-number v-model="defaultRows"
                             :min="1"
                             :max="15"
                             class="defaultRows"
                             @change="tableChange"></el-input-number>
          </el-form-item>
          <el-form-item label="产品规格：">
            <el-input-number v-model="productSize"
                             :min="5"
                             :max="50"
                             class="defaultRows"
                             @change="tableChange"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="creatCargoWay">生成新货道</el-button>
          </el-form-item>
        </el-form>
        <!-- <table width="300">
		   <thead id="TableHead" ref="TableHead">
		   <tr v-html="tableHeader"></tr>
		   </thead>
		   <tbody id="TableMain" ref="TableMain" v-html="tableMain">
		   </tbody>
		 </table>-->
        <div class="table">
          <div class="header">
            <span class="x">x/y</span>
            <el-tag size="small" type="info" class='headColumn'
                    v-for="(item,i) in DataColumnCount"
                    :key="i"
            >
              {{'y'+(i+1)}}
            </el-tag>
          </div>
          <div class="tableMain"
               v-for="(item,i) in DataRowCount">
            <div>
              <el-tag size="small" type="success" class="columnTitle">
                {{'x' + (i+1)}}
              </el-tag>
              <span v-for="(listItem,i) in tableDataList" v-if="listItem.CargoX===item">
                  <el-input class="input" type="text" v-model="listItem.CargoIndex"></el-input>
                </span>
            </div>
          </div>
        
        </div>
        <!--        <el-table
				  :data="tableDataList"
				  ref="tables"
				  :border="true"
				>
				  <el-table-column
					type="index"
					label="X/Y"
					:index="indexFormatter"
					width="50">
				  </el-table-column>
				  <template
					v-for="(item,i) in tableHeaderList"
				  >
					<el-table-column
					  width="120"
					  align="center"
					  :key="i"
					  :label="item"
					>
					  <template slot-scope="scope">
						<el-input ref="rowX" v-model="scope.row.CargoX"
								  @input="inputInfo(scope.$index,scope.row)"></el-input>
						<el-input @input="colInput(scope)"
								  v-model="scope.column.label.charAt(1)"></el-input>
					  </template>
					</el-table-column>
				  </template>
				</el-table>-->
      </div>
      <div slot="footer" class="dialog-footer">
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
      id: {}
    },
    data() {
      return {
        tableHeader: '',
        tableMain: '',
        tableTextArr: [],
        DataRowCount: [],
        DataColumnCount: [],
        tableDataList: [
          /*{CargoX: '1', CargoY: '1', CargoIndex: '11', CargoSize: '50mm*50mm'},
          {CargoX: '1', CargoY: '2', CargoIndex: '12', CargoSize: '50mm*50mm'},
          {CargoX: '1', CargoY: '3', CargoIndex: '13', CargoSize: '50mm*50mm'},
          {CargoX: '1', CargoY: '4', CargoIndex: '14', CargoSize: '50mm*50mm'},
          {CargoX: '1', CargoY: '5', CargoIndex: '15', CargoSize: '50mm*50mm'},
  
          {CargoX: '2', CargoY: '1', CargoIndex: '21', CargoSize: '50mm*50mm'},
          {CargoX: '2', CargoY: '2', CargoIndex: '22', CargoSize: '50mm*50mm'},
          {CargoX: '2', CargoY: '3', CargoIndex: '23', CargoSize: '50mm*50mm'},
          {CargoX: '2', CargoY: '4', CargoIndex: '24', CargoSize: '50mm*50mm'},
          {CargoX: '2', CargoY: '5', CargoIndex: '25', CargoSize: '50mm*50mm'},*/
          // {CargoX: '1', CargoY: '1', CargoIndex: '11', CargoSize: '50mm*50mm'},
          // {CargoX: '1', CargoY: '2', CargoIndex: '12', CargoSize: '50mm*50mm'},
          // {CargoX: '1', CargoY: '3', CargoIndex: '13', CargoSize: '50mm*50mm'},
          // {CargoX: '2', CargoY: '1', CargoIndex: '21', CargoSize: '50mm*50mm'},
          // {CargoX: '2', CargoY: '2', CargoIndex: '22', CargoSize: '50mm*50mm'},
          // {CargoX: '2', CargoY: '3', CargoIndex: '23', CargoSize: '50mm*50mm'},
          // {CargoX: '3', CargoY: '1', CargoIndex: '31', CargoSize: '60mm*60mm'},
          // {CargoX: '3', CargoY: '2', CargoIndex: '32', CargoSize: '60mm*60mm'},
          // {CargoX: '3', CargoY: '3', CargoIndex: '33', CargoSize: '60mm*60mm'},
          // {CargoX: '3', CargoY: '4', CargoIndex: '34', CargoSize: '60mm*60mm'},
          // {CargoX: '4', CargoY: '1', CargoIndex: '41', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '2', CargoIndex: '42', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '3', CargoIndex: '43', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '4', CargoIndex: '44', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '5', CargoIndex: '45', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '6', CargoIndex: '46', CargoSize: '50mm*50mm'},
          // {CargoX: '4', CargoY: '7', CargoIndex: '47', CargoSize: '50mm*50mm'},
          // {CargoX: '5', CargoY: '1', CargoIndex: '51', CargoSize: '60mm*60mm'},
          // {CargoX: '5', CargoY: '2', CargoIndex: '52', CargoSize: '60mm*60mm'},
          // {CargoX: '5', CargoY: '3', CargoIndex: '53', CargoSize: '60mm*60mm'}
        ],
        cargoWayName: '',
        upLoadTitle: '',
        uploadType: 'image/jpeg',
        defaultColumn: 5,
        defaultRows: 5,
        productSize: 50,
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
            this.formData.ID = this.ID;
            this.formData.DogType = this.editString;
            this.alertTitle = '编辑货道';
            this.tableOnload();
            /*
				  let tablesData = {
					CargoX: '',
					CargoY: '',
					CargoIndex: '',
					CargoSize: ''
				  };*/
            
            Msg = '编辑成功'
          } else {
            
            this.alertTitle = '新增货道';
            Msg = '增加成功'
          }
          this.formData.DogType = this.editOrAdd;
        } else {
        
        }
      }
    },
    methods: {
      creatCargoWay() {
        console.log(this.DataRowCount);
        const getMax = Math.max.apply(null, this.DataRowCount);
        console.log(this.defaultRows, this.defaultColumn);
        for ( var i = 1; i <= this.defaultRows; i++ ) {
          for ( var j = 1; j <= this.defaultColumn; j++ ) {
            this.tableDataList.push({
              CargoX: i + getMax + '', CargoY: j + '', CargoIndex: i + '' + j, CargoSize: this.productSize
            })
          }
        }
        this.tableOnload()
      },
      tableOnload() {
        this.DataRowCount = [];
        this.DataColumnCount = [];
        const that = this;
        // that.$axios.post('Home/CargoTypeListByCargoId', {
        //   ID: that.id
        // })
        //   .then(data => {
        //     console.log(data);
        //   })
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
        console.log(that.DataColumnCount);
        /* for ( var n = 0; n < that.DataRowCount.length; n++ ) {
		   that.tableMain += "<div><span class='columnTitle'>x" + (n + 1) + "</span>";
		   that.tableDataList.forEach(function (item, index, arr) {
			 if ( item.CargoX === that.DataRowCount[ n ] ) {
			   that.tableMain += "<span><input class='input' type='text' @input='onInput(" + item.CargoIndex + ")' value='" + item.CargoIndex + "'></span>"
			 }
		   });
		   that.tableMain += '</div>'
		 }*/
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
        this.$emit('closeAlert');
        this.editString = '';
        this.formData.ImgBase = '';
        this.tableDataList = [];
        this.defaultColumn = this.defaultRows = 5
      },
      confirmUpload(obj) {
        this.add(obj)
        console.log(this.tableDataList);
      },
      add(obj) {
        const that = this;
        if ( that.formData.CargoName === '' ) {
          that.$message.error('货道名称不能为空');
          return
        } else if ( that.formData.CargoCode === '' ) {
          that.$message.error('货道编号不能为空');
          return
        }
        that.$axios.post('/Home/CargoTypeSave', this.formData)
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj)
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
    text-align left
    border: 1px solid #000
    border-bottom none
    margin 0 auto
    display inline-block
    
    div
      border-bottom: 1px solid #000
    
    .header
      .x
        width: 50px
        color red
    
    .headColumn
      width: 100px
      color red
      margin 0 5px
    
    span
      display inline-block
      text-align center
    
    .columnTitle
      width: 50px
      color red
    
    .input
      width: 100px
      height: 30px
      border: none
      text-align center


</style>
