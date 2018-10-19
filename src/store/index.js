import Vue from 'vue'
import Vuex from 'vuex'

const storage = window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuIndex: '',
    activeCity: [],
    withDrawCity: [],
    dataPickerTitle: '',
    citySelectTitle: '',
    startDate: '',
    endDate: '',
    advanceDate: '',
    withDrawlDate: '',
    ProvinceAndCityCode:'',
    clearUpload: false,
    isBrandUpdateData: false,
    isApkUpdateData: false,
    isSupplierUpdateData:false,
    isWarehouseUpdateData:false,
    isChannelUpdateData:false,
    isStoreUpdateData:false,
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },
  mutations: {
    changeMenu(state, menuIndex) {
      state.menuIndex = menuIndex
    }
    ,
  /*  /!*更改活动地点*!/
    changeActiveCity(state, activeCity) {
      state.activeCity = activeCity;
    }
    ,
    /!*更改撤场地点*!/
    changeWithDrawlCity(state, withDrawCity) {
      state.withDrawCity = withDrawCity;
    }
    ,
    /!*活动管理弹框开始结束日期选择*!/
    startAndEndDateSelect(state, date) {
      state.startDate = date[ 0 ];
      state.endDate = date[ 1 ];
    }
    ,
    /!*活动管理弹框进场撤场日期选择*!/
    advanceAndWithDrawlDateSelect(state, date) {
      state.advanceDate = date[ 0 ];
      state.withDrawlDate = date[ 1 ];
    }
    ,*/
    clearUpload(state) {
      state.clearUpload = true;
    }
    /*增加后更新品牌列表*/
    ,
    BrandUpdateData(state) {
      state.isBrandUpdateData = true
    }
    ,
    ApkUpdateData(state) {
      state.isApkUpdateData = true
    },
    SupplierUpdateData(state) {
      state.isSupplierUpdateData = true
    },
    WarehouseUpdateData(state){
      state.isWarehouseUpdateData = true
    },
    ChannelUpdateData(state){
      state.isChannelUpdateData = true
    },
    StoreUpdateData(state){
      state.isStoreUpdateData = true
    },

  }
})
