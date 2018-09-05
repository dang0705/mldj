import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import home from '@/pages/home/home'
import a from '@/pages/a/a'
import b from '@/pages/b/b'
import c from '@/pages/c/c'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children:[
        {
          path: '/a',
          name: 'a',
          component: a
        },
        {
          path: '/b',
          name: 'b',
          component: b
        },
        {
          path: '/c',
          name: 'c',
          component: c
        }
      ]
    }

  ]
})
