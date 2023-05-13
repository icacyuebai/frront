import { axios } from '@/utils/request'

export function reqEventExtraction(parameter) {
  return axios({
    url: '/eventCount/list',
    method: 'get',
    params: parameter
  })
}

export function deleteEventExtraction(parameter) {
  return axios({
    url: '/eventCount/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function passEventExtraction(data) {
  return axios({
    url: '/eventCount/pass',
    method: 'post',
    data: data
  })
}

export function updateEventCount(parameter) {
  return axios({
    url: '/eventCount/update',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}