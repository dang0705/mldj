// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'   /*vuex store*/
import './assets/styles/reset.css'
import fastClick from 'fastclick'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.config.productionTip = false;
fastClick.attach(document.body);
/* eslint-disable no-new */

new Vue({
  el: '#app',
  data:{
    Bus:new Vue()
  },
  router,
  store,
  components: {App},
  template: '<App/>',
  render:h=>h(App)
})
