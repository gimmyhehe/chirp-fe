import { guid } from './tool'
const deviceIDKey = 'deviceID'

export function setItem(key,value){
  if( !window.sessionStorage){
    alert('Your browser is not support sessionStroage!')
    return false
  }
  sessionStorage.setItem(key,value)

}

export function getItem(key) {
  if( !window.sessionStorage){
    alert('Your browser is not support sessionStroage!')
    return false
  }
  return sessionStorage.getItem(key)
}

export function removeItem(key) {
  if(!window.sessionStorage){
    alert('Your browser is not support sessionStroage!')
    return false
  }
  sessionStorage.removeItem(key)
}


export function setDeviceID(){
  if(!getItem(deviceIDKey)){
    console.log(guid())
    setItem(deviceIDKey, guid())
  }
}

export function getDeviceID(){
  return getItem(deviceIDKey)
}
