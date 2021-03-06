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
import myFunctions from './assets/js/common'
import axios from 'axios'

Vue.prototype.$axios = axios;
Vue.prototype.$myFunctions = myFunctions;

Vue.use(ElementUI);
Vue.config.productionTip = false;
fastClick.attach(document.body);
/* eslint-disable no-new */

let app=new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  render: h => h(App)
});


function timeOut() {
  setTimeout(checkSession, 10 * 1000 * 60);
}
function checkSession() {
  axios.post('/Home/checkSession').then(data => {
    console.log(data);
    if ( data.data.state === 3 ) {
      app.$router.push('/')
    } else {
      timeOut()
    }
  });
}
checkSession();

