import * as actionTypes from '@constants/actionTypes'
import { chirps } from '@utils/storage'
import { message } from 'antd'
export default (state = {
  chirpList: [],
  currentChirp: chirps.get('currentChirp', null),
  allChirpsMessage: {},
}, action) => {
  switch (action.type) {
    case actionTypes.GET_CHIRPSLIST_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.GET_CHIRPSLIST_FULFILLED:{
      let allChirpsMessage = state.allChirpsMessage
      let tempChirp = state.currentChirp
      let currentChirp = action.data[0]
      action.data.forEach(element => {
        allChirpsMessage[element.id] = []
        if(tempChirp && tempChirp.id == element.id){
          currentChirp = element
        }
      })
      // chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        chirpList: action.data,
        allChirpsMessage,
        currentChirp,
        loading: false
      }
    }
    case actionTypes.GET_CHIRPSLIST_REJECTED:
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
      allChirpsMessage[action.payload.chirpId].push(action.payload.msgItem)
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
    case actionTypes.SEND_IMG_REJECTED:{
      let allChirpsMessage = state.allChirpsMessage
      delete allChirpsMessage[action.data.chirpId][action.data.index]
      return{
        ...state,
        allChirpsMessage
      }
    }
    case actionTypes.APPEND_IMG_PENDING: case actionTypes.APPEND_IMG_FULFILLED: case actionTypes.APPEND_IMG_REJECTED:{
      let allChirpsMessage = state.allChirpsMessage
      const index = allChirpsMessage[action.payload.chirpId].findIndex( ( item )=>{
        return item.id  == action.payload.id
      } )
      allChirpsMessage[action.payload.chirpId][index].fileList = action.payload.fileList
      return {
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
      if(action.data.type ==='msg'){
        allChirpsMessage[action.data.chirpId][action.data.index].sending = false
      }
      return {
        ...state,
        allChirpsMessage,
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
      allChirpsMessage[action.chirpId] = action.data.concat(allChirpsMessage[action.chirpId])
      return {
        ...state,
        allChirpsMessage,
        loading: false
      }
    }
    case actionTypes.CREATE_CHIRP:{
      let chirpList = state.chirpList
      let currentChirp = state.currentChirp
      let allChirpsMessage = state.allChirpsMessage
      chirpList.push(action.payload)
      currentChirp = action.payload
      allChirpsMessage[currentChirp.id] = []
      return{
        ...state,
        chirpList,
        currentChirp,
        allChirpsMessage
      }
    }
    case actionTypes.UPDATE_CHIRP_SETTING:{
      let chirpList = state.chirpList
      let currentChirp = state.currentChirp
      chirpList.forEach( (chirp, index) => {
        if(chirp.id == action.payload.id){
          chirpList[index] = { ...chirpList[index], ...action.payload }
          if(currentChirp.id == chirp.id ){
            currentChirp = chirpList[index]
          }
        }
      })
      return {
        ...state,
        chirpList,
        currentChirp,
      }
    }
    case actionTypes.DELETE_CHIRP_FULFILLED:{
      let data = action.data
      var deleteChirpName
      let chirpList = state.chirpList
      let currentChirp = state.currentChirp
      let allChirpsMessage = state.allChirpsMessage
      chirpList = chirpList.filter(item=>{
        if(item.id == data.chirpId) deleteChirpName = item.name
        return  item && item.id != data.chirpId
      })
      delete allChirpsMessage[data.chirpId]
      if(currentChirp.id == data.chirpId) currentChirp = chirpList[0] ? chirpList[0] : null
      if(data.code == 10136  ){
        message.warn(deleteChirpName + ' was deleted')
      }else{
        message.warn(deleteChirpName + ' is expired' )
      }
      return {
        ...state,
        chirpList,
        allChirpsMessage,
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
