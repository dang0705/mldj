<template>
  <div id="player">
    <el-dialog
      :title="alertTitle"
      :visible.sync="isAlertShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="70%"
      align="center"
    >
      <tree-transfer
        ref="tree"
        placeholder="输入设备名称进行过滤"
        v-if="loadDateSuccess"
        :title="title"
        :from_data='allLabelList'
        :button_text="['推送设备','取消推送']"
        :to_data='toData'
        :defaultProps="{label:'label'}"
        @addBtn='add'
        @removeBtn='remove'
        :mode='mode'
        height='540px'
        filter
        openAll
        :renderContent="renderFunc"
      >
      </tree-transfer>
      <i v-show="!loadDateSuccess" class="el-icon-loading" style="font-size: 4rem;text-align: center"></i>
      <span slot="footer" class="dialog-footer" v-show="loadDateSuccess">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="check">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import treeTransfer from 'el-tree-transfer' // 引入
  const storage = window.localStorage;
  export default {
    name: "PlayerDialog",
    props: {
      isPlayerDialogShow: {
        type: Boolean
      },
      playListId: {
        default: 0
      },
      playListName: {
        type: String,
      }
    },
    components: {
      treeTransfer
    },
    data() {
      return {
        isShowAddress: false,
        alertTitle: '',
        title: [ '所有标签/设备', '已推送标签/设备' ],
        isAlertShow: false,
        allDeviceList: [],
        allLabelList: [],
        allLabelIdList: [],
        allLabeledDeviceIdList: [],
        deviceNameStr: '',
        deviceIdStr: '',
        pushedCount: 0,
        loadDateSuccess: false,
        mode: "transfer", // transfer addressList
        EmployeeCode: storage.getItem('userName'),
        toData: []
      }
    }
    ,
    methods: {
      getAllDeviceList() {
        const that = this;
        return that.$axios.post('/Equip/EmployeeDeviceListList', {
          PageIndex: 1,
          PageSize: 1000,
          DeviceName: '',
          EmployeeCode: that.EmployeeCode,
        })
      },
      getAllLabelList() {
        const that = this;
        return that.$axios.post('/Equip/EmployeeDeviceLableList', {
          PageIndex: 1,
          PageSize: 1000,
          DeviceName: '',
          EmployeeCode: that.EmployeeCode,
          Validity: 1
        })
      },
      
      /*获取所有设备以及标签*/
      getAllDvcAndLblList() {
        const that = this;
        if ( !that.allLabelList.length ) {
          that.allLabelIdList = [];
          that.$axios.all([ that.getAllDeviceList(), that.getAllLabelList() ])
            .then(that.$axios.spread((allDeviceList, allLabelList) => {
              let length;
              if ( allLabelList.data.state === 1 ) {
                that.allDeviceList = allDeviceList.data.Content.Rows;
                allLabelList = allLabelList.data.Content.Rows;
                length = allLabelList.length;
              } else {
                allDeviceList = allDeviceList.data.Content.Rows;
                length = allDeviceList.length;
                that.allLabelList.push({
                  id: '0',
                  pid: 0,
                  label: '未分组设备',
                  children: []
                });
                for ( var i = 0; i < length; i++ ) {
                  that.allLabelList[ 0 ].children.push({
                    id: '0' + '-' + allDeviceList[ i ].ID,
                    pid: '0',
                    label: allDeviceList[ i ].DeviceName,
                    address: allDeviceList[ i ].Address,
                    disabled: !allDeviceList[ i ].Validity
                  })
                }
                console.log(that.allLabelList);
                that.loadDateSuccess = true;
                return;
              }
              
              for ( var j = 0; j < length; j++ ) {
                that.allLabelList.push({
                  id: allLabelList[ j ].ID.toString(),
                  pid: allLabelList[ j ].ID,
                  label: allLabelList[ j ].LabelName,
                  children: []
                })
              }
              that.allLabelList.push({
                id: '0',
                pid: 0,
                label: '未分组设备',
                children: []
              });
              // console.log(that.allLabelList);
              for ( var i = 0; i < that.allLabelList.length; i++ ) {
                that.allLabelIdList.push(that.allLabelList[ i ].id)
              }
              // console.log(that.allLabelIdList);
              that.getLabeledDeviceList()
              
            }))
        }
      },
      /*设置过标签的设备划分至相应分组,未设置过标签的设备进入未分组*/
      getLabeledDeviceList() {
        const that = this;
        that.allLabeledDeviceIdList = [];
        let res, length = that.allLabelIdList.length, requestCount = 0;
        for ( var v = 0; v < that.allLabelIdList.length; v++ ) {
          that.$axios.post('/Equip/EmployeeDeviceMappingByLabelId', {
            ID: that.allLabelIdList[ v ]
          })
            .then(data => {
              res = data.data.Content;
              requestCount++;
              for ( var p = 0; p < res.length; p++ ) {
                that.allLabeledDeviceIdList.push(res[ p ].DevicelId);
              }
              // console.log(res);
              for ( var i = 0; i < that.allLabelList.length; i++ ) {
                for ( var k = 0; k < res.length; k++ ) {
                  if ( that.allLabelList[ i ].id == res[ k ].LabelId ) {
                    that.allLabelList[ i ].children.push({
                      id: that.allLabelList[ i ].id + '-' + res[ k ].DevicelId,
                      pid: that.allLabelList[ i ].id,
                      label: res[ k ].DeviceName,
                      address: res[ k ].Address,
                      disabled: !res[ k ].Validity
                    });
                  }
                }
              }
              
              // console.log(that.allLabeledDeviceIdList);
              if ( requestCount === length ) {
                for ( var j = 0; j < that.allDeviceList.length; j++ ) {
                  for ( var n = 0; n < that.allLabeledDeviceIdList.length; n++ ) {
                    if ( that.allLabeledDeviceIdList.indexOf(that.allDeviceList[ j ].ID.toString()) < 0 ) {
                      that.allLabelList[ that.allLabelList.length - 1 ].children.push({
                        id: '0' + '-' + that.allDeviceList[ j ].ID,
                        pid: '0',
                        label: that.allDeviceList[ j ].DeviceName,
                        address: that.allDeviceList[ j ].Address,
                        disabled: !that.allDeviceList[ j ].Validity
                      });
                    }
                    that.loadDateSuccess = true;
                    break
                  }
                }
              }
              for ( var v = 0; v < that.allLabelList.length; v++ ) {
                that.allLabelList[ v ].disabled = !that.allLabelList[ v ].children.length
              }
            })
        }
        
      },
      handleClose(obj) {
        if ( this.loadDateSuccess ) {
          this.toData = [];
          this.toData = this.allDeviceList = this.allLabelList = this.allLabelIdList = this.allLabeledDeviceIdList = [];
          if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
            this.$emit('closePlayerAlert', 'n');
          } else {
            this.$emit('closePlayerAlert');
          }
        }
        this.loadDateSuccess = false;
      }
      ,
      // 监听穿梭框组件添加
      add(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
        console.log(this.$refs.tree);
        let toDataLength = toData.length,
          that = this;
        console.log(toDataLength);
        that.deviceIdStr = that.deviceNameStr = '';
        /*        for ( var i = 0; i < toDataLength; i++ ) {
				  if ( !toData[ i ].children.length ) {
					toData.splice(i, 1);
					obj.halfNodes.splice(i, 1);
					i = i - 1;
					toDataLength = toDataLength - 1;
				  }
				}*/
        console.log("toData:", toData);
        for ( var l = 0; l < toData.length; l++ ) {
          if ( toData[l].children ) {
            for ( var k = 0; k < toData[ l ].children.length; k++ ) {
              that.deviceIdStr += toData[ l ].children[ k ].id.split('-')[ 1 ] + ',';
              that.deviceNameStr += toData[ l ].children[ k ].label + ','
            }
          }
          /*else {
            that.deviceIdStr += toData.children[ k ].id.split('-')[ 1 ] + ',';
            that.deviceNameStr += toData.children[ k ].label + ','
  
          }*/
          
        }
        
        that.deviceNameStr = that.deviceNameStr.substring(0, that.deviceNameStr.length - 1);
        that.deviceIdStr = that.deviceIdStr.substring(0, that.deviceIdStr.length - 1);
        console.log(that.deviceIdStr, that.deviceNameStr);
      }
      ,      // 监听穿梭框组件移除
      remove(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        
        console.log(this.deviceNameStr, this.deviceIdStr);
        const toDataLength = toData.length,
          that = this;
        that.deviceIdStr = that.deviceNameStr = '';
        for ( var i = 0; i < toDataLength; i++ ) {
          for ( var k = 0; k < toData[ i ].children.length; k++ ) {
            that.deviceIdStr += toData[ i ].children[ k ].id.split('-')[ 1 ] + ',';
            that.deviceNameStr += toData[ i ].children[ k ].label + ','
          }
        }
        that.deviceNameStr = that.deviceNameStr.substring(0, that.deviceNameStr.length - 1);
        that.deviceIdStr = that.deviceIdStr.substring(0, that.deviceIdStr.length - 1);
        console.log(that.deviceIdStr, that.deviceNameStr);
      }
      ,
      check(obj) {
        const that = this;
        console.log(that.deviceIdStr);
        if ( !that.deviceIdStr ) {
          that.$message.error('您尚未推送任何设备');
        } else {
          let MediaList = that.deviceIdStr.split(','),
            ObjList = {
              MediaList: MediaList,
              EmployeeCode: that.EmployeeCode,
              PlayListId: that.playListId.toString()
            };
          for ( var i = 0; i < MediaList.length; i++ ) {
            MediaList[ i ] = {mediaid: MediaList[ i ]}
          }
          console.log(MediaList);
          
          that.$axios.post('/PlayManage/CheckElookPlayListByMediaId', {
            MediaIdListString: that.deviceIdStr
          })
            .then(data => {
              const res = data.data.Content, length = res.length;
              if ( data.data.state == 1 ) {
                that.pushedCount = length;
                if ( that.pushedCount ) {
                  let deviceNameStr = '';
                  for ( var i = 0; i < length; i++ ) {
                    deviceNameStr += res[ i ].DeviceName + '、';
                  }
                  this.$confirm('设备重复：' + deviceNameStr.substring(0, deviceNameStr.length - 1) + ' 已有播放列表，是否覆盖？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                  })
                    .then(() => {
                      this.$axios.post('/PlayManage/ExecElookPlayListMediaAdd', {
                        PlayListMediaListString: JSON.stringify(ObjList)
                      })
                        .then(data => {
                          if ( data.data.state == 1 ) {
                            that.$message.success('推送成功');
                            that.handleClose(obj)
                            // that.$emit('closePlayerAlert');
                          }
                        })
                    })
                    .catch(() => {
                      that.$message.info('您已取消推送设备：' + deviceNameStr.substring(0, deviceNameStr.length - 1))
                    })
                } else {
                  this.$axios.post('/PlayManage/ExecElookPlayListMediaAdd', {
                    PlayListMediaListString: JSON.stringify(ObjList)
                  })
                    .then(data => {
                      if ( data.data.state == 1 ) {
                        that.$message.success('推送成功');
                        that.handleClose(obj)
                        // that.$emit('closePlayerAlert');
                      }
                    })
                }
              } else {
                that.$message.error(res.msg);
              }
            });
        }
      }
      ,
      renderFunc(h, option) {
        if ( option.node.level == 1 ) {
          if ( option.data.children.length ) {
            if ( option.data.id > 0 ) {
              return h(
                'div', {}, [
                  h('el-tag', {
                    class: 'labelName',
                    attrs: {
                      size: 'medium',
                      type: 'success'
                    }
                  }, option.data.label)
                ]
              )
            } else {
              return h(
                'div', {}, [
                  h('el-tag', {
                    class: 'labelName',
                    attrs: {
                      size: 'medium',
                      type: 'warning'
                    }
                  }, option.data.label)
                ]
              )
            }
          } else {
            return h(
              'div', {}, [
                h('el-tag', {
                  class: 'labelName',
                  attrs: {
                    size: 'medium',
                    type: 'info',
                    title: '可进入标签管理绑定设备'
                  }
                }, option.data.label + ' - 无设备的标签')
              ]
            )
          }
          
          
        } else {
          if ( !option.data.disabled ) {
            if ( option.data.address ) {
              return h(
                'ul', {class: 'device'}, [
                  h('li', {
                    class: 'deviceName',
                    attrs: {
                      title: '设备名称'
                    }
                  }, option.data.label),
                  h('li', {
                    class: 'deviceAddress',
                    
                  }, ' 设备地址：' + option.data.address)
                ]
              )
            } else {
              return h(
                'ul', {class: 'device'}, [
                  h('li', {
                    class: 'deviceName',
                    attrs: {
                      title: '设备名称'
                    }
                  }, option.data.label)
                ]
              )
            }
            
          } else {
            if ( option.data.address ) {
              return h(
                'ul', {class: 'deviceDisabled'}, [
                  h('li', {
                    class: 'deviceName',
                    attrs: {
                      title: '可以进入设备列表启用该设备',
                    }
                  }, '已停用 — ' + option.data.label),
                  h('li', {
                    class: 'deviceDisabled',
                    
                  }, ' 设备地址：' + option.data.address)
                ]
              )
            } else {
              return h(
                'ul', {class: 'deviceDisabled'}, [
                  h('li', {
                    class: 'deviceName',
                    attrs: {
                      title: '可以进入设备列表启用该设备',
                    }
                  }, '已停用 — ' + option.data.label)
                ]
              )
            }
            
          }
        }
        
      },
    },
    mounted() {
      // this.getAllDvcAndLblList();
    },
    watch: {
      'isPlayerDialogShow': function () {
        this.isAlertShow = this.isPlayerDialogShow;
        this.toData = [];
        if ( this.isAlertShow && !this.allLabeledDeviceIdList.length ) {
          console.log(this.playListId);
          
          this.getAllDvcAndLblList();
          this.alertTitle = this.playListName + ' - ' + '设备推送'
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  #player >>> .el-dialog
    width: 800px
  
  #player >>> .el-tree-node__content
    height auto
    
    ul
      width 100%
      margin-bottom: 10px
      border-bottom 1px solid #eee
      text-align left
      
      li
        overflow hidden;
        display inline-block
        height 18px;
        line-height: 20px
        textOverFlow()
    
    .deviceName
      width: 35%
      margin-right: 5%
    
    .deviceAddress
      width: 60%
      color #409eff
    
    .deviceDisabled
      color #ccc


</style>
