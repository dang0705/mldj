import Vue from 'vue'
import Vuex from 'vuex'

const storage = window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList: [],
    organizationList: [],
    getAllLabelList:[],
    menuIndex: '',
    activeCity: [],
    withDrawCity: [],
    dataPickerTitle: '',
    citySelectTitle: '',
    startDate: '',
    endDate: '',
    advanceDate: '',
    withDrawlDate: '',
    ProvinceAndCityCode: '',
    clearUpload: false,
    isBrandUpdateData: false,
    isApkUpdateData: false,
    isSupplierUpdateData: false,
    isWarehouseUpdateData: false,
    isChannelUpdateData: false,
    isStoreUpdateData: false,
    isEmployeeDeviceUpdateData: false,
    isDeviceLabelUpdateData: false,
    isCompanyUpdateData: false,
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },
  mutations: {
    updateMenuList(state, menuList) {
      state.menuList = menuList;
    },
    changeMenu(state, menuIndex) {
      state.menuIndex = menuIndex
    }
    ,
    sendOrganizationList(state, organizationList) {
      state.organizationList = organizationList
    },
    getAllLabelList(state,getAllLabelList){
      state.getAllLabelList=getAllLabelList
    },
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
    WarehouseUpdateData(state) {
      state.isWarehouseUpdateData = true
    },
    ChannelUpdateData(state) {
      state.isChannelUpdateData = true
    },
    StoreUpdateData(state) {
      state.isStoreUpdateData = true
    },
    EmployeeDeviceUpdateData(state) {
      state.isEmployeeDeviceUpdateData = true
    },
    DeviceLabelUpdateData(state) {
      state.isDeviceLabelUpdateData = true
    },
    CompanyUpdateData(state) {
      state.isCompanyUpdateData = true
    },

  }
})
