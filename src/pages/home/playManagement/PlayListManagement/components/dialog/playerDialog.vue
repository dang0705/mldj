<template>
  <div id="player">
    <el-dialog
      title="标签/设备选择"
      :visible.sync="isAlertShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <tree-transfer
        :title="title"
        :from_data='fromData'
        :to_data='toData'
        :defaultProps="{label:'label'}"
        @addBtn='add'
        @removeBtn='remove'
        :mode='mode'
        height='540px'
        filter
      >
      </tree-transfer>
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
      }
    },
    components: {
      treeTransfer
    },
    data() {
      return {
        title: [ '待选标签/设备', '已选标签/设备' ],
        isAlertShow: false,
        allDeviceList: [],
        allLabelList: [],
        allLabelIdList: [],
        allLabeledDeviceIdList: [],
        unLabeledArr: [],
        mode: "transfer", // transfer addressList
        EmployeeCode: storage.getItem('userName'),
        fromData: [
          {
            id: "1",
            pid: 0,
            label: "一级 1",
            children: [
              {
                id: "3",
                pid: "1",
                label: "二级 1-1",
                children: []
              },
              {
                id: "2",
                pid: "1",
                label: "二级 1-2"
              }
            ]
          },
        ],
        toData: []
        
      }
    }
    ,
    methods: {
      getAllDeviceList() {
        const that = this;
        return that.$axios.post('/api/Equip/EmployeeDeviceListList', {
          PageIndex: 1,
          PageSize: 1000,
          DeviceName: '',
          EmployeeCode: that.EmployeeCode,
          Validity: 1
        })
      },
      getAllLabelList() {
        const that = this;
        return that.$axios.post('/api/Equip/EmployeeDeviceLableList', {
          PageIndex: 1,
          PageSize: 1000,
          DeviceName: '',
          EmployeeCode: that.EmployeeCode,
          Validity: 1
        })
      },
      
      getAllDvcAndLblList() {
        const that = this;
        that.$axios.all([ that.getAllDeviceList(), that.getAllLabelList() ])
          .then(that.$axios.spread((allDeviceList, allLabelList) => {
            console.log(allDeviceList, allLabelList);
            that.allDeviceList = allDeviceList.data.Content.Rows;
            that.allLabelList = allLabelList.data.Content.Rows;
            console.log(that.allLabelList);
            for ( var i = 0; i < that.allLabelList.length; i++ ) {
              that.allLabelIdList.push(that.allLabelList[ i ].ID)
            }
            console.log(that.allLabelIdList);
            that.getLabeledDeviceList()
          }))
      },
      getLabeledDeviceList() {
        const that = this;
        let res, length;
        for ( var j = 0; j < that.allLabelIdList.length; j++ ) {
          that.$axios.post('/api/Equip/EmployeeDeviceMappingByLabelId', {
            ID: that.allLabelIdList[ j ]
          })
            .then(data => {
              console.log(data);
              res = data.data.Content;
              length = res.length;
              for ( var i = 0; i < length; i++ ) {
                if ( res[ i ].Validity == 1 ) {
                  that.allLabeledDeviceIdList.push(res[ i ].DevicelId)
                }
              }
              that.allLabeledDeviceIdList = Array.from(new Set(that.allLabeledDeviceIdList));
              console.log(that.allLabeledDeviceIdList);
            })
        }
        
        
      },
      handleClose() {
        this.$emit('closePlayerAlert');
      }
      ,
      // 监听穿梭框组件添加
      add(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      },
      // 监听穿梭框组件移除
      remove(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      }
    },
    mounted() {
    },
    watch: {
      'isPlayerDialogShow': function () {
        this.isAlertShow = this.isPlayerDialogShow;
        if ( this.isAlertShow && !this.allLabeledDeviceIdList.length ) {
          this.getAllDvcAndLblList();
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  #player >>> .el-dialog
    width: 800px
</style>
