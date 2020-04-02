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
  DELETE_CHIRP_FULFILLED,
  HISTORY_MESSAGE_PENDING,  HISTORY_MESSAGE_FULFILLED,  HISTORY_MESSAGE_REJECTED,
  SEND_IMG_PENDING, SEND_IMG_FULFILLED, SEND_IMG_REJECTED

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
      const {data} = await api.getChirpList(params)
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

export function sendImg(fileObj){
  return async (dispatch, getState)=>{

    // this.props.sendImg({ file, index, chirpId })
    const { file, imgUrl } = fileObj
    const {  width, height } = await getImgWH(imgUrl)
    const { chirps, user } = getState()
    const chirpId = chirps.currentChirp.id
    let index = chirps.allChirpsMessage[chirpId].length
    let msgItem = {
      'from': cookies.get('uid'),
      'fromName': user.userNmae,
      'createTime': Date.now(),
      'cmd':11,
      'group_id': chirpId,
      'chatType':'1',
      'msgType':'1',
      'content': '',
      fileList: [{ imgUrl, width, height, status: 'sending' }]
    }

    dispatch({ type: SEND_IMG_PENDING, data: { chirpId, index, msgItem } })
    var formData = new FormData()
    formData.append('chirpId', chirpId)
    formData.append('userId', cookies.get('uid'))
    formData.append('fileName', file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)
    await api.upload(formData)
      .then(res=>{
        if(res.code ===0){
          URL.revokeObjectURL(fileObj.imgUrl)
          let imgObj = { imgUrl: res.data, width, height }
          msgItem.fileList = [imgObj]
          dispatch({ type: SEND_IMG_FULFILLED, data: { chirpId, index, msgItem } })
          api.sendMessage(msgItem).then((res)=>{
            if(res.code == 10000){
              // this.props.sendMsgSuccess({type:'img',index,chirpId,imgObj})
            }else{
              throw new Error('send message fail')
            }
          }).catch((error)=>{
            console.error(error)
          })
        }else{
          msgItem.fileList[0].status = 'fail'
          dispatch({ type: SEND_IMG_FULFILLED, data: { chirpId, index, msgItem } })
          message.error(`${file.name} upload fail! ${res.message}`)
        }
      })
      .catch(err=>{
        message.error('upload fail! upload server has error!')
        console.error(err)
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
      if(res.code == 10039){
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
