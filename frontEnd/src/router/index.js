import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import { UserLayout } from '@/layouts'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/user/login'
    },
    {
      path: '/user',
      component: UserLayout,
      redirect: '/user/login',
      hidden: true,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
        }
      ]
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
    }

  ]
})
export default router
