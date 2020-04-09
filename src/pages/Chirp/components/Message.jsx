import React  from 'react'
import styled from 'styled-components'
import { thumbnail } from '@/utils/fileHandle'
import {formatTime} from '@utils/tool'
import {Avatar, Col, Row } from 'antd'
import { Loading } from '@components'
import emojify  from 'emojify.js'
import 'emojify.js/dist/css/sprites/emojify.css'
import imgError from '@assets/img/imgerror.jpg'
emojify.setConfig({tag_type : 'span', mode: 'sprite' })

const ChatItem = styled.div`
  padding:16px;
  position: relative;
  overflow:hidden;
  border-bottom: 2px solid #ebedf0;
  .info{
    position: relative;
  }
  p{
    font-size:17px;
    margin-bottom: 0;
    overflow-wrap: break-word;
  }
  &.self{
    .avatar{
      float: right;
    }
    .info{
      float: right;
      text-align: right;
      margin-right: 8px;
      .sendtime{
        transform-origin: right;
      }
      &:after{
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
      }
    }
    .photo-box{
      justify-content: flex-end;
    }
    p{
      float: right;
      margin-bottom: 0;
      clear:both;
    }
    &:after{
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
  }
`
const fontSize =14
const UserInfo = styled.div`
  overflow: hidden;
  .username{
    display: block;
    font-size: 14px;
    color: #000;
    font-weight: 600;
  }
  .sendtime{
    display:block;
    font-size: ${fontSize}px;
    transform: scale(${10/fontSize});
    color: rgba(0,0,0,0.5);
    transform-origin: 0 0;
  }
`

const PhotoBox = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .more{
    div{
      width: 180px;
      height: 180px;
      border: 1px solid #D8DBE2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #607585;
      font-size: 16px;
      letter-spacing: -0.38px;
    }
  }
`

const PhotoItem = styled.div`
  vertical-align: top;
  width: 178px;
  height: 178px;
  max-width: 31%;
  display: inline-block;
  margin: 0.5rem 0 0 0.5rem;
  position: relative;
  overflow: hidden;
  @media (max-width: 620px){
    width: 140px;
    height: 140px;
  }
  @media (max-width: 450px){
    width: 100px;
    height: 100px;
  }
  @media (max-width: 350px){
    width: 90px;
    height: 90px;
  }
  img{
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

export default function MessageComponent(props) {
  const { isSelf, msgType, fileList, fromName, createTime, content, showBigImg } = props

  function handleImgError(e) {
    e.target.onerror = null
    e.target.src = imgError
  }

  function renderContent() {
    switch (msgType) {
      case 0: {
        return (
          <p dangerouslySetInnerHTML={{__html:emojify.replace(content)}}></p>
        )
      }
      case 1:{
        return (
          <PhotoBox className='photo-box' >
            { fileList.filter(item =>{ return item }).map( ( imgObj, index ) =>{
              return (
                <PhotoItem span={4}
                  key={index}
                  onClick={ showBigImg.bind( this, imgObj.imgUrl ) }
                >
                  <img src={ imgObj.imgUrl }
                    width={ thumbnail( imgObj.width, imgObj.height ).width }
                    height={ thumbnail( imgObj.width, imgObj.height ).height }
                    onError={ handleImgError }
                  />
                  { imgObj.status == 'sending' ? <Loading  /> : null }
                </PhotoItem>
              )
            } )}

          </PhotoBox>
        )
      }
      default:{
        return (
          <p>[不支持的消息类型]</p>
        )
      }
    }
  }

  return (
    <ChatItem className={ isSelf ? 'self' : null} >
      <UserInfo>
        <Avatar className='avatar' size={36} icon="user"></Avatar>
        <div  className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
          <span className='username'>{fromName}</span>
          <span className='sendtime' id='font-size10'>{formatTime(createTime)}</span>
        </div>
      </UserInfo>
      {/* {message.sending ? <Loading tip="sending..." /> : null } */}
      {renderContent()}
    </ChatItem>
  )

}
