import { STAFFS_INFO_PENDING, STAFFS_INFO_FULFILLED, STAFFS_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api/staffs'

export function getStaffsInfo(userName, businessId) {
  return async dispatch => {
    dispatch({ type: STAFFS_INFO_PENDING, data: 'loading' })
    try {
      const data = await api.getStaffUsers(userName, businessId)
      dispatch({ type: STAFFS_INFO_FULFILLED, data })
    } catch (error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: STAFFS_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: STAFFS_INFO_REJECTED, error })
      }
    }
  }
}
