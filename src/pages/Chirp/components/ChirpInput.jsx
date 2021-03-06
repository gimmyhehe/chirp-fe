import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Icon, Dropdown, message } from 'antd'
import { readDiskFile } from '@/utils/fileHandle'
import { useSelector, useDispatch  } from 'react-redux'
import { sendMsg, sendMsgSuccess, sendImg, appendImg, appendFile } from '@actions/chirps'
import Picker from  './EmojiPicker'
import xss from '@utils/xss'
import api from '@api'
import cookies from '@utils/cookies'
const MessegeBox = styled.div`
padding:12px;
position: absolute;
bottom: 4px;
right: 1px;
left: 1px;
@media (max-width: 700px){
  bottom: 0;
  left: 0;
  right: 0;
}
display: flex;
align-items: center;
background-color: #f9f9f9;
.anticon{
  font-size:21px;
  margin-right:20px;
}
.ant-input{
  display: inline-block;
  width: 90%;
  border-radius: 30px;
  border: 2px solid #000;
}
`
const UploadBox = styled.div`
  background: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 0 4px #d9d9d9;
  border-radius: 3px;
  color: #666;
  &>div{
    text-align: center;
    font-size: 15px;
    padding: 12px 20px ;
    margin: 0;
    position: relative;
    display: block;
    white-space: nowrap;
    cursor: pointer;
  }
`

export default function ChirpInput(){
  const dispatch = useDispatch()
  const $input = useRef(null)
  const [uploadVisiable, setuploadVisiable] = useState(false)
  const userName = useSelector(state => state.user.userName)
  const currentChirp = useSelector(state => state.chirps.currentChirp)
  const chirpMessage = useSelector(state => state.chirps.allChirpsMessage[currentChirp.id])

  async function selectPhotos() {
    if(currentChirp.uploadPermissionEnabled != 1){
      message.warn('sorry this chirp does not open the upload permission')
      return false
    }
    setuploadVisiable(false)
    let photosList = await readDiskFile({ fileType: 'image' })
    if ( !photosList ) return
    photosList = photosList.filter((item)=>{
      return item
    })
    if( photosList.length == 0 ) return
    const id = Date.now()  + (Math.random()*1000).toFixed(0)
    const sendFileList = []
    let msgItem = {
      id,
      'from': cookies.get('uid'),
      'fromName': userName,
      'createTime': Date.now(),
      'cmd':11,
      'group_id': currentChirp.id,
      'chatType':'1',
      'msgType': 1,
      'content': '',
      fileList: sendFileList
    }
    dispatch(sendImg({ msgItem, chirpId: currentChirp.id }))
    const promises = photosList.map( item =>{
      return new Promise( ( resolve )=>{
        dispatch( appendImg({ chirpId: currentChirp.id, id, fileObj: item, sendFileList }) )
          .then( res=>{
            console.log(res)
            resolve(res)
          } )
      })
    } )

    Promise.all( promises )
      .then( res =>{
        msgItem.fileList = res
        api.sendMessage(msgItem).then((res)=>{
          if( !res.error && res.code == 10000){
            // this.props.sendMsgSuccess({type:'img',index,chirpId,imgObj})
          }else{
            throw new Error('send message fail')
          }
        }).catch((error)=>{
          console.error(error)
        })
      } )
      .catch( error =>{
        message.error( 'upload images has error!' )
        console.error(error)
      } )




  }

  async function selectFile() {
    if(currentChirp.uploadPermissionEnabled != 1){
      message.warn('sorry this chirp does not open the upload permission')
      return false
    }
    setuploadVisiable(false)
    // fileUrl: null
    // name: "test2.xls"
    // size: 6656
    // type: "application/vnd.ms-excel"
    // ext: "xls"
    let fileList = await readDiskFile({ fileType: 'file' })
    if ( !fileList ) return
    fileList = fileList.filter((item)=>{
      return item
    })
    if( fileList.length == 0 ) return
    const id = Date.now()  + (Math.random()*1000).toFixed(0)
    const sendFileList = []
    let msgItem = {
      id,
      'from': cookies.get('uid'),
      'fromName': userName,
      'createTime': Date.now(),
      'cmd':11,
      'group_id': currentChirp.id,
      'chatType':'1',
      'msgType': 2,
      'content': '',
      fileList: sendFileList
    }
    dispatch(sendImg({ msgItem, chirpId: currentChirp.id }))
    const promises = fileList.map( item =>{
      return new Promise( ( resolve )=>{
        dispatch( appendFile({ chirpId: currentChirp.id, id, fileObj: item, sendFileList }) )
          .then( res=>{
            console.log(res)
            resolve(res)
          } )
      })
    } )

    Promise.all( promises )
      .then( res =>{
        msgItem.fileList = res
        api.sendMessage(msgItem).then((res)=>{
          if( !res.error && res.code == 10000){
            // this.props.sendMsgSuccess({type:'img',index,chirpId,imgObj})
          }else{
            throw new Error('send file fail')
          }
        }).catch((error)=>{
          console.error(error)
        })
      } )
      .catch( error =>{
        message.error( 'upload file has error!' )
        console.error(error)
      } )


  }

  function addEmoji(emoji) {
    insertAtCursor(emoji)
  }

  function insertAtCursor(value) {
    const input = $input.current
    if (input.selectionStart || input.selectionStart === 0) {
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      const restoreTop = input.scrollTop
      if(!input.value){
        input.value =  value
      }else{
        input.value = input.value.substring(0, startPos) + ' '
              + value
              +  ' ' + input.value.substring(endPos, input.value.length)
      }
      if (restoreTop > 0) {
        input.scrollTop = restoreTop
      }
      input.focus()
      input.selectionStart = startPos + value.length + 1
      input.selectionEnd = startPos + value.length + 1
    } else {
      input.value = input.value + ' ' + value
      input.focus()
    }
  }

  function handleSendMessage(e){
    if (e.key === 'Tab') {
      e.preventDefault()
    }else if(e.key === 'Enter'){
      sendTextMsg()
    }
  }

  async function sendTextMsg(){

    const input = $input.current
    if ( input.value == '' ) return

    let params = {
      'from': cookies.get('uid'),
      'createTime': Date.now(),
      'cmd':11,
      'group_id': currentChirp.id,
      'chatType':'1',
      'msgType':'0',
      'content': xss(input.value)
    }
    let index = chirpMessage.length
    let chirpId = currentChirp.id
    input.value = ''
    params.sending = true
    params.fromName = userName
    dispatch( sendMsg( { type: 'msg', index, chirpId, data: params } ) )
    await api.sendMessage(params).then((res)=>{
      if( !res.error && res.code == 10000){
        dispatch( sendMsgSuccess( { type: 'msg', index, chirpId } ) )
      }else{
        throw new Error('send message fail')
      }
    }).catch((error)=>{
      console.error(error)
    })
  }
  function handleClickUpload(visible) {
    setuploadVisiable(visible)
  }
  function Upload() {
    return (
      <UploadBox>
        <div onClick={ selectFile } >Upload File</div>
        <div onClick={ selectPhotos } >Upload Image</div>
      </UploadBox>
    )
  }

  return(
    <MessegeBox>
      <Dropdown
        overlay={<Upload  />}
        placement="topLeft"
        visible={ uploadVisiable }
        trigger={ ['click'] }
        onVisibleChange={ handleClickUpload }
      >
        <Icon type="upload" style={{marginLeft:'8px'} }  onClick={ ()=>{ setuploadVisiable(!uploadVisiable) } } ></Icon>
      </Dropdown>
      <Dropdown overlay={<Picker onSelect={addEmoji} />} placement="topLeft" trigger={ ['click'] }>
        <Icon type="smile" ></Icon>
      </Dropdown>

      <input
        className='ant-input'
        ref = { $input }
        placeholder='Press Enter to send messege'
        onKeyDown={handleSendMessage}
        // onChange = {handleMessageChange}
      ></input>
    </MessegeBox>
  )
}
