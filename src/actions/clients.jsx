import { CLIENTS_INFO_PENDING, CLIENTS_INFO_FULFILLED, CLIENTS_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api'

export function getClientsInfo(userName, businessId) {
  return async (dispatch) => {
    dispatch({ type: CLIENTS_INFO_PENDING, data: 'loading' })
    try {
      const data = await api.getClients(userName, businessId)
      dispatch({ type: CLIENTS_INFO_FULFILLED, data })
    } catch (error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: CLIENTS_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: CLIENTS_INFO_REJECTED, error })
      }
    }
  }
}

