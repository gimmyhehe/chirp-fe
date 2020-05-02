import { ANONYMOUS_UID } from '../../config/stroage.conf'
import { guid } from '@utils/tool'
if( !window.localStorage){
  alert('Your browser is not support localStorage!')
}

const myLocalStorage = {
  setItem(key,value){
    localStorage.setItem(key,value)
  },
  getItem(key) {
    return localStorage.getItem(key)
  },
  removeItem(key) {
    localStorage.removeItem(key)
  }
}

export function getChirpUid(){
  let chirpUid = myLocalStorage.getItem(ANONYMOUS_UID)
  if(chirpUid){
    return chirpUid
  }else{
    chirpUid = guid()
    myLocalStorage.setItem(ANONYMOUS_UID, chirpUid)
    return chirpUid
  }
}

export default myLocalStorage
