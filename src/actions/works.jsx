import { WORKS_INFO_PENDING, WORKS_INFO_FULFILLED, WORKS_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api/works'

export function getAllWorks(userName, businessId) {
  return async (dispatch) => {
    dispatch({ type: WORKS_INFO_PENDING, data: 'loading' })
    try {
      const data = await api.getAllWorks(userName, businessId)
      dispatch({ type: WORKS_INFO_FULFILLED, data })
    } catch(error) {
      dispatch({ type: WORKS_INFO_REJECTED, error })
    }
  }
}

