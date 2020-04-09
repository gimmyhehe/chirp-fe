import {
  USER_INFO_PENDING, USER_INFO_FULFILLED, USER_INFO_REJECTED,
  LOGIN_FULFILLED, LOGIN_REJECTED,
  LOGOUT,
} from '@constants/userActionTypes'
import api from '@api'
import cookies from '@utils/cookies'
import { getChirpList } from './chirps'
import NProgress from 'nprogress'
import { message } from 'antd'
export function getUserInfo(userName, businessId) {
  return async dispatch => {
    dispatch({ type: USER_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 17,
        type: '0',
        uid: cookies.get('uid')
      }
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

export function doLogin(param){
  return async dispatch => {
    NProgress.start()
    return api.login(param).then(async (response)=>{
      if (response.code == 10007) {
        let { uid ,token } = response
        cookies.set('uid',uid)
        cookies.set('chirp-token',token)
        await dispatch(getUserInfo())
        await dispatch(getChirpList())
        NProgress.done()
        dispatch({ type: LOGIN_FULFILLED, user: { uid, token } })
      } else {
        message.error(response.msg)
        dispatch({ type: LOGIN_REJECTED, data: 'login fail!' })
        NProgress.done()
      }
    })

  }
}

export function doLogout(){
  return {
    type: LOGOUT,
    user:{
      userName: null,
      uid: null,
      token: null,
      isLogin: false
    }
  }
}
