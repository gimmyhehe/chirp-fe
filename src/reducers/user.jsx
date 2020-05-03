import * as actionTypes from '@constants/userActionTypes'
import { USER_TOKEN, USER_UID } from '@/../config/stroage.conf'
import cookie from '@utils/cookies'
const initState = {
  data: {},
  userName : null,
  uid : cookie.get(USER_UID)
}
export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.USER_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.USER_INFO_FULFILLED:

      return {
        ...state,
        data: action.data,
        userName : action.data.firstName + ' ' + action.data.lastName,
        loading: false
      }
    case actionTypes.USER_INFO_REJECTED:
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
      cookie.set(USER_UID,action.user.uid)
      cookie.set(USER_TOKEN,action.user.token)
      return {
        ...state,
        ...action.user,
        isLogin: true
      }
    case actionTypes.LOGIN_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    case actionTypes.ANONYMOUS_LOGIN_FULFILLED:
      return{
        ...state,
        ...action.user,
        isLogin: false,
        anonymous: true
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
