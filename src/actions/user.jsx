import { USER_INFO_PENDING, USER_INFO_FULFILLED, USER_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api'

export function getUserInfo(userName, businessId) {
  return async dispatch => {
    dispatch({ type: USER_INFO_PENDING, data: 'loading' })
    try {
      let identity, data
      if (businessId == 0) {
        identity = 'mu'
        data = await api.getMasterUser(userName, businessId)
      } else {
        identity = 'su'
        data = await api.getStaffUser(userName, businessId)
        if (data.masterUserBusinessId) {
          data.businessId = data.masterUserBusinessId
        }
      }
      dispatch({
        type: USER_INFO_FULFILLED,
        data: {
          userName,
          businessId,
          identity,
          ...data
        }
      })
    } catch (error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: USER_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: USER_INFO_REJECTED, error })
      }
    }
  }
}
