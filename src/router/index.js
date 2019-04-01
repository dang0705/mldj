import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import home from '@/pages/home/home'
// import businessManagement from '@/pages/home/personnelManagement/personnelManagement'
// import deviceManagement from '@/pages/home/deviceManagement/deviceManagement'
// import businessManagement from '@/pages/home/businessManagement/businessManagement'
// import baseInfoManagement from '@/pages/home/baseInfoManagement/baseInfoManagement'


Vue.use(Router);

export default new Router({
  base: '/HomeWeb',
  // mode:'history',
  routes: [
    {
      path: '*/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: home,
      children: [

        {
          path: '/homePage',
          name: 'homePage',
          component: resolve => require([ '@/pages/home/homePage/homePage' ], resolve)
        },
        {
          path:'/SaleReport',
          name:'SaleReport',
          component:resolve=>require(['@/pages/home/TableCreate/SaleReport/SaleReport'],resolve)
        },
        {
          path:'/OrderReprot',
          name:'OrderReprot',
          component:resolve=>require(['@/pages/home/TableCreate/OrderReprot/OrderReprot'],resolve)
        },
        {
          path:'/ProductData',
          name:'ProductData',
          component:resolve=>require(['@/pages/home/TableCreate/ProductData/ProductData'],resolve)
        },
        {
          path: '/AppActivityManagement',
          name: 'AppActivityManagement',
          component: resolve => require([ '@/pages/home/ActivityManagement/AppActivityManagement/AppActivityManagement' ], resolve)
        },
        {
          path: '/myActivityMenu',
          name: 'myActivityMenu',
          component: resolve => require([ '@/pages/home/ActivityManagement/myActivityMenu/myActivityMenu' ], resolve)
        },
        {
          path: '/ActivityCheck',
          name: 'ActivityCheck',
          component: resolve => require([ '@/pages/home/ActivityManagement/ActivityCheck/ActivityCheck' ], resolve)
        },
        {
          path: '/BrandManagement',
          name: 'BrandManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/BrandManagement/BrandManagement' ], resolve)
        },
        {
          path: '/ApkManagement',
          name: 'ApkManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/ApkManagement/ApkManagement' ], resolve)
        },
        {
          path: '/CRMStoreMenu',
          name: 'CRMStoreMenu',
          component: resolve => require([ '@/pages/home/baseInfoManagement/CRMStoreMenu/CRMStoreMenu' ], resolve)
        },
        {
          path: '/channelManagement',
          name: 'channelManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/channelManagement/channelManagement' ], resolve)
        },

        {
          path: '/storeManagement',
          name: 'storeManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/storeManagement/storeManagement' ], resolve)
        },
        {
          path: '/productClassMenu',
          name: 'productClassMenu',
          component: resolve => require([ '@/pages/home/baseInfoManagement/productClassMenu/productClassMenu' ], resolve)
        },
        {
          path: '/productMenu',
          name: 'productMenu',
          component: resolve => require([ '@/pages/home/baseInfoManagement/productMenu/productMenu' ], resolve)
        },
        {
          path: '/EquipManagement',
          name: 'EquipManagement',
          component: resolve => require([ '@/pages/home/deviceManagement/EquipManagement/EquipManagement' ], resolve)
        },
        {
          path: '/payManagerMenu',
          name: 'payManagerMenu',
          component: resolve => require([ '@/pages/home/deviceManagement/payManagerMenu/payManagerMenu' ], resolve)
        },
        {
          path: '/LabelManagement',
          name: 'LabelManagement',
          component: resolve => require([ '@/pages/home/deviceManagement/LabelManagement/LabelManagement' ], resolve)
        },
        {
          path: '/huodaoMenu',
          name: 'huodaoMenu',
          component: resolve => require([ '@/pages/home/deviceManagement/huodaoMenu/huodaoMenu' ], resolve)
        },

        {
          path: '/EmployeeMenu',
          name: 'EmployeeMenu',
          component: resolve => require([ '@/pages/home/systemManagement/EmployeeMenu/EmployeeMenu' ], resolve)
        },

        {
          path: '/CompanyManagement',
          name: 'CompanyManagement',
          component: resolve => require([ '@/pages/home/systemManagement/CompanyManagement/CompanyManagement' ], resolve)
        },
        {
          path: '/RoleManagement',
          name: 'RoleManagement',
          component: resolve => require([ '@/pages/home/systemManagement/RoleManagement/RoleManagement' ], resolve)
        },
        {
          path: '/OrganizationManagement',
          name: 'OrganizationManagement',
          component: resolve => require([ '@/pages/home/systemManagement/OrganizationManagement/OrganizationManagement' ], resolve)
        },
        {
          path: '/SourceManagement',
          name: 'SourceManagement',
          component: resolve => require([ '@/pages/home/playManagement/SourceManagement/SourceManagement' ], resolve)
        },
        {
          path: '/PlayItemManagement',
          name: 'PlayItemManagement',
          component: resolve => require([ '@/pages/home/playManagement/PlayItemManagement/PlayItemManagement' ], resolve)
        },
        {
          path: '/PlayListManagement',
          name: 'PlayListManagement',
          component: resolve => require([ '@/pages/home/playManagement/PlayListManagement/PlayListManagement' ], resolve)
        }


      ]
    }

  ]
})
