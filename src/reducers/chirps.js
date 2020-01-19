/*
 * @Author: your name
 * @Date: 2020-01-05 10:06:54
 * @LastEditTime : 2020-01-17 02:15:05
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\reducers\chirps.js
 */
import * as actionTypes from '@constants/actionTypes'
import { chirps } from '@utils/storage'

export default (state = {
  chirpList: chirps.get('chirpList', []),
  currentChirp: chirps.get('currentChirp',{}),
  chirpsMessage: chirps.get('chirpsMessage',{})
}, action) => {
  switch (action.type) {
    case actionTypes.CHIRPS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.CHIRPS_INFO_FULFILLED:{

      chirps.set('chirpList', action.data)
      let chirpsMessage ={}
      action.data.forEach(element => {
        chirpsMessage[element.id] = []
      })
      chirps.set('chirpsMessage',chirpsMessage)
      return {
        ...state,
        chirpList: action.data,
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
      let chirpsMessage = chirps.get('chirpsMessage')
      chirpsMessage[action.data.group_id].push(action.data)
      chirps.set('chirpsMessage',chirpsMessage)
      console.log(chirpsMessage)
      return {
        ...state,
        chirpsMessage: chirpsMessage,
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
