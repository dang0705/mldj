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
  mode: 'history',
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
          path: '/activityManagement',
          name: 'activityManagement',
          component: resolve => require([ '@/pages/home/businessManagement/activityManagement/activityManagement' ], resolve)
        },
        {
          path: '/InventoryManagement',
          name: 'InventoryManagement',
          component: resolve => require([ '@/pages/home/businessManagement/InventoryManagement/InventoryManagement' ], resolve)
        },
        {
          path: '/orderManagement',
          name: 'orderManagement',
          component: resolve => require([ '@/pages/home/businessManagement/orderManagement/orderManagement' ], resolve)
        },
        {
          path: '/operationsManagement',
          name: 'operationsManagement',
          component: resolve => require([ '@/pages/home/businessManagement/operationsManagement/operationsManagement' ], resolve)
        },
        {
          path: '/BrandManagement',
          name: 'BrandManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/BrandManagement/BrandManagement' ], resolve)
        },
        {
          path: '/ApkManagement',
          name: 'ApkManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/ApkManagement/ApkManagement'], resolve)
        },
        {
          path: '/SupplierManagement',
          name: 'SupplierManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/SupplierManagement/SupplierManagement'], resolve)
        },
        {
          path: '/channelManagement',
          name: 'channelManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/channelManagement/channelManagement' ], resolve)
        },
        {
          path: '/productManagement',
          name: 'productManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/productManagement/productManagement' ], resolve)
        },
        {
          path: '/warehouseManagement',
          name: 'warehouseManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/warehouseManagement/warehouseManagement' ], resolve)
        },
        {
          path: '/storeManagement',
          name: 'storeManagement',
          component: resolve => require([ '@/pages/home/baseInfoManagement/storeManagement/storeManagement' ], resolve)
        },
        {
          path: '/EquipManagement',
          name: 'EquipManagement',
          component: resolve => require([ '@/pages/home/deviceManagement/EquipManagement/EquipManagement'], resolve)
        },
        {
          path: '/LabelManagement',
          name: 'LabelManagement',
          component: resolve => require([ '@/pages/home/deviceManagement/LabelManagement/LabelManagement'], resolve)
        },
        {
          path: '/deviceVersionManagement',
          name: 'deviceVersionManagement',
          component: resolve => require([ '@/pages/home/deviceManagement/deviceVersionManagement/deviceVersionManagement' ], resolve)
        },
        {
          path: '/CompanyManagement',
          name: 'CompanyManagement',
          component: resolve => require([ '@/pages/home/systemManagement/CompanyManagement/CompanyManagement'], resolve)
        },
        {
          path: '/RoleManagement',
          name: 'RoleManagement',
          component: resolve => require([ '@/pages/home/systemManagement/RoleManagement/RoleManagement'], resolve)
        },
        {
          path: '/SourceManagement',
          name: 'SourceManagement',
          component: resolve => require([ '@/pages/home/playManagement/SourceManagement/SourceManagement'], resolve)
        },
        {
          path: '/PlayItemManagement',
          name: 'PlayItemManagement',
          component: resolve => require([ '@/pages/home/playManagement/PlayItemManagement/PlayItemManagement'], resolve)
        },
        {
          path: '/PlayListManagement',
          name: 'PlayListManagement',
          component: resolve => require([ '@/pages/home/playManagement/PlayListManagement/PlayListManagement'], resolve)
        },

        {
          path: '/personnelManagementPage',
          name: 'personnelManagementPage',
          component: resolve => require([ '@/pages/home/personnelManagement/personnelManagementPage/personnelManagementPage' ], resolve)
        },
        {
          path: '/roleManagement',
          name: 'roleManagement',
          component: resolve => require([ '@/pages/home/personnelManagement/roleManagement/roleManagement' ], resolve)
        }

      ]
    }

  ]
})
