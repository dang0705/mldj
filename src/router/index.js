import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import home from '@/pages/home/home'


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
      component: resolve => require([ '@/pages/home/home' ], resolve),
      children: [
        {
          path: 'a',
          component: resolve => require([ '@/pages/home/a/a' ], resolve)
        },
        {
          path: 'b',
          component: resolve => require([ '@/pages/home/b/b' ], resolve)

        },
        {
          path: 'c',
          component: resolve => require([ '@/pages/home/c/c' ], resolve)
        },
        {
          path: 'd',
          component: resolve => require([ '@/pages/home/d/d' ], resolve)
        }
      ]
    }

  ]
})
