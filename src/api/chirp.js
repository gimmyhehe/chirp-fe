/*
 * @Author: your name
 * @Date: 2019-12-29 12:01:50
 * @LastEditTime: 2020-02-18 22:09:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\api\chirp.js
 */
import requests from '@utils/requests'
import { sendRequest } from '@utils/websocket'

export function createChirp(params){
  return sendRequest(params)
}
export function joinChirp(params) {
  return sendRequest(params)
}
export function deleteChirp(params){
  return sendRequest(params)
}
export function getChirpList(params) {
  return sendRequest(params)
}

export function sendMessage(params,) {
  return sendRequest(params,'sendMessage')
}


export const upload = params => requests.post('/upload', params)

export default {
  createChirp,
  deleteChirp,
  sendMessage,
  getChirpList,
  joinChirp,
  upload
}
