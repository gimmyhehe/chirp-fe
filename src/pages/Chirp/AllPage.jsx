import React,{ Component } from 'react'
import styled from 'styled-components'
import {  thumbnail} from '../../utils/fileHandle'
import {formatTime} from '@utils/tool'
import {Avatar, Col, Row } from 'antd'
import Viewer from 'react-viewer'
import { Loading } from '@components'
import imgError from '@assets/img/imgerror.jpg'
import emojify  from 'emojify.js'
import 'emojify.js/dist/css/sprites/emojify.css'
import ChirpInput from './components/ChirpInput'
import { tuple } from 'antd/lib/_util/type'
emojify.setConfig({tag_type : 'span', mode: 'sprite' })
const AllContnet = styled.div`
  width: 100%;
  height: 100%;
`

const ChirpContent = styled.div`
  overflow-y: auto;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 56px;
`

const ChatItem = styled.div`
  padding:16px;
  position: relative;
  border-bottom: 2px solid #ebedf0;
  .info{
    position: relative;
  }
  p{
    font-size:17px;
    margin-bottom: 0;
    overflow-wrap: break-word;
  }
`
const SelfChatItem = styled(ChatItem)`
  overflow:hidden;
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

const PhotoBox = styled(Row)`
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  .ant-col{
    overflow: hidden;
    width: 190px;
    height: 180px;
    position: relative;
  }
  img{
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
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


export default class AllPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      message: null,
      chirpName: null,
      hasPassword: false,
      chirpPassword: null,
      visible: false,
      imgUrl: '',
      autoScroll: true
    }
    this.content = React.createRef()
  }

  throttle = function(cb,delay = 1000) {
    let timer = null
    return function() {
      if(!timer){
        timer = true
        setTimeout( ()=>{
          timer = false
          cb.call(this,arguments)
        }, delay )
      }
    }
  }

  handleScroll = ()=> {
    const { scrollTop, scrollHeight, clientHeight } = this.content.current
    //滚动条往上滚动300PX则新消息到达不会自动滚动到底部
    if( scrollTop + clientHeight  > scrollHeight - 300 && !this.state.autoScroll ){
      this.setState({ autoScroll: true })
    }else if( scrollTop + clientHeight <= scrollHeight - 300  && this.state.autoScroll ){
      this.setState({ autoScroll: false })
    }

  }
  componentDidUpdate() {
    if(this.content.current.scrollHeight > this.content.current.clientHeight && this.state.autoScroll) {
      //设置滚动条到最底部
      this.content.current.scrollTop = this.content.current.scrollHeight
    }

  }
  handleImgError = (e)=>{
    e.target.onerror = null
    e.target.src = imgError
  }

  showBigImg = function (imgUrl) {
    this.setState({ visible: true, imgUrl })
  }

  renderMessage = function (message, index) {
    if (message.isSelf){
      return(
        <SelfChatItem key={index}>
          <UserInfo>
            <Avatar className='avatar' size={36} icon="user"></Avatar>
            <div  className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
              <span className='username'>{message.fromName}</span>
              <span className='sendtime' id='font-size10'>{formatTime(message.createTime)}</span>
            </div>
          </UserInfo>
          {/* {message.sending ? <Loading tip="sending..." /> : null } */}
          {message.fileList ?
            <PhotoBox
              gutter={10}
            >
              { message.fileList.filter(item =>{ return item }).map( ( imgObj, index ) =>{
                return (
                  <Col className="gutter-row" span={4}
                    key={index}
                    onClick={ this.showBigImg.bind( this, imgObj.imgUrl ) }
                  >
                    <img src={ imgObj.imgUrl }
                      width={ thumbnail( imgObj.width, imgObj.height ).width }
                      height={ thumbnail( imgObj.width, imgObj.height ).height }
                      onError={ this.handleImgError }
                    />
                    { imgObj.status == 'sending' ? <Loading  /> : null }
                  </Col>
                )
              } )}

            </PhotoBox>
            :<p dangerouslySetInnerHTML={{__html:emojify.replace(message.content)}}></p>}
        </SelfChatItem>
      )
    }else{
      return(

        <ChatItem key={index}>
          <UserInfo>
            <Avatar className='avatar' size={36} icon="user"></Avatar>
            <div className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
              <span className='username'>{message.fromName}</span>
              <span className='sendtime' id='font-size10'>{formatTime(message.createTime)}</span>
            </div>
          </UserInfo>
          {message.fileList ?
            <PhotoBox
              gutter={10}
            >
              { message.fileList.filter(item =>{ return item }).map( ( imgObj, index ) =>{
                return (
                  <Col className="gutter-row" span={4}
                    key = { index }
                    onClick={ this.showBigImg.bind( this, imgObj.imgUrl ) }
                  >
                    <img src={ imgObj.imgUrl }
                      width={ thumbnail( imgObj.width, imgObj.height ).width }
                      height={ thumbnail( imgObj.width, imgObj.height ).height }
                      onError={ this.handleImgError }
                    />
                  </Col>
                )
              } )}

            </PhotoBox>
            :<p dangerouslySetInnerHTML={{__html:emojify.replace(message.content)}}></p>}
        </ChatItem>
      )
    }
  }

  render(){
    var chirpMessage = this.props.chirpMessage
    return (
      <AllContnet>
        <ChirpContent ref ={this.content} onScroll={ this.throttle.call(this,this.handleScroll) } >
          <Viewer
            visible={this.state.visible}
            onClose={() => { this.setState({ visible: false }) } }
            images={[{src: this.state.imgUrl, alt: ''}]}
          />
          { chirpMessage.map((message,index)=> this.renderMessage(message,index) )}

        </ChirpContent>

        <ChirpInput />

      </AllContnet>
    )
  }
}
