<template>
  <div class="dialogWrapper">
    <el-dialog
      :visible.sync="isSSDialogShow"
      width="100%"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
    >
      <div id="screen" @click="handleScreenClick"></div>
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="selected"
        :props="{
          key: 'ID',
          label: 'ItemName'
        }"
        filterable
        filter-placeholder="请输入播放项名称"
        target-order="push"
        :render-content="renderFunc"
        :titles="['所有播放项名称', '已添加播放项名称']"
        :button-texts="['去除播放项', '添加播放项']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="selectList"
        v-loading="dataLoading"
      >
        <el-select slot="left-footer"
                   v-model="fileType"
                   @change="handleScreenClick"
        >
          <el-option
            v-for="(item,i) in typeList"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  
  
  let Msg = '';
  const storage = window.localStorage;
  export default {
    name: "LabelManagement_dialog",
    
    props: {
      isSSDialogShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String,
        default: 'add'
      },
      editData: {
        type: Object
      },
      playListId: {
        default: 0
      },
      playListName: {
        type: String,
      }
    },
    data() {
      return {
        screenClicked: false,
        isTitleCreated: false,
        dataLoading: true,
        allPmList: [],
        selectList: [],
        list: [],
        selected: [],
        typeList: [
          {label: '全部', value: ''},
          {label: '图片', value: 0},
          {label: '视频', value: 1},
        ],
        playItems: {},
        keyWord: '',
        alertTitle: '',
        fileType: '',
        formData: {
          EmployeeCode: storage.getItem('userName'),
          EmployeeName: '',
          roleId: storage.getItem('RoleID'),
          ID: ''
        }
        ,
        isAdd: false,
        editFormData: {},
      }
    },
    
    watch: {
      'isSSDialogShow': function () {
        const that = this;
        if ( that.isSSDialogShow ) {
          console.log(that.playListName);
          that.getSelectedList();
          that.handleScreenClick();
          that.alertTitle = that.playListName + ' - ' + '播放项设置'
        } else {
          that.keyWord = '';
          that.selected = [];
          
        }
      }
    },
    methods: {
      renderFunc(h, option) {
        // console.log(option);
        let fileType;
        if ( option.FileType === 0 ) {
          fileType = '图片'
        } else if ( option.FileType === 1 ) {
          fileType = '视频'
        } else {
          fileType = '游戏'
        }
        if ( option.disabled ) {
          return h(
            'p', {}, [
              h('span', {
                class: 'playItemName',
                attrs: {
                  title: '可以进入播放项列表启用该播放项'
                }
              }, '已停用 - ' + option.ItemName),
              h('span', {
                class: 'timeLong',
                attrs: {
                  title: '播放时长'
                }
              }, option.TimeLong),
              h('span', {
                class: 'fileType',
                attrs: {
                  title: '文件类型'
                }
              }, fileType),
              h('span', {
                class: 'DateCreated',
                attrs: {
                  title: '创建时间'
                }
              }, option.CreateTime),
            ]
          )
        } else {
          return h(
            'p', {}, [
              h('span', {
                class: 'playItemName',
                attrs: {
                  title: '播放项名称'
                }
              }, option.ItemName),
              h('span', {
                class: 'timeLong',
                attrs: {
                  title: '播放时长'
                }
              }, option.TimeLong),
              h('span', {
                class: 'fileType',
                attrs: {
                  title: '文件类型'
                }
              }, fileType),
              h('span', {
                class: 'DateCreated',
                attrs: {
                  title: '创建时间'
                }
              }, option.CreateTime),
            ]
          )
          
        }
        
      },
      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        this.playItems = {
          "AllPm": [],
          "TopPm": [],
          "ConPm": [],
          "DowLefPm": [],
          "DowRigPm": [],
          "PlayListId": this.playListId,
          "EmployeeCode": this.formData.EmployeeCode,
          "TotalTime": 0,
          "ItemCount": 0
        };
        value.forEach((vitem, vindex, varr) => {
          this.selectList.forEach((item,index,arr)=>{
            if ( vitem === item.ID ) {
              this.playItems.AllPm.push(item)
            }
          })
        });
        
  /*      for ( var i = 0; i < this.selectList.length; i++ ) {
          for ( var j = 0; j < value.length; j++ ) {
            if ( value[ j ] == this.selectList[ i ].ID ) {
              this.playItems.AllPm.push(this.selectList[ i ])
            }
          }
        }*/
        console.log(value);
        console.log(this.playItems.AllPm);
        
        for ( var k = 0; k < this.playItems.AllPm.length; k++ ) {
          this.playItems.TotalTime += parseInt(this.playItems.AllPm[ k ].TimeLong);
          this.playItems.ItemCount = this.playItems.AllPm.length
        }
        // console.log(this.selectList);
      },
      getSelectedList() {
        const that = this;
        that.$axios.post('/PlayManage/ExecElookPlayListById', {
          ID: that.playListId
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              const res = data.data.Content.AllPm,
                length = res.length;
              for ( var i = 0; i < length; i++ ) {
                that.selected.push(parseInt(res[ i ].ID))
              }
              this.dataLoading = false;
            }
          })
      },
      
      handleClose(obj) {
        this.dataLoading = true;
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          this.$emit('closeSSAlert', 'n')
        } else {
          this.$emit('closeSSAlert')
        }
      },
      confirmUpload(obj) {
        const that = this;
        console.log('that.playItems', that.playItems);
        console.log('JSON.stringify(that.playItems)', JSON.stringify(that.playItems));
        
        that.$axios.post('/PlayManage/ExecElookPlayListItemAdd', {
          PlayListItemListString: JSON.stringify(that.playItems)
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.$message.success('屏幕设置成功！');
              that.handleClose(obj);
            } else {
              that.$message.error(data.data.msg)
            }
          })
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
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      
      handleScreenClick() {
        const that = this;
        that.screenClicked = true;
        that.selectList = [];
        that.$axios.post('/PlayManage/EmployeePlayItemList', {
          PageSize: 10000,
          PageIndex: 1,
          PlayItemName: '',
          Validity: '',
          FileType: that.fileType,
          RoleId: that.formData.roleId,
          EmployeeCode: that.formData.EmployeeCode
        })
          .then(data => {
            console.log(data);
            if ( data.data.state === 1 ) {
              const res = data.data.Content.Rows,
                length = res.length;
              for ( var i = 0; i < length; i++ ) {
                that.selectList.push({
                  ID: res[ i ].ID,
                  ItemName: res[ i ].PlayItemName,
                  ItemUrl: res[ i ].PlayItemUrl,
                  TimeLong: res[ i ].Duration,
                  Navigation: res[ i ].Navigation,
                  CreateTime: res[ i ].DateCreated,
                  RuleId: res[ i ].RuleId,
                  SkinId: res[ i ].SkinId,
                  FileType: res[ i ].FileType,
                  disabled: !res[ i ].Validity
                })
              }
            }
            
            console.log(that.selectList);
            this.createTransferTitle()
          })
        // }
      }
      ,
      createTransferTitle() {
        if ( !this.isTitleCreated ) {
          const titleLeft = document.createElement('div'),
            titleRight = document.createElement('div'),
            transferBodyLeft = document.getElementsByClassName('el-checkbox-group')[ 0 ],
            transferBodyRight = document.getElementsByClassName('el-checkbox-group')[ 1 ];
          
          titleLeft.className = titleRight.className = 'title';
          titleLeft.style.background = titleRight.style.background = '#ccc';
          titleLeft.style.textAlign = titleRight.style.textAlign = 'center';
          titleLeft.innerHTML = titleRight.innerHTML = '<span style="width: 39px;display: inline-block;height: 100%"></span>' +
            '<span style="display: inline-block;width: 559px;height: 40px;line-height: 40px" ><span class="itemTitle" style="width: 35%;display: inline-block;">播放项名称</span>' +
            '<span class="timeTitle" style="width: 18%;display: inline-block">播放时长（秒）</span>' +
            '<span class="timeTitle" style="width: 17%;display: inline-block">文件类型</span>' +
            '<span class="dateTitle" style="width: 30%;display: inline-block">创建时间</span></span>';
          transferBodyLeft.parentNode.insertBefore(titleLeft, transferBodyLeft);
          transferBodyRight.parentNode.insertBefore(titleRight, transferBodyRight);
          this.isTitleCreated = true;
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  
  .dialogWrapper >>> .el-transfer-panel__list.is-filterable, .dialogWrapper >>> .el-transfer-panel__list
    height: 350px
    overflow auto
  
  .dialogWrapper >>> .el-transfer-panel
    width: 600px
    /*vertical-align top*/
    height: 450px
    .el-transfer-panel__filter
      width auto
      display inline-block
    .el-transfer-panel__footer
      border-top: 0
      width auto
      right:0
      left inherit
      top: 40px
      height: 55px
  .dialogWrapper >>> .el-checkbox__label
    text-align center
    
    p
      border-bottom 1px solid #eee
      height: 30px;
    
    span
      display inline-block
      line-height 30px
      overflow hidden
      textOverFlow()
    
    .playItemName
      width: 35%
    
    .timeLong
      width: 18%
    
    .fileType
      width: 17%
    
    .DateCreated
      width 30%
  
  #screen {
    margin 0 100px 0 0
    width 270px
    height 480px
    background #000
    display inline-block
    vertical-align bottom
  }
</style>
