import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// export const reqUserList = ()=>axios({url:'/user/list',method:'get'})
// export function reqUserList (parameter) {
//   return axios({
//     url: '/user/list',
//     method: 'get',
//     params: parameter
    
//   })
// }


    
// get 传页码
// 接口： /event/update_json
// POST
// {
//     "id": 10521,
//     "json": {
//     "data": [
//         {
//             "name": 2
//         }
//     ],
//     "links": [
//         {
//             "target": 1,
//             "source": 2
//         }
//     ]
// }
// }
// 返回结构：
// {
//     "code": 200,
//     "message": "绑定成功",
//     "result": {},
//     "success": true,
//     "timestamp": 1679649597812
// }
