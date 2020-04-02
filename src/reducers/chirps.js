import * as actionTypes from '@constants/actionTypes'
import { chirps } from '@utils/storage'
import { message } from 'antd'
export default (state = {
  chirpList: [],
  currentChirp: chirps.get('currentChirp', null),
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
      let allChirpsMessage = state.allChirpsMessage
      let chirpsPhoto = state.chirpsPhoto
      let tempChirp = state.currentChirp
      let currentChirp = action.data[0]
      action.data.forEach(element => {
        allChirpsMessage[element.id] = []
        chirpsPhoto[element.id] = []
        if(tempChirp && tempChirp.id == element.id){
          currentChirp = element
        }
      })
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        chirpList: action.data,
        allChirpsMessage,
        chirpsPhoto,
        currentChirp,
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
    case actionTypes.SEND_IMG_PENDING:{
      let allChirpsMessage = state.allChirpsMessage
      allChirpsMessage[action.data.chirpId][action.data.index] = action.data.msgItem
      return {
        ...state,
        allChirpsMessage
      }
    }
    case actionTypes.SEND_IMG_FULFILLED:{
      let allChirpsMessage = state.allChirpsMessage
      allChirpsMessage[action.data.chirpId][action.data.index] = action.data.msgItem
      return{
        ...state,
        allChirpsMessage
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
        chirpsPhoto[state.currentChirp.id].push({imgObj:action.data.imgObj,selected: false})
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
    case actionTypes.HISTORY_MESSAGE_PENDING:{
      return {
        ...state,
        loading: true
      }
    }
    case actionTypes.HISTORY_MESSAGE_FULFILLED:{
      let allChirpsMessage = state.allChirpsMessage
      let chirpsPhoto = state.chirpsPhoto
      allChirpsMessage[action.chirpId] = action.data.concat(allChirpsMessage[action.chirpId])
      action.data.forEach(item=>{
        if(item.msgType == 1){
          chirpsPhoto[action.chirpId].push({imgObj:item.fileList[0],selected: false})
        }
      })

      return {
        ...state,
        ...chirpsPhoto,
        loading: false
      }
    }
    case actionTypes.DELETE_CHIRP_FULFILLED:{
      let data = action.data
      var deleteChirpName
      let chirpList = state.chirpList
      let currentChirp = state.currentChirp
      let allChirpsMessage = state.allChirpsMessage
      let chirpsPhoto = state.chirpsPhoto
      if(currentChirp.id == data.chirpId) currentChirp =null
      chirpList = chirpList.filter(item=>{
        if(item.id == data.chirpId) deleteChirpName = item.name
        return item.id != data.chirpId
      })
      delete allChirpsMessage[data.chirpId]
      delete chirpsPhoto[data.chirpId]
      if(data.code == 10136  ){
        message.warn(deleteChirpName + ' was deleted')
      }else{
        message.warn(deleteChirpName + ' is expired' )
      }
      return {
        ...state,
        chirpList,
        ...allChirpsMessage,
        ...chirpsPhoto,
        currentChirp
      }
    }
    default:
      return {
        ...state,
        loading: false
      }
  }
}
