/*
 * @Author: your name
 * @Date: 2020-01-05 10:12:49
 * @LastEditTime: 2020-03-11 18:59:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\actions\chirps.js
 */
import {
  CHIRPS_INFO_PENDING, CHIRPS_INFO_FULFILLED, CHIRPS_INFO_REJECTED,
  CURRENT_CHIRP_PENDING, CURRENT_CHIRP_FULFILLED, CURRENT_CHIRP_REJECTED,
  SET_CHIRP_PENDING, SET_CHIRP_FULFILLED, SET_CHIRP_REJECTED,
  SEND_MSG_PENDING, SEND_MSG_FULFILLED, SEND_MSG_REJECTED,
  SEND_MSG_SUCCESS_PENDING, SEND_MSG_SUCCESS_FULFILLED, SEND_MSG_SUCCESS_REJECTED,
  CREATE_CHIRP, DELETE_CHIRP_FULFILLED,
  HISTORY_MESSAGE_PENDING,  HISTORY_MESSAGE_FULFILLED,  HISTORY_MESSAGE_REJECTED,
  SEND_IMG_PENDING,
  APPEND_IMG_PENDING, APPEND_IMG_FULFILLED, APPEND_IMG_REJECTED,
  UPDATE_CHIRP_SETTING

} from '@constants/actionTypes'
import cookies from '@utils/cookies'
import { get_filemd5sum, getImgWH} from '@utils/fileHandle'
import api from '@api'
import { message } from 'antd'

export function getChirpList() {
  return async (dispatch) => {
    dispatch({ type: CHIRPS_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 25,
        memberId: cookies.get('uid')
      }
      const { data, error } = await api.getChirpList(params)
      if(error){
        throw new Error('getChirpList Fail')
      }
      dispatch({ type: CHIRPS_INFO_FULFILLED, data })
      data.forEach(item => {
        dispatch(getHistoryMessage(item.id))
      })
    } catch (error) {

      dispatch({ type: CHIRPS_INFO_REJECTED, error })

    }
  }
}

export function getCurrentChirp(chirp) {
  return async (dispatch) =>{
    dispatch({ type: CURRENT_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: CURRENT_CHIRP_FULFILLED, chirp })
    }catch(error){
      dispatch({ type: CURRENT_CHIRP_REJECTED, error })
    }
  }
}

export function setChirpList(data) {
  return async (dispatch) =>{
    dispatch({ type: SET_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: SET_CHIRP_FULFILLED, data })
    }catch(error){
      dispatch({ type: SET_CHIRP_REJECTED, error })
    }
  }
}

export function sendMsg(msg){
  return async (dispatch) =>{
    dispatch({ type: SEND_MSG_PENDING, data: 'loading' })
    try{
      dispatch({ type: SEND_MSG_FULFILLED, msg })
    }catch(error){
      dispatch({ type: SEND_MSG_REJECTED, error })
    }
  }
}

export function sendImg(msgItem){
  return async (dispatch)=>{
    dispatch({ type: SEND_IMG_PENDING, payload: msgItem })
  }
}

export function appendImg(chirpFile){
  return async (dispatch) =>{
    const { chirpId, id, fileObj, sendFileList } = chirpFile
    // dispatch( appendImg({ chirpId: currentChirp.id, id, fileObj: item }) )
    const { file, imgUrl } = fileObj
    const {  width, height } = await getImgWH(imgUrl)
    const index = sendFileList.length
    sendFileList[index] =  { imgUrl, width, height, status: 'sending' }
    dispatch({ type: APPEND_IMG_PENDING, payload: { chirpId, id, fileList: sendFileList } })

    var formData = new FormData()
    formData.append('chirpId', chirpId)
    formData.append('userId', cookies.get('uid'))
    formData.append('fileName', file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)

    return await api.upload(formData)
      .then(res=>{
        if(res.code ===0){
          URL.revokeObjectURL(fileObj.imgUrl)
          const photoItem = { imgUrl: res.data, width, height }
          sendFileList[index] = photoItem
          dispatch({ type: APPEND_IMG_FULFILLED, payload: { chirpId, id, fileList: sendFileList, photoItem } })
          return ( photoItem )
        }else{
          message.error(`${file.name} upload fail! ${res.message}`)
          throw new Error('upload fail')
        }
      })
      .catch(err=>{
        URL.revokeObjectURL(fileObj.imgUrl)
        delete sendFileList[index]
        dispatch({ type: APPEND_IMG_REJECTED, payload: { chirpId, id, fileList: sendFileList } })
        if(err == 'upload fail' ){
          //空操作
        }else{
          message.error('upload fail! upload server has error!')
          console.error(err)
        }
        return null
      })
  }
}


export function appendFile(chirpFile){
  return async (dispatch) =>{
    const { chirpId, id, fileObj, sendFileList } = chirpFile
    const { file } = fileObj
    const index = sendFileList.length
    sendFileList[index] =  { ...fileObj, status: 'sending' }
    dispatch({ type: APPEND_IMG_PENDING, payload: { chirpId, id, fileList: sendFileList } })

    var formData = new FormData()
    formData.append('chirpId', chirpId)
    formData.append('userId', cookies.get('uid'))
    formData.append('fileName', file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)

    return await api.upload(formData)
      .then(res=>{
        if(res.code ===0){
          delete fileObj.file
          sendFileList[index] = { ...fileObj, fileUrl: res.data }
          dispatch({ type: APPEND_IMG_FULFILLED, payload: { chirpId, id, fileList: sendFileList } })
          return ( { ...fileObj, fileUrl: res.data } )
        }else{
          message.error(`${file.name} upload fail! ${res.message}`)
          throw new Error('upload fail')
        }
      })
      .catch(err=>{
        delete sendFileList[index]
        dispatch({ type: APPEND_IMG_REJECTED, payload: { chirpId, id, fileList: sendFileList } })
        if(err == 'upload fail' ){
          //空操作
        }else{
          message.error('upload fail! upload server has error!')
          console.error(err)
        }
        return null
      })
  }
}

export function sendMsgSuccess(data){
  return async (dispatch) =>{
    dispatch({ type: SEND_MSG_SUCCESS_PENDING, data: 'loading' })
    try{
      dispatch({ type: SEND_MSG_SUCCESS_FULFILLED, data })
    }catch(error){
      dispatch({ type: SEND_MSG_SUCCESS_REJECTED, error })
    }
  }
}


export function createChirp(newChirp) {
  return {
    type: CREATE_CHIRP,
    payload: newChirp
  }
}

export function updateChirp(chirp) {
  return {
    type: UPDATE_CHIRP_SETTING,
    payload : chirp
  }
}
export function deleteChirp({ chirpId, msg, code  }){
  return {
    type: DELETE_CHIRP_FULFILLED,
    data: { chirpId, msg, code }
  }
}

export function getHistoryMessage(chirpId){
  return async (dispatch)=>{
    dispatch({ type: HISTORY_MESSAGE_PENDING })
    api.getHistoryMessage({ cmd: 31, chirpId  }).then(res=>{
      if( !res.error && res.code == 10039){
        res.data.forEach(item=>{
          if(item.fileList){
            if( typeof item.fileList == 'object' ) return
            if(item.fileList[item.fileList.length-1] == ',') item.fileList = item.fileList.substr(0,item.fileList.length-1)
            item.fileList = JSON.parse(item.fileList)
            if(!(item.fileList instanceof Array)) item.fileList = [item.fileList]
          }
        })
        dispatch({ type: HISTORY_MESSAGE_FULFILLED, chirpId: res.chirpId, data: res.data  })
      }else{
        dispatch({ type: HISTORY_MESSAGE_REJECTED })
      }
    }).catch(error=>{
      console.log(error)
    })

  }
}
