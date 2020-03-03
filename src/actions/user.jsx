import { USER_INFO_PENDING, USER_INFO_FULFILLED, USER_INFO_REJECTED } from '@constants/actionTypes'
import api from '@api'
import cookies from '@utils/cookies'
export function getUserInfo(userName, businessId) {
  return async dispatch => {
    dispatch({ type: USER_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 17,
        type: '0',
        uid: cookies.get('uid')
      }
      console.log(cookies.get('uid'))
      let res = await api.getUserInfo(params)
      if(res.code == '10005'){
        dispatch({
          type: USER_INFO_FULFILLED,
          data: {
            ...res.data
          }
        })
      }else{
        alert('getUserInfo fail!')
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
