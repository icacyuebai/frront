import { constantRouterMap } from '@/config/router.config'
import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import store from '@/store'
import router from '@/router'

// 404页面
const noFound = {
  path: '*', redirect: '/404', hidden: true
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    set_router({ commit }) {
      const userInfo = JSON.parse(window.localStorage.getItem("vuex")).user.info
      let role_type = userInfo.role_type
      // 根据roles权限生成可访问的路由表
      // 仅定义两个角色，管理员和用户
      let routers = []
      if (role_type === 'admin') {
        // 配置管理员的路由
        routers=[{
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            title: '用户列表',
            icon: 'HomeOutlined'
          },
          component: () => import("@/views/dashboard/index")
        },
          // ,{
        //   path: '要改1，取值就是页面的名字即可',
        //   name: '要改2'，取值就是页面的名字，首字母大写,
        //   meta: {
        //     title: 'A页面',
        //     icon: 'HomeOutlined'
        //   },
        //   component: () => import("@/views/页面的名字/index")
        // }
        {
          path: 'event',
          name: 'Event',
          meta: {
            title: '事件列表',
            icon: 'HomeOutlined'
          },
          component: () => import("@/views/event/index"),
          children: [
            {
              path: 'eventDetail',
              name: 'EventDetail',
              hidden: true,
              meta: {
                title: '事件详情',
              },
              component: () => import ('@/views/event/detail/index')
            }
          ]
        },
        {
          path: 'eventChart',
          name: 'EventChart',
          meta: {
            title: '事件统计图'
          },
          component: () => import('@/views/chart/index')
        },
        // {
        //   path: 'eventExtractiont',
        //   name: 'EventExtractiont',
        //   meta: {
        //     title: '事件抽取列表',
        //     icon: 'HomeOutlined'
        //   },
        //   component: () => import("@/views/eventExtraction/index")
        // }
        ]
      } else {
        // 配置普通用户的路由
        routers = [
          {
            path: 'event',
            name: 'Event',
            meta: {
              title: '事件列表',
              icon: 'HomeOutlined'
            },
            component: () => import("@/views/event/index"),
            children: [
              {
                path: 'eventDetail',
                name: 'EventDetail',
                hidden: true,
                meta: {
                  title: '事件详情',
                },
                component: () => import ('@/views/event/detail/index')
              }
            ]
          },
          // {
          //   path: 'eventExtractiont',
          //   name: 'EventExtractiont',
          //   meta: {
          //     title: '事件抽取列表',
          //     icon: 'HomeOutlined'
          //   },
          //   component: () => import("@/views/eventExtraction/index")
          // }
        ]
      }
      let json = [
        {
          path: '/',
          name: 'frame',
          component: BasicLayout,
          meta: {
            title: '底层frame'
          },
          redirect: '/frame/dashboard',
          children: routers
        }]
      json.push(noFound)
      commit('SET_ROUTERS', json)
    }
  }
}

export default permission
