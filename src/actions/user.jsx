import { USER_INFO_PENDING, USER_INFO_FULFILLED, USER_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api'

export function getUserInfo(userName, businessId) {
  return async dispatch => {
    dispatch({ type: USER_INFO_PENDING, data: 'loading' })
    try {
      console.log('this is redux test!')
      let res = await api.getUserInfo()
      if(res.code == '10005'){
        dispatch({
          type: USER_INFO_FULFILLED,
          data: {
            ...res.data
          }
        })
      }else{
        alert('some error happen')
      }
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
