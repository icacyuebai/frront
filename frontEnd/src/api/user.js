import { axios } from '@/utils/request'

export function reqUserList (parameter) {
    return axios({
      url: '/user/list',
      method: 'get',
      params: parameter
      
    })
  }

  export function userAdd (parameter) {
    return axios({
      url: '/user/add',
      method: 'post',
      data: parameter
    })
  }

  export function userUpdate (parameter) {
    return axios({
      url: '/user/update',
      method: 'post',
      data: parameter
    })
  }

  export function userDelete (parameter) {
    return axios({
      url: '/user/delete',
      method: 'post',
      data: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }