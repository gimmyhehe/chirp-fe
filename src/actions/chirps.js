/*
 * @Author: your name
 * @Date: 2020-01-05 10:12:49
 * @LastEditTime: 2020-03-11 18:59:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\actions\chirps.js
 */
import {
  GET_CHIRPSLIST_PENDING, GET_CHIRPSLIST_FULFILLED, GET_CHIRPSLIST_REJECTED,
  CURRENT_CHIRP_PENDING, CURRENT_CHIRP_FULFILLED, CURRENT_CHIRP_REJECTED,
  SET_CHIRP_PENDING, SET_CHIRP_FULFILLED, SET_CHIRP_REJECTED,
  SEND_MSG_PENDING, SEND_MSG_FULFILLED, SEND_MSG_REJECTED,
  SEND_MSG_SUCCESS_PENDING, SEND_MSG_SUCCESS_FULFILLED, SEND_MSG_SUCCESS_REJECTED,
  CREATE_CHIRP, DELETE_CHIRP_FULFILLED,
  HISTORY_MESSAGE_PENDING,  HISTORY_MESSAGE_FULFILLED,  HISTORY_MESSAGE_REJECTED,
  SEND_FILE_PENDING, SEND_FILE_REJECTED,
  APPEND_FILE_PENDING, APPEND_FILE_FULFILLED, APPEND_FILE_REJECTED,
  UPDATE_CHIRP_SETTING

} from '@constants/actionTypes'
import { USER_UID } from '@/../config/stroage.conf'
import cookies from '@utils/cookies'
import { get_filemd5sum } from '@utils/fileHandle'
import { getImgWH } from '@utils/imageHandle'
import api from '@api'
import { message, Modal } from 'antd'

export function getChirpList() {
  return async (dispatch) => {
    dispatch({ type: GET_CHIRPSLIST_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 25,
        memberId: cookies.get(USER_UID)
      }
      const { data, error } = await api.getChirpList(params)
      if(error){
        throw new Error('getChirpList Fail')
      }
      dispatch({ type: GET_CHIRPSLIST_FULFILLED, data })
      data.forEach(item => {
        dispatch(getHistoryMessage(item.id))
      })
    } catch (error) {

      dispatch({ type: GET_CHIRPSLIST_REJECTED, error })

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

export function sendFileList(msgItem){
  return async (dispatch)=>{
    dispatch({ type: SEND_FILE_PENDING, payload: msgItem })
  }
}
export function cancelSendFileList(msgItem){
  return async (dispatch)=>{
    dispatch({ type: SEND_FILE_REJECTED, payload: msgItem })
  }
}

export function appendImg(chirpFile){
  return async (dispatch) =>{
    const { chirpId, id, fileObj, sendFileList } = chirpFile
    // dispatch( appendImg({ chirpId: currentChirp.id, id, fileObj: item }) )
    const { file, imgUrl } = fileObj
    const {  width, height } = await getImgWH(imgUrl)
    const index = sendFileList.length
    sendFileList[index] =  { ...fileObj, width, height, status: 'sending' }
    dispatch({ type: APPEND_FILE_PENDING, payload: { chirpId, id, fileList: sendFileList } })

    var formData = new FormData()
    formData.append('chirpId', chirpId)
    formData.append('userId', cookies.get(USER_UID))
    formData.append('fileName', file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)

    return await api.upload(formData)
      .then(res=>{
        if(res.code ===0){
          URL.revokeObjectURL(fileObj.imgUrl)
          const photoItem = { ...fileObj, imgUrl: res.data, width, height }
          sendFileList[index] = photoItem
          dispatch({ type: APPEND_FILE_FULFILLED, payload: { chirpId, id, fileList: sendFileList, photoItem } })
          return ( photoItem )
        }else{
          message.error(`${file.name} upload fail! ${res.message}`)
          throw new Error('upload fail')
        }
      })
      .catch(err=>{
        URL.revokeObjectURL(fileObj.imgUrl)
        delete sendFileList[index]
        dispatch({ type: APPEND_FILE_REJECTED, payload: { chirpId, id, fileList: sendFileList } })
        if(err == 'upload fail' ){
          //空操作
        }else{
          Modal.destroyAll()
          Modal.error({
            content: 'Upload fail! The upload server is busy now.'
          })
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
    dispatch({ type: APPEND_FILE_PENDING, payload: { chirpId, id, fileList: sendFileList } })

    var formData = new FormData()
    formData.append('chirpId', chirpId)
    formData.append('userId', cookies.get(USER_UID))
    formData.append('fileName', file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)

    return await api.upload(formData)
      .then(res=>{
        if(res.code ===0){
          delete fileObj.file
          sendFileList[index] = { ...fileObj, fileUrl: res.data }
          dispatch({ type: APPEND_FILE_FULFILLED, payload: { chirpId, id, fileList: sendFileList } })
          return ( { ...fileObj, fileUrl: res.data } )
        }else{
          message.error(`${file.name} upload fail. ${res.message}`)
          throw new Error('upload fail')
        }
      })
      .catch(err=>{
        delete sendFileList[index]
        dispatch({ type: APPEND_FILE_REJECTED, payload: { chirpId, id, fileList: sendFileList } })
        if(err == 'upload fail' ){
          //空操作
        }else{
          Modal.destroyAll()
          Modal.error({
            content: 'Upload fail! The upload server is busy now.'
          })
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
