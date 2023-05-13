import Vue from 'vue'
import router from '@/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  const token = Vue.ls.get(ACCESS_TOKEN)
  console.log(to.path)
  if(to.path === '/user/login'){
    if(token){
      next({name: "Dashboard"})
    }else{
      next()
    }
  }else{
    if(token){
      if(store.getters.addRouters.length === 0){
        await store.dispatch('set_router')
        let json = store.getters.addRouters
        router.addRoutes(json)
        let role_type = store.getters.roleType
        next({name: role_type==="admin"?"Dashboard":"Event" ,replace: true})
        // next({name: "Dashboard", replace: true})
      }else{
        next()
      }
    }else{
      next({
        path: "/user/login",
        query: {
          redirect: document.location.hash
        }
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
