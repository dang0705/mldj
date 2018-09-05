import Home from './pages/login/login.vue'

const routers = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/',
      component: Home
  },
]
export default routers
