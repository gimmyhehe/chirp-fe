import requests from '@utils/requests'
import { socketLogin,socketLogout} from '@utils/websocket'

/**
 * 用户登录的接口
 * @param {object} data 用户登录的表单数据
 */
export const login = data => {
  return socketLogin(data)
}
/**
 * 用户注销登录
 */
export const logout = () => {
  return socketLogout()
}

export const anonymousLogin = (data)=> {
  return socketLogin(data)
}
/**
 * 用户注册的接口
 * @param {object} data 用户注册的表单数据
 */
export const signUp = data => requests.post('/api/user/register', data)


export default {
  login,
  logout,
  signUp,
  anonymousLogin
}
