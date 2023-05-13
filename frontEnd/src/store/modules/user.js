import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome, totree } from '@/utils/util'
import store from '@/store/'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    info: {},
    roleType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLE_TYPE: (state, role_type) => {
      state.roleType = role_type
    }
  },

  actions: {
    // 登录
    Login ({ commit, dispatch, getters }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.success) {
            Vue.ls.set(ACCESS_TOKEN, response.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', response.token)
            resolve(response)
          } else {
            reject(response)
          }
        }).then(_=>{
          // 获取用户信息
          dispatch('GetInfo')
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          commit('SET_ROLE_TYPE', result.role_type)
          commit('SET_INFO', result)
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          store.dispatch('set_router')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        Vue.ls.remove(ACCESS_TOKEN)
        commit('SET_ROLE_TYPE', '')
        commit('SET_INFO', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  },
}

export default user
