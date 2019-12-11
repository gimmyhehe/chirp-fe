import * as actionTypes from '@constants/actionTypes'
import { works } from '@utils/storage'

export default function (state = { data: works.get('data', []) }, action) {
  switch (action.type) {
    case actionTypes.WORKS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.WORKS_INFO_FULFILLED:
      works.set('data', action.data)
      return {
        data: action.data,
        loading: false
      }
    case actionTypes.WORKS_INFO_REJECTED:
      works.set('error', action.error)
      return {
        ...state,
        error: action.error,
        data: [],
        loading: false
      }
    default:
      return {
        ...state,
        loading: false
      }
  }
}
