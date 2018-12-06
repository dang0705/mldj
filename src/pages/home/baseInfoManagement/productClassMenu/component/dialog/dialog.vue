<template>
  <div class="dialogWrapper" @keyup.enter="onBlur">
    <el-dialog
      :visible.sync="isAlertShow"
      v-if="isAlertShow"
      :title="alertTitle"
      :close-on-click-modal='false'
      :before-close="handleClose"
      align="center"
      :width="width=editOrAdd==='a_dd'?'':'600px'"
    >
      <el-form
        label-width="150px"
        v-if="editOrAdd==='a_dd'"
      >
        <el-form-item prop="firstCatalogName" label="品类根目录名称：">
          <el-input v-model="firstCatalogName" clearable maxlength="12"></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        :data="formData"
        class="tree"
        v-else
        node-key="id"
        default-expand-all
        icon-class="el-icon-arrow-right"
        :expand-on-click-node="false"
        :indent=25

      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-form
          class="catalogList"
        >
          <el-form-item prop="catalog">
        <span
          class="catalog"
        >{{node.label}}</span>
            </el-form-item>
          </el-form>
        <span>
          <el-button
            type="text"
            size="mini"
            ref="add"
            @click="() => append(node,data)">
           增加子类
          </el-button>
          <!--   <el-button
			   type="text"
			   size="mini"
			   v-if="node.level>1"
			   @click="() => remove(node, data)">
			  删除子类
			 </el-button>-->
          <el-button
            type="text"
            size="mini"
            @click="() => reName(node, data)">
           重命名
          </el-button>
        </span>
      </span>
      </el-tree>
      <el-form v-show="isRenameShow"
               label-width="160px"
      >
        <el-form-item
          label="修改前的品类名："
        >
          <el-input :value="oldText" class="reName" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="修改后的品类名："
        >
          <el-input v-model="tempText"
                    @input="onInput"
                    class="reName"
                    ref="reName"
                    autofocus></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload" :disabled="isEmpty">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  
  let Msg = '';
  let id = 1000;
  
  export default {
    // inject:['reload'],
    name: "productClassMenu_dialog",
    
    props: {
      isAlertShow: {
        type: Boolean
      },
      editOrAdd: {
        type: String
      },
      editData: {
        type: Array
      }
    },
    data() {
      return {
        width: '',
        treeData: {},
        oldText: '',
        tempText: '',
        isRenameShow: false,
        isEmpty: false,
        firstCatalogName: '',
        nodeText: '',
        alertTitle: '',
        formData: []
        ,
        editFormData: {},
      }
    },
    watch: {
      'isAlertShow': function () {
        if ( this.isAlertShow === true ) {
          if ( this.editOrAdd === 'up_date' ) {
            this.isEmpty = false;
            console.log(this.editData);
            this.formData = this.editData;
            console.log(this.formData);
            this.alertTitle = '编辑品类目录';
            Msg = '编辑成功';
          } else {
            this.alertTitle = '新增品类目录';
            Msg = '增加成功';
          }
          // this.DogType = this.editOrAdd;
        }
      }
    },
    
    methods: {
      append(node, data) {
        console.log(this.$refs.add);
        console.log(node, data);
        const newChild = {id: 'new_' + id++, label: '新增子品类'};
        if ( !data.children ) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        const that = this;
        that.reName(node, data, 'append')
      },
      remove(node, data) {
        console.log(node, data);
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      handleClose(obj) {
        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
          // this.treeData
          this.$emit('closeAlert', 'n');
          this.isRenameShow = false
        } else {
          this.$emit('closeAlert');
          
        }
      },
      onInput(obj) {
        if ( obj === '' ) {
          this.$message.error('品类名称不能为空')
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
        
      }
      ,
      reName(node, data, append) {
        console.log(node, data);
        this.isRenameShow = true;
        if ( append ) {
          this.tempText = this.oldText = data.children[ data.children.length - 1 ].label;
          this.treeData = data.children[ 0 ];
        } else {
          this.tempText = this.oldText = data.label;
          this.treeData = data;
        }
        
        const that = this;
        setTimeout(function () {
          that.$refs.reName.focus()
        }, 300)
      }
      ,
      onBlur(obj) {
        console.log(obj);
        if ( !this.isEmpty ) {
          this.treeData.label = this.$refs.reName.currentValue;
          this.isRenameShow = false
        }
      },
      
      confirmUpload(obj) {
        this.onBlur();
        
        let that = this,
          postData = this.editOrAdd === 'up_date' ? JSON.stringify(that.formData[ 0 ]) : JSON.stringify({
            label: this.firstCatalogName,
            children: [],
          });
        console.log(JSON.stringify(that.formData[ 0 ]));
        that.$axios.post('/Home/ProductClassSave',
          {
            catalog: postData,
            DogType: this.editOrAdd
          })
          .then(data => {
            let res = data.data;
            if ( res.state == 1 ) {
              that.$message.success(Msg);
              that.handleClose(obj);
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
      
    }
    ,
    mounted() {
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  @import '~@/assets/styles/varibles.styl'
  
  .dialogWrapper >>> .catalogList
    height 40px
  
  .dialogWrapper >>> .el-tree-node__content
    height auto
  
  .dialogWrapper >>> .el-input__inner
    text-align left
  
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

