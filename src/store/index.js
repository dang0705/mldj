import Vue from 'vue'
import Vuex from 'vuex'

const storage = window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList: [],
    treeChanged:false,
    organizationList: [],
    getAllLabelList: [],
    menuIndex: '',
    clearUpload: false,
    catalog:[],
    brand:[],

  },
  mutations: {
    treeChanged(state,bol){
      state.treeChanged=bol;
    },
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
    },
    catalog(state, catalog) {
      state.catalog = catalog
    },
    brand(state, brand) {
      state.brand = brand
    },
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },

})
