<template>
  <div id="rootConfig">
    <el-dialog
      :visible.sync="isRootAlertShow"
      title="配置权限"
      :close-on-click-modal='false'
      :before-close="handleClose"
    >
      <el-tree :data="menuList"
               :props="defaultProps"
               ref="tree"
               @check="handleNodeClick"
               show-checkbox
               node-key="subIndex"
               default-expand-all
               v-loading="treeLoading"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "rootConfig",
    props: {
      isRootAlertShow: {
        type: Boolean
      },
      configId: {
        default: 0
      },
      roleName: {
        type: String
      }
    },
    data() {
      return {
        menuList: [],
        isSplice: false,
        echoSelectedList: [],
        treeLoading: true,
        postNavList: [],
        defaultProps: {
          children: 'subNav',
          label: 'navName'
        }
      }
    },
    watch: {
      'isRootAlertShow': function () {
        console.log(this.configId);
        if ( this.isRootAlertShow ) {
          this.getSelected()
        }
      }
    },
    methods: {
      
      handleClose() {
        this.$emit('closeAlert');
        
        this.$refs.tree.setCheckedKeys([]);
      },
      handleNodeClick(val) {
        if ( this.postNavList.indexOf(this.$refs.tree.getHalfCheckedKeys()) < 0 ) {
          this.postNavList = [ {MenuCode: this.$refs.tree.getHalfCheckedKeys()[ 0 ]} ];
        }
        for ( var i = 0; i < this.$refs.tree.getCheckedKeys().length; i++ ) {
          this.postNavList.push({MenuCode: this.$refs.tree.getCheckedKeys()[ i ]})
        }
        console.log('this.postNavList=', this.postNavList);
        console.log(this.$refs.tree.getCheckedKeys());
        console.log(this.$refs.tree.getHalfCheckedKeys());
      }
      ,
      getSelected() {
        const that = this;
        that.treeLoading = true;
        that.echoSelectedList = [];
        that.postNavList = [];
        that.$axios.post('/RoleMenu/GetRoleMenuList', {
          rolecode: that.configId
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              const res = data.data.Content, length = res.length;
              for ( var i = 0; i < length; i++ ) {
                for ( var j = 0; j < res[ i ].children.length; j++ ) {
                  if ( res[ i ].children[ j ].checked ) {
                    that.postNavList.push({
                      MenuCode: res[ i ].children[ j ].id
                    });
                    if ( that.postNavList.indexOf(res[ i ].id) < 0 ) {
                      that.postNavList.push({
                        MenuCode: res[ i ].id
                      });
                    }
                    that.echoSelectedList.push(
                      res[ i ].children[ j ].id,
                    )
                  }
                }
              }
              
              console.log(that.postNavList);
              that.$refs.tree.setCheckedKeys(that.echoSelectedList);
              that.$refs.tree.defaultExpandAll = true;
              that.treeLoading = false;
              
              console.log(that.echoSelectedList);
            }
          })
      },
      
      confirm() {
        console.log(this.$refs.tree);
        const that = this;
        console.log(that.postNavList.length);
        const sendArr = that.postNavList.filter((item, index, arr) => {
          return item.MenuCode
        });
        console.log(sendArr);
        if ( that.postNavList.length === 1 ) {
          that.$message.error('您还未对 ' + that.roleName + ' 配置任何权限')
        } else {
          that.$axios.post('/RoleMenu/BindRoleMenu', {
            roleCode: that.configId,
            roleMenuList: sendArr
          })
            .then(data => {
              console.log(data);
              if ( data.data.state == 1 ) {
                that.$message.success('权限配置成功');
                that.$emit('closeAlert')
              } else {
                that.$message.error(data.data.msg);
              }
            })
        }
      }
    },
    mounted() {
      const storage = window.localStorage;
      if ( storage.getItem('menu') ) {
        this.menuList = JSON.parse(storage.getItem('menu'))
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
