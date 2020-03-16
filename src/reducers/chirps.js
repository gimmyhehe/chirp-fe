/*
 * @Author: your name
 * @Date: 2020-01-05 10:06:54
 * @LastEditTime: 2020-03-16 10:02:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\reducers\chirps.js
 */
import * as actionTypes from '@constants/actionTypes'
import { chirps } from '@utils/storage'

export default (state = {
  chirpList: chirps.get('chirpList', []),
  currentChirp: chirps.get('currentChirp',null),
  allChirpsMessage: {},
  chirpsPhoto: {},
}, action) => {
  switch (action.type) {
    case actionTypes.CHIRPS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.CHIRPS_INFO_FULFILLED:{

      chirps.set('chirpList', action.data)
      let allChirpsMessage =state.allChirpsMessage
      let chirpsPhoto = state.chirpsPhoto
      action.data.forEach(element => {
        allChirpsMessage[element.id] = []
        chirpsPhoto[element.id] = []
      })
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        chirpList: action.data,
        allChirpsMessage,
        chirpsPhoto,
        loading: false
      }
    }
    case actionTypes.CHIRPS_INFO_REJECTED:
      chirps.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.CURRENT_CHIRP_PENDING:
      return {
        ...state,
        currentChirp:{},
        loading: true
      }
    case actionTypes.CURRENT_CHIRP_FULFILLED:
      chirps.set('currentChirp', action.chirp)
      return{
        ...state,
        currentChirp: action.chirp,
        loading: false
      }
    case actionTypes.CURRENT_CHIRP_REJECTED:
      chirps.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.SET_CHIRP_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.SET_CHIRP_FULFILLED:
    {
      let allChirpsMessage = state.allChirpsMessage
      allChirpsMessage[action.data.group_id].push(action.data)
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        allChirpsMessage: allChirpsMessage,
        loading: false
      }
    }
    case actionTypes.SET_CHIRP_REJECTED:
      chirps.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.SEND_MSG_PENDING:{
      return {
        ...state,
        loading: true
      }
    }
    case actionTypes.SEND_MSG_FULFILLED:{
      let allChirpsMessage = state.allChirpsMessage
      if(action.msg.type ==='msg'){
        allChirpsMessage[action.msg.chirpId][action.msg.index] = action.msg.data
      }else if(action.msg.type ==='img'){
        allChirpsMessage[action.msg.chirpId][action.msg.index] = action.msg.data
      }
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        allChirpsMessage: allChirpsMessage,
        loading: false
      }
    }
    case actionTypes.SEND_MSG_REJECTED:{
      chirps.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    case actionTypes.SEND_MSG_SUCCESS_PENDING:{
      return {
        ...state,
        loading: true
      }
    }
    case actionTypes.SEND_MSG_SUCCESS_FULFILLED:{
      let allChirpsMessage = state.allChirpsMessage
      let chirpsPhoto = state.chirpsPhoto
      if(action.data.type ==='msg'){
        allChirpsMessage[action.data.chirpId][action.data.index].sending = false
      }else if(action.data.type ==='img'){
        if(action.data.index!=null)  allChirpsMessage[action.data.chirpId][action.data.index].sending = false
        chirpsPhoto[state.currentChirp.id].push({url:action.data.imgUrl,selected: false})
      }
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        allChirpsMessage,
        chirpsPhoto,
        loading: false
      }
    }
    case actionTypes.SEND_MSG_SUCCESS_REJECTED:{
      chirps.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    default:
      return {
        ...state,
        loading: false
      }
  }
}
