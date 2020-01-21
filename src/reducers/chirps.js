/*
 * @Author: your name
 * @Date: 2020-01-05 10:06:54
 * @LastEditTime : 2020-01-22 00:27:30
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\reducers\chirps.js
 */
import * as actionTypes from '@constants/actionTypes'
import { chirps } from '@utils/storage'

export default (state = {
  chirpList: chirps.get('chirpList', []),
  currentChirp: chirps.get('currentChirp',{}),
  allChirpsMessage: chirps.get('allChirpsMessage',{})
}, action) => {
  switch (action.type) {
    case actionTypes.CHIRPS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.CHIRPS_INFO_FULFILLED:{

      chirps.set('chirpList', action.data)
      let allChirpsMessage ={}
      action.data.forEach(element => {
        allChirpsMessage[element.id] = []
      })
      chirps.set('allChirpsMessage',allChirpsMessage)
      return {
        ...state,
        chirpList: action.data,
        allChirpsMessage: allChirpsMessage,
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
      let allChirpsMessage = chirps.get('allChirpsMessage')
      allChirpsMessage[action.data.group_id].push(action.data)
      chirps.set('allChirpsMessage',allChirpsMessage)
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
    default:
      return {
        ...state,
        loading: false
      }
  }
}
