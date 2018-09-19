import Vue from 'vue'
import Vuex from 'vuex'
const storage=window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    menuIndex:'personnelManagement',
    city:[],
    pickerTitle:'',
    startDate:'',
    endDate:'',
    advanceDate:'',
    withDrawlDate:''
  },
  // actions:{
  //   changeMenu (ctx,menuIndex){
  //     ctx.commit('changeMenu',menuIndex)
  //   }
  // },
  mutations:{
    changeMenu (state,menuIndex) {
      // console.log(menuIndex);
      storage.setItem('menuIndex',menuIndex);
      state.menuIndex=menuIndex
    },
    changeCity (state,city) {
      // console.log(menuIndex);
      // storage.setItem('city',city);
      state.city=city;
    },
    /*活动管理弹框开始结束日期选择*/
    startAndEndDateSelect (state,date) {
      state.startDate=date[0];
      state.startDate=date[1];
    },
    /*活动管理弹框进场撤场日期选择*/
    advanceAndWithDrawlDateSelect (state,date) {
      state.advanceDate=date[0];
      state.advanceDate=date[1];
    },

  }
})
