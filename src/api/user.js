
import { sendRequest } from '@utils/websocket'

export function getUserInfo(params){
  return sendRequest(params,'getUserInfo')
}

export default {
  getUserInfo,
}
