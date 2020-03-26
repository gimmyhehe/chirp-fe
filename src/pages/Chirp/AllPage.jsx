import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import { get_filemd5sum, readDiskFile, thumbnail} from '../../utils/fileHandle'
import cookies from '@utils/cookies'
import {formatTime} from '@utils/tool'
import {Avatar,Col,Icon,Input,Row, message } from 'antd'
import { connect } from 'react-redux'
import { sendMsg, sendMsgSuccess } from '@actions/chirps'
import {Loading} from '@components'
import imgError from '@assets/img/imgerror.jpg'
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
  height: 92%;
`

const ChatItem = styled.div`
  padding:16px;
  position: relative;
  border-bottom: 2px solid #ebedf0;
  p{
    font-size:17px;
  }
`
const SelfChatItem = styled(ChatItem)`
  overflow:hidden;
  .avatar{
    float: right;
  }
  .info{
    float: right;
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
    transform: scale(${10/fontSize}) translate(${-(1-10/fontSize)/2*100}%,${-(1-10/fontSize)/2*100}%);
    color: rgba(0,0,0,0.5);
  }
`

const PhotoBox = styled(Row)`
  padding: 16px;
  display: flex;
  .ant-col{
    overflow: hidden;
    width: 190px;
    height: 180px;
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
      showImg: false,
      message: null,
      chirpName: null,
      hasPassword: false,
      chirpPassword: null,
    }
    this.content = React.createRef()
  }

  handleMessageChange = (e) =>{
    this.setState({message:e.target.value})
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
        'createTime': Math.ceil(Date.now() / 1000),
        'cmd':11,
        'group_id': this.props.currentChirp.id,
        'chatType':'1',
        'msgType':'0',
        'content': this.state.message
      }
      let index = this.props.chirpMessage.length
      let chirpId = this.props.currentChirp.id
      this.setState({message:null})
      params.sending = true
      let { firstName,lastName } = this.props.user.data
      params.fromName = firstName+lastName
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
   let fileResult = await readDiskFile({ fileType: 'image' })
   this.doRealUpload(fileResult)
 }
  doRealUpload = async (fileResult) =>{
    if(!fileResult) return
    const { file, imgUrl, width, height } = fileResult
    let params = {
      'from': cookies.get('uid'),
      'createTime': Math.ceil(Date.now() / 1000),
      'cmd':11,
      'group_id': this.props.currentChirp.id,
      'chatType':'1',
      'msgType':'1',
      'content': '',
      fileList: [{ imgUrl, width, height }]
    }
    let index = this.props.chirpMessage.length
    let chirpId = this.props.currentChirp.id
    params.sending = true
    let { firstName,lastName } = this.props.user.data
    params.fromName = firstName+lastName
    this.props.sendMsg({type:'img',index,chirpId,data:params})
    var formData = new FormData()
    formData.append('chirpId',this.props.currentChirp.id)
    formData.append('userId',cookies.get('uid'))
    formData.append('fileName',file.name)
    var md5Str =  await get_filemd5sum(file)
    formData.append('md5',md5Str)
    formData.append('file',file)
    var result
    await api.upload(formData)
      .then(res=>{
        result = res
        URL.revokeObjectURL(fileResult.imgUrl)
      })
      .catch(err=>{
        message.error('upload fail!')
        console.error(err)
      })
    let imgObj = { imgUrl: result.data, width, height }
    params.fileList = [imgObj]
    api.sendMessage(params).then((res)=>{
      if(res.code == 10000){
        this.props.sendMsgSuccess({type:'img',index,chirpId,imgObj})
      }else{
        throw new Error('send message fail')
      }
    }).catch((error)=>{
      console.error(error)
    })
  }
  render(){
    var chirpMessage = this.props.chirpMessage
    return (
      <AllContnet>
        <ChirpContent ref ={this.content}>
          { chirpMessage.map((message,index)=>{
            if (message.isSelf){
              return(
                <SelfChatItem key={index}>
                  <UserInfo>
                    <Avatar className='avatar' size={36} icon="user"></Avatar>
                    <div  className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                      <span className='username'>{message.fromName}</span>
                      <span className='sendtime' id='font-size10'>{formatTime(message.createTime*1000)}</span>
                    </div>
                  </UserInfo>
                  {message.sending ? <Loading customStyle ={{position: 'absolute',top:'32px',fontSize:'3px'}} /> : null}
                  {message.fileList ?
                    <PhotoBox style={{justifyContent: 'flex-end'}} gutter={10}>
                      <Col className="gutter-row" span={4}>
                        <img src={message.fileList[0].imgUrl}
                          width={message.fileList[0].width}
                          height={message.fileList[0].height}
                          onError={this.handleImgError}
                        />
                      </Col>
                    </PhotoBox>
                    :<p>{message.content}</p>}
                </SelfChatItem>
              )
            }else{
              return(

                <ChatItem key={index}>
                  <UserInfo>
                    <Avatar className='avatar' size={36} icon="user"></Avatar>
                    <div className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                      <span className='username'>{message.fromName}</span>
                      <span className='sendtime' id='font-size10'>{formatTime(message.createTime*1000)}</span>
                    </div>
                  </UserInfo>
                  {message.fileList ?
                    <PhotoBox gutter={10}>
                      <Col className="gutter-row" span={4}>
                        <img src={message.fileList[0].imgUrl}
                          width={message.fileList[0].width}
                          height={message.fileList[0].height}
                          onError={this.handleImgError}
                        />
                      </Col>
                    </PhotoBox>
                    :<p>{message.content}</p>}
                </ChatItem>
              )
            }

            //    <PhotoBox gutter={10}>
            //    <Col className="gutter-row" span={4}>
            //      <img src={message.fileList[0]}></img>
            //    </Col>
            //    <Col style={{position:'relative'}} className='more' span={4}>
            //      <div>
            //             +16 more
            //      </div>
            //    </Col>
            //  </PhotoBox>
          })}
          {
            this.state.showImg ?
              <PhotoBox gutter={10}>
                <Col className="gutter-row" span={4}>
                  <img src={this.state.imgSrc}></img>
                </Col>
              </PhotoBox>
              :null
          }
        </ChirpContent>
        <MessegeBox>
          <Icon type="upload" style={{marginLeft:'8px'} } onClick={this.uploadFile}></Icon>
          <input id="upload" type="file" accept="image/jpg,image/jpeg,image/png,image/PNG"  onChange={this.doRealUpload} style={{display: 'none'}} />
          <Icon type="smile" onClick={this.handleEmoji} ></Icon>
          <Input
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

export default connect(mapStateToProps, { sendMsg ,sendMsgSuccess})(AllPage)
