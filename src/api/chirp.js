/*
 * @Author: your name
 * @Date: 2019-12-29 12:01:50
 * @LastEditTime : 2020-01-04 14:53:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\api\chirp.js
 */
import { sendRequest } from '@utils/websocket'

export function createChirp(params){
  return sendRequest(params)
}

export function getChirpList(params) {
  return sendRequest(params)
}

export function sendMessage(params) {
  return sendRequest(params)
}
export function joinChirp(params) {
  return sendRequest(params)
}

export default {
  createChirp,
  sendMessage,
  getChirpList,
  joinChirp,
}
