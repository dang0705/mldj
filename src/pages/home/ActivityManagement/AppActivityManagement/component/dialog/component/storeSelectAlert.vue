<template>
  <div id="productSelectAlert">
    <el-dialog
      title="选择门店"
      :visible.sync="isStoreAlertShow"
      :before-close="handleClose"
    >
      <el-form
        ref="sourceSelect"
      >
        <el-form-item
        >
          <div class="filterComponents">
            <el-input
              class="activeName"
              v-model="formData.StoreName"
              placeholder="请输入门店名称"
              @keyup.enter.native="gitList(formData.StoreName,'keyWord')"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="gitList(formData.StoreName,'keyWord')"
              ></i>
            </el-input>
            <city-picker
              @provincesAndCities="gitList"
              :forSearch="true"
            ></city-picker>
            <el-select
              v-model="formData.channelID"
              @change="gitList"
              placeholder="所属渠道"
              clearable
            >
              <el-option
                v-for="(item,i) in channelList"
                :key="i"
                :label="item.ChannelName"
                :value="item.ID.toString()"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      
      <el-table width="100%"
                ref="stores"
                :data="storeList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :header-row-style="headerStyle"
                :row-style="rowStyle"
                v-loading="dataLoading"
                @select="handleProductSelect"
                @select-all="handleProductSelect"
      >
        <el-table-column label="单选"
                         width="80"
                         align="center"
        >
          <template slot-scope="scope">
            <el-radio class="radio" v-model="getStoreSelectedModel"
                      :label="scope.row.ID.toString()"
                      @change="select(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="门店名称"
          prop="StoreName"
          align="center"
          width="170"
          :show-overflow-tooltip="true"
        >
        
        </el-table-column>
        <el-table-column
          label="所在省市"
          align="center"
          width="130"
          :show-overflow-tooltip="true"
          :formatter="getCity"
        ></el-table-column>
        <el-table-column
          label="所属渠道"
          align="center"
          prop="ChannelName"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="storeList.length">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/component/common/pagination/pagination'
  import cityPicker from '@/component/common/citySelect/citySelect'
  
  const storage = window.localStorage;
  
  export default {
    name: "storeSelectAlert",
    components: {
      pagination,
      cityPicker
    },
    props: {
      isStoreAlertShow: {
        type: Boolean
      },
      selectedStoreList: {
        type: Array
      },
      isStoreSelected: {
        type: Boolean
      },
      storeSelectedModel: {
        type: String
      }
      
    },
    data() {
      return {
        catalogList: [],
        channelList: [],
        storeSelectList: [],
        storeList: [],
        getStoreSelectedModel: '',
        storeSelectedObj: {
          ID: ''
        },
        formData: {
          StoreName: '',
          channelID: '',
        },
        headerStyle: {
          height: '100%',
          textAlign: 'center',
          fontSize: '14px',
          color: '#000',
        },
        rowStyle: {
          height: '40px',
        },
        currentPage: 1, //初始页
        pageSize: 10,    //    每页的数据
        props: {
          label: 'label',
          value: 'id',
        },
        isListChange: false,
        dataLoading: true
      }
    },
    methods: {
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(currentPage);
        // console.log(this.currentPage)  //点击第几页
      }
      ,
      handleClose(obj) {
        /*        if ( obj.target && obj.target.innerText === '取 消' || !obj.target ) {
				  if ( !this.isStoreSelected ) {
					this.getStoreSelectedModel = '';
				  }else {
					this.$emit('sendRadioSelectedModel',this.getStoreSelectedModel)
				  }
				}*/
        this.$emit('closeStoreSelect');
        this.formData.storeName = '';
      }
      ,
      getCity(row) {
        
        return row.CityName ? row.ProvinceName + ' / ' + row.CityName : '---'
      },
      gitList(keyWord, name) {
        let that = this;
        console.log(keyWord);
        that.dataLoading = true;
        that.$axios.post('/Home/OnloadStorelList', {
          StoreName: name === 'keyWord' ? keyWord : '',
          CityCode: keyWord instanceof Array && keyWord.length ? keyWord[ 1 ] : '',
          ChannelCode: this.formData.channelID
        })
          .then(data => {
            console.log(data);
            if ( data.data.state == 1 ) {
              that.storeList = data.data.Content;
        
            }
            that.dataLoading = false;
            that.isListChange = true;
          })
        console.log(that.storeList);
        
      }
      ,
      select(val) {
        console.log(val);
        this.storeSelectedObj = JSON.parse(JSON.stringify(val));
        
      },
      handleProductSelect(val) {
        this.storeSelectList = val;
        console.log(this.storeSelectList);
        this.$emit('storeSelected', this.storeSelectList)
      }
      ,
      getChannelList() {
        if ( storage.getItem('channel') ) {
          this.channelList = JSON.parse(storage.getItem('channel'));
        } else {
          const that = this;
          this.$axios.post('/Home/OnloadChannelList').then(data => {
            if ( data.data.state === 1 ) {
              that.channelList = data.data.Content;
            }
          })
        }
      },
      confirmUpload(obj) {
        this.handleClose(obj);
        this.$emit('storeSelected', this.storeSelectedObj)
      }
    },
    watch: {
      'isStoreAlertShow': function () {
        if ( this.isStoreAlertShow ) {
          this.getStoreSelectedModel = this.storeSelectedModel;
          console.log(this.getStoreSelectedModel);
          // this.getStoreSelectedModel=this.storeSelectedModel;
          // console.log(this.getStoreSelectedModel);
          this.gitList()
        }
      }
    },
    mounted() {
      this.getStoreSelectedModel = this.storeSelectedModel;
      console.log(this.getStoreSelectedModel);
      
      this.getChannelList();
      
      // this.getProductClass()
    }
  }
</script>

<style scoped lang="stylus">
  #productSelectAlert >>> .el-dialog
    width: 600px
  
  #productSelectAlert >>> .el-radio__label
    display none
  
  #productSelectAlert
    .filterComponents
      width auto
      text-align center
      
      > div
        width 30% !important
        display inline-block

</style>
