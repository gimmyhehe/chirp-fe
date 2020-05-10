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
  return sendRequest(params, 22)
}
export function saveChirpSetting(params){
  return sendRequest(params, 28)
}
export function joinChirp(params) {
  return sendRequest(params, 24)
}
export function deleteChirp(params){
  return sendRequest(params, 30)
}
export function getChirpList(params) {
  return sendRequest(params, 26)
}

export function sendMessage(params) {
  return sendRequest(params, 12)
}
export function getHistoryMessage(params) {
  return sendRequest(params, 31)
}


export const upload = params => requests.post('/upload', params)

export default {
  createChirp,
  deleteChirp,
  sendMessage,
  getChirpList,
  joinChirp,
  upload,
  getHistoryMessage,
  saveChirpSetting
}
