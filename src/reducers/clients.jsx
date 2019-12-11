import * as actionTypes from '@constants/actionTypes'
import { clients } from '@utils/storage'

export default (state = { data: clients.get('data', []) }, action) => {
  switch (action.type) {
    case actionTypes.CLIENTS_INFO_PENDING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.CLIENTS_INFO_FULFILLED:
      clients.set('data', action.data)
      return {
        data: action.data,
        loading: false
      }
    case actionTypes.CLIENTS_INFO_REJECTED:
      clients.set('error', action.error)
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
