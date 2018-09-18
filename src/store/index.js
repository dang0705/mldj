import Vue from 'vue'
import Vuex from 'vuex'
const storage=window.localStorage;
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    menuIndex:'personnelManagement'
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

    }
  }
})
