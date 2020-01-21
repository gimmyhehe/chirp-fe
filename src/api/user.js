
import { sendRequest } from '@utils/websocket'

export function getUserInfo(params){
  return sendRequest(params)
}

export default {
  getUserInfo,
}
