import {
  USER_INFO_PENDING, USER_INFO_FULFILLED, USER_INFO_REJECTED,
  LOGIN_FULFILLED, LOGIN_REJECTED,
  ANONYMOUS_LOGIN_FULFILLED, ANONYMOUS_LOGIN_REJECTED,
  LOGOUT,
  UPDATE_USER
} from '@constants/userActionTypes'
import api from '@api'
import { USER_TOKEN, USER_UID } from '@/../config/stroage.conf'
import { getChirpUid } from '@utils/localStroage'
import cookies from '@utils/cookies'
import { getChirpList } from './chirps'
import NProgress from 'nprogress'

export function getUserInfo() {
  return async dispatch => {
    dispatch({ type: USER_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 17,
        type: '0',
        uid: cookies.get(USER_UID)
      }
      let res = await api.getUserInfo(params)
      if(res.error) throw new Error('get userInfo fail')
      if(res.code == '10005'){
        dispatch({
          type: USER_INFO_FULFILLED,
          data: {
            ...res.data
          }
        })
      }
    } catch (error) {
      dispatch({ type: USER_INFO_REJECTED, error })
    }
  }
}

export function updateUser(user) {
  cookies.set(USER_TOKEN, user.authToken)
  return {
    type: UPDATE_USER,
    playload: user
  }
}

export function doLogin(param){
  return async dispatch => {
    NProgress.start()
    return api.login(param).then(async (response)=>{
      if (response.code == 10007) {
        let { uid ,token } = response
        cookies.set(USER_UID,uid)
        cookies.set(USER_TOKEN,token)
        await dispatch(getUserInfo())
        await dispatch(getChirpList())
        NProgress.done()
        dispatch({ type: LOGIN_FULFILLED, user: { uid, token } })
        return { error: null, res: '' }
      } else {
        dispatch({ type: LOGIN_REJECTED, data: 'login fail!' })
        NProgress.done()
        return { error: 'login fail', res: '' }
      }
    })

  }
}

export function anonymousLoginAct() {
  return async dispatch => {
    NProgress.start()
    var chirpUid = getChirpUid()
    return api.anonymousLogin({ authToken: chirpUid, isAnonymous: 1 }).then(async (response)=>{
      console.log(response)
      if (response.code == 10007) {
        let { uid  } = response
        cookies.set(USER_UID,uid)
        await dispatch(getUserInfo())
        await dispatch(getChirpList())
        NProgress.done()
        dispatch({ type: ANONYMOUS_LOGIN_FULFILLED, user: { uid } })
        return { error: null, res: '' }
      } else {
        dispatch({ type: ANONYMOUS_LOGIN_REJECTED, data: 'login fail!' })
        NProgress.done()
        return { error: 'login fail', res: '' }
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
