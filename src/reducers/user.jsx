import * as actionTypes from '@constants/userActionTypes'
import { user } from '@utils/storage'
import cookie from '@utils/cookies'
const initState = {
  data: user.get('data', {}),
  userName : null,
  uid : cookie.get('uid')
}
export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.USER_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.USER_INFO_FULFILLED:
      user.set('data', action.data)
      return {
        ...state,
        data: action.data,
        userName : action.data.firstName + action.data.lastName,
        loading: false
      }
    case actionTypes.USER_INFO_REJECTED:
      user.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.LOGIN_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.LOGIN_FULFILLED:
      cookie.set('uid',action.user.uid)
      cookie.set('chirp-token',action.user.token)
      return {
        ...state,
        ...action.user,
        isLogin: true,
        loading: false
      }
    case actionTypes.LOGIN_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        ...action.user
      }
    default:
      return {
        ...state,
        loading: false
      }
  }
}
