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
  return sendRequest(params,'createChirp')
}
export function saveChirpSetting(params){
  return sendRequest(params,'saveChirpSetting')
}
export function joinChirp(params) {
  return sendRequest(params,'joinChirp')
}
export function deleteChirp(params){
  return sendRequest(params,'deleteChirp')
}
export function getChirpList(params) {
  return sendRequest(params,'getChirpList')
}

export function sendMessage(params) {
  return sendRequest(params,'sendMessage')
}
export function getHistoryMessage(params) {
  return sendRequest(params,'getHistoryMessage')
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
