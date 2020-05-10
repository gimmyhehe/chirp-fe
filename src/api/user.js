import requests from '@utils/requests'
import { sendRequest } from '@utils/websocket'

export function getUserInfo(params){
  return sendRequest(params, 18)
}
export function modifyUser(params) {
  return requests.post('/api/user/modify', params)
}
export function forgotPassword(params) {
  return requests.post('/api/user/forgetPwd', params)
}
export function resetPassword(params) {
  return requests.post('/api/user/reset', params)
}
export default {
  getUserInfo,
  modifyUser,
  forgotPassword,
  resetPassword
}
