import * as actionTypes from '@constants/actionTypes'
import { user } from '@utils/storage'

export default (state = { data: user.get('data', {}) }, action) => {
  switch (action.type) {
    case actionTypes.USER_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.USER_INFO_FULFILLED:
      user.set('data', action.data)
      return {
        data: action.data,
        loading: false
      }
    case actionTypes.USER_INFO_REJECTED:
      user.set('error', action.error)
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
