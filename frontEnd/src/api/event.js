import { axios } from '@/utils/request'

export function reqEvent(parameter) {
  return axios({
    url: '/event/list',
    method: 'get',
    params: parameter
  })
}

export function getEventDetail(parameter) {
  return axios({
    url: '/event/detail',
    method: 'get',
    params: parameter
  })
}

export function getEventChart(parameter) {
  return axios({
    url: '/event/chart',
    method: 'get',
    params: parameter
  })
}

export function deleteEvent(parameter) {
  return axios({
    url: '/event/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateEvent(parameter) {
  return axios({
    url: '/event/update',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function bindEvent(parameter) {
  return axios({
    url: '/event/bind',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function bindedUserIDList(parameter){
  return axios({
    url: '/event/bindedUserIDList',
    method: 'get',
    params: parameter
  })
}

export function updateJson(parameter) {
  return axios({
    url: '/event/update_json',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

