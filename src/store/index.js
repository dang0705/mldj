import Vue from 'vue'
import Vuex from 'vuex'

const storage = window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList: [],
    organizationList: [],
    getAllLabelList: [],
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

  },
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
    getAllLabelList(state, getAllLabelList) {
      state.getAllLabelList = getAllLabelList
    },
    clearUpload(state) {
      state.clearUpload = true;
    }
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },

})
