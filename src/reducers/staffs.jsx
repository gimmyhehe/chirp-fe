import * as actionTypes from '@constants/actionTypes'
import { staffs } from '@utils/storage'

export default (state = { data: staffs.get('data', []) }, action) => {
  switch (action.type) {
    case actionTypes.STAFFS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.STAFFS_INFO_FULFILLED:
      staffs.set('data', action.data)
      return {
        data: action.data,
        loading: false
      }
    case actionTypes.STAFFS_INFO_REJECTED:
      staffs.set('error', action.error)
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
