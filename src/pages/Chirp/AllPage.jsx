import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import { readDiskFile, thumbnail} from '../../utils/fileHandle'
import cookies from '@utils/cookies'
import {formatTime} from '@utils/tool'
import {Avatar,Col,Icon,Input,Row, message, Dropdown } from 'antd'
import Viewer from 'react-viewer'
import { Loading } from '@components'
import { connect } from 'react-redux'
import { sendMsg, sendMsgSuccess, sendImg } from '@actions/chirps'
import imgError from '@assets/img/imgerror.jpg'
import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart'
import emojify  from 'emojify.js'
import 'emojify.js/dist/css/sprites/emojify.css'
import xss from '@utils/xss'
emojify.setConfig({tag_type : 'span', mode: 'sprite' })
const AllContnet = styled.div`
  width: 100%;
  height: 100%;
`

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


class AllPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      message: null,
      chirpName: null,
      hasPassword: false,
      chirpPassword: null,
      visible: false,
      imgUrl: ''
    }
    this.content = React.createRef()
    this.input = React.createRef()
  }
  insertAtCursor = (value)=> {
    const { input, props} = this.input.current
    if (input.selectionStart || input.selectionStart === 0) {
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      const restoreTop = input.scrollTop

      let newMessage = props.value.substring(0, startPos)
            + value
            + props.value.substring(endPos, props.value.length)
      this.setState({message: newMessage})
      if (restoreTop > 0) {
        input.scrollTop = restoreTop
      }
      input.focus()
      input.selectionStart = startPos + value.length
      input.selectionEnd = startPos + value.length
    } else {
      let newMessage = props.value + value
      this.setState({message: newMessage})
      input.focus()
    }
  }
  handleMessageChange = (e) =>{
    this.setState({message:e.target.value})
  }
  addEmoji(a,b){
    console.log(a,b)
  }
  componentDidUpdate() {
    if(this.content.current.scrollHeight > this.content.current.clientHeight) {
      //设置滚动条到最底部
      this.content.current.scrollTop = this.content.current.scrollHeight
    }

  }
  handleSendMessage = async (e) =>{
    if (e.key === 'Tab') {
      e.preventDefault()
    }else if(e.key === 'Enter' && this.state.message!=null){
      let params = {
        'from': cookies.get('uid'),
        'createTime': Date.now(),
        'cmd':11,
        'group_id': this.props.currentChirp.id,
        'chatType':'1',
        'msgType':'0',
        'content': xss(this.state.message)
      }
      let index = this.props.chirpMessage.length
      let chirpId = this.props.currentChirp.id
      this.setState({message:null})
      params.sending = true
      let userName = this.props.user.userName
      params.fromName = userName
      this.props.sendMsg({type:'msg',index,chirpId,data:params})
      await api.sendMessage(params).then((res)=>{
        if(res.code == 10000){
          this.props.sendMsgSuccess({type:'msg',index,chirpId})
        }else{
          throw new Error('send message fail')
        }
      }).catch((error)=>{
        console.error(error)
      })
    }
  }
  handleEmoji =()=>{
    this.insertAtCursor(':+1:')
  }
  handleImgError = (e)=>{
    e.target.onerror = null
    e.target.src = imgError
  }
 uploadFile = async () => {
   if(this.props.currentChirp.uploadPermissionEnabled != 1){
     message.warn('sorry this chirp does not open the upload permission')
     return false
   }
   let filesList = await readDiskFile({ fileType: 'image' })
   if (!filesList || filesList.length==0) return
   filesList.forEach(fileObj => {
     if(!fileObj) return
     //  this.doRealUpload(fileObj)
     this.props.sendImg(fileObj)
   })

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
          {message.sending ?
            <Loading tip="sending..." /> : null }
          {message.fileList ?
            <PhotoBox
              style={{justifyContent: 'flex-end'}}
              gutter={10}
              onClick={ this.showBigImg.bind(this,message.fileList[0].imgUrl) }
            >
              <Col className="gutter-row" span={4}>
                <img src={message.fileList[0].imgUrl}
                  width={ thumbnail(message.fileList[0].width,message.fileList[0].height).width }
                  height={ thumbnail(message.fileList[0].width,message.fileList[0].height).height }
                  onError={this.handleImgError}
                />
                { message.fileList[0].status == 'sending' ? <Loading  /> : null }
              </Col>
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
              onClick={ this.showBigImg.bind(this,message.fileList[0].imgUrl) }
            >
              <Col className="gutter-row" span={4}>
                <img src={message.fileList[0].imgUrl}
                  width={ thumbnail(message.fileList[0].width,message.fileList[0].height).width }
                  height={ thumbnail(message.fileList[0].width,message.fileList[0].height).height }
                  onError={this.handleImgError}
                />
              </Col>
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
        <ChirpContent ref ={this.content}>
          <Viewer
            visible={this.state.visible}
            onClose={() => { this.setState({ visible: false }) } }
            images={[{src: this.state.imgUrl, alt: ''}]}
          />
          { chirpMessage.map((message,index)=> this.renderMessage(message,index) )}

        </ChirpContent>


        <MessegeBox>
          <Icon type="upload" style={{marginLeft:'8px'} } onClick={this.uploadFile}></Icon>
          <Icon type="smile"  ></Icon>
          {/* <Dropdown overlay={<Picker onSelect={this.addEmoji} />} placement="topRight">

          </Dropdown> */}

          <Input
            ref={this.input}
            placeholder='Press Enter to send messege'
            value = {this.state.message}
            onKeyDown={this.handleSendMessage}
            onChange = {this.handleMessageChange}
          ></Input>
        </MessegeBox>
      </AllContnet>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { sendMsg ,sendMsgSuccess, sendImg})(AllPage)
