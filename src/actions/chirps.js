/*
 * @Author: your name
 * @Date: 2020-01-05 10:12:49
 * @LastEditTime: 2020-03-11 18:59:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\actions\chirps.js
 */
import {
  CHIRPS_INFO_PENDING, CHIRPS_INFO_FULFILLED, CHIRPS_INFO_REJECTED,
  CURRENT_CHIRP_PENDING, CURRENT_CHIRP_FULFILLED, CURRENT_CHIRP_REJECTED,
  SET_CHIRP_PENDING, SET_CHIRP_FULFILLED, SET_CHIRP_REJECTED,
  SEND_MSG_PENDING, SEND_MSG_FULFILLED, SEND_MSG_REJECTED,
  SEND_MSG_SUCCESS_PENDING, SEND_MSG_SUCCESS_FULFILLED, SEND_MSG_SUCCESS_REJECTED,
  DELETE_CHIRP_PENDING,  DELETE_CHIRP_FULFILLED,  DELETE_CHIRP_REJECTED,
  HISTORY_MESSAGE_PENDING,  HISTORY_MESSAGE_FULFILLED,  HISTORY_MESSAGE_REJECTED,

} from '@constants/actionTypes'
import cookies from '@utils/cookies'
import api from '@api'
import { message } from 'antd'

export function getChirpList() {
  return async (dispatch) => {
    dispatch({ type: CHIRPS_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 25,
        memberId: cookies.get('uid')
      }
      const {data} = await api.getChirpList(params)
      dispatch({ type: CHIRPS_INFO_FULFILLED, data })
      data.forEach(item => {
        dispatch(getHistoryMessage(item.id))
      })
    } catch (error) {

      dispatch({ type: CHIRPS_INFO_REJECTED, error })

    }
  }
}

export function getCurrentChirp(chirp) {
  return async (dispatch) =>{
    dispatch({ type: CURRENT_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: CURRENT_CHIRP_FULFILLED, chirp })
    }catch(error){
      dispatch({ type: CURRENT_CHIRP_REJECTED, error })
    }
  }
}

export function setChirpList(data) {
  return async (dispatch) =>{
    dispatch({ type: SET_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: SET_CHIRP_FULFILLED, data })
    }catch(error){
      dispatch({ type: SET_CHIRP_REJECTED, error })
    }
  }
}

export function sendMsg(msg){
  return async (dispatch) =>{
    dispatch({ type: SEND_MSG_PENDING, data: 'loading' })
    try{
      dispatch({ type: SEND_MSG_FULFILLED, msg })
    }catch(error){
      dispatch({ type: SEND_MSG_REJECTED, error })
    }
  }
}

export function sendMsgSuccess(data){
  return async (dispatch) =>{
    dispatch({ type: SEND_MSG_SUCCESS_PENDING, data: 'loading' })
    try{
      dispatch({ type: SEND_MSG_SUCCESS_FULFILLED, data })
    }catch(error){
      dispatch({ type: SEND_MSG_SUCCESS_REJECTED, error })
    }
  }
}

export function deleteChirp({ chirpId, msg }){
  message.warn(chirpId+msg)
  return {
    type: DELETE_CHIRP_FULFILLED,
    data: { chirpId, msg }
  }
}

export function getHistoryMessage(chirpId){
  return async (dispatch)=>{
    dispatch({ type: HISTORY_MESSAGE_PENDING })
    api.getHistoryMessage({ cmd: 31, chirpId  }).then(res=>{
      if(res.code == 10039){
        res.data.forEach(item=>{
          if(item.fileList){
            if( typeof item.fileList == 'object' ) return
            if(item.fileList[item.fileList.length-1] == ',') item.fileList = item.fileList.substr(0,item.fileList.length-1)
            item.fileList = JSON.parse(item.fileList)
            if(!(item.fileList instanceof Array)) item.fileList = [item.fileList]
          }
        })
        dispatch({ type: HISTORY_MESSAGE_FULFILLED, chirpId: res.chirpId, data: res.data  })
      }else{
        dispatch({ type: HISTORY_MESSAGE_REJECTED })
      }
    }).catch(error=>{
      console.log(error)
    })

  }
}
