import Vue from 'vue'
import Vuex from 'vuex'

const storage = window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuIndex: 'activityManagement',
    activeCity: [],
    withDrawCity: [],
    dataPickerTitle: '',
    citySelectTitle:'',
    startDate: '',
    endDate: '',
    advanceDate: '',
    withDrawlDate: ''
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },
  mutations: {
    changeMenu(state, menuIndex) {
      // console.log(menuIndex);
      storage.setItem('menuIndex', menuIndex);
      state.menuIndex = menuIndex
    },
    /*更改活动地点*/
    changeActiveCity(state, activeCity) {
      state.activeCity = activeCity;
    },
    /*更改撤场地点*/
    changeWithDrawlCity(state, withDrawCity) {
      state.withDrawCity = withDrawCity;
    },
    /*活动管理弹框开始结束日期选择*/
    startAndEndDateSelect(state, date) {
      state.startDate = date[ 0 ];
      state.endDate = date[ 1 ];
    },
    /*活动管理弹框进场撤场日期选择*/
    advanceAndWithDrawlDateSelect(state, date) {
      state.advanceDate = date[ 0 ];
      state.withDrawlDate = date[ 1 ];
    },

  }
})
