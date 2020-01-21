import React,{ Component } from 'react'
import styled from 'styled-components'
import {AppSider} from '@components'
import api from '@api'
import { connect } from 'react-redux'
import { Layout,Menu,Row, Col,Avatar,Icon,Input,Popover } from 'antd'
import {  Button } from '@components'
import cookies from '@utils/cookies'
import ChirpSettingForm from '../ChirpSetting/ChirpSettingForm'
import ShareIcon from '@assets/icon/share.png'
import SettingsIcon from '@assets/icon/settings.png'
import testImg from '@assets/icon/test.png'
import pdfIcon from '@assets/icon/pdf.png'
import chirp from '../../api/chirp'
const { Header, Content } = Layout

const CustomLayout = styled(Layout)`
  &.ant-layout{
    padding: 24px;
    background: unset;
    position: relative;
    .inner-layout{
      position: relative;
      margin-left: 24px;
      background: unset;
      position: relative;
      height: 84vh;
      .ant-layout-header{
        position: absolute;
        background: unset;
        padding: 0;
        height: initial;
        box-shadow: unset;
        line-height: unset;
        .ant-menu{
          background: unset;
          border-bottom: none;
          line-height: initial!important;
          font-size: 20px;
          letter-spacing: -0.48px;
          display: inline-block;
          width: initial;
        }
      }
        .ant-layout-content{
          margin-top: 48px;
        }
    }
  }
`

const ChirpContnet = styled(Content)`
  &.ant-layout-content{
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
    position: absolute;
    height: 92%;
    width: 100%;
    min-width: 576px;
  }
`
const Rightbox = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  line-height: unset;
`
const Share = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  cursor: pointer;
  margin-left:18px;
  background: url(${ShareIcon});
  background-size: contain;
  vertical-align: middle;
`
const Settings = styled(Share)`
background-image: url(${SettingsIcon});
`
const fontSize =14
const UserInfo = styled.div`
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
const MessegeBox = styled.div`
  padding:12px;
  position: absolute;
  width: 100%;
  bottom: 0;
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
const ChatItem = styled.div`
  padding:16px;
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


const PhotoBox = styled(Row)`
  .ant-col{
    overflow: hidden;
  }
  .more{
    div{
      height: 312px;
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
const FileBox = styled.div`
  border: 1px solid #D8DBE2;
  margin-top: 10px;
  width: 240px;
  height: 64px;
  padding:8px;
  .filelogo{
    display:inline-block;
    background: url(${pdfIcon}) no-repeat;
    width: 40px;
    height: 48px;
    background-size: cover;
    vertical-align: middle;
  }
  span{
    font-size: 16px;
    letter-spacing: 0.28px;
    font-weight: 600;
    margin-left:16px;
  }
`
const ShareBox = styled.div`
  .chirp-link{
    font-size: 16px;
    display: block;
    color: #4b9d0b;
    margin-bottom: 16px;
  }
  .email-share{
    border-top: 2px solid #ebedf0;
    font-size: 20px;
    letter-spacing: 0.35px;
    margin-top: 24px;
    padding-top: 20px;
  }
  .invite-btn{
    margin-top: 24px;
  }
`

class ChirpAll extends Component{
  handleShare = () =>{

  }
  handleSettings = () =>{

  }
  state = {
    message: null,
    messageList: [
      {
        from: 'aaa',
        content:'Hi there! 👋🏼',
        createTime: 1579107542,
        msgType: 0,
        isSelf: false
      },
      {
        from: 'aaa',
        content:'123431',
        createTime: 1579107542,
        msgType: 0,
        isSelf: false
      },
      {
        from: 'self',
        content:'hi this is my message!',
        createTime: 1579107542,
        msgType: 0,
        isSelf: true
      },
      {
        from: 'aaa',
        content:'123431',
        createTime: 1579107542,
        msgType: 0,
        isSelf: false
      },
    ]
  }
  hide = () => {
    this.setState({
      visible: false,
    })
  };
  handleMessageChange = (e) =>{
    this.setState({message:e.target.value})
  }
  handleSend = async (e) =>{
    let params = {
      'from': cookies.get('uid'),
      'createTime': Math.ceil(Date.now() / 1000),
      'cmd':11,
      'group_id': this.props.chirps.currentChirp.id,
      'chatType':'1',
      'msgType':'0',
      'content': this.state.message
    }
    this.setState({message:null})
    let res = await api.sendMessage(params)
    console.log(res)
  }
  render(){
    const chirps = this.props.chirps
    var chirpMessage =[]
    if(chirps.allChirpsMessage.length!=0 && chirps.currentChirp){
      chirpMessage = chirps.allChirpsMessage[chirps.currentChirp.id]
      chirpMessage.forEach(element => {
        if(element.from == cookies.get('uid')){
          element.isSelf = true
        }else{
          element.isSelf = false
        }
      })
    }
    var ShareContent = () =>{
      return(
        <ShareBox>
          <span className='chirp-link'>https://chirp.com/myfirstchirp</span>
          <Button style={{width:'160px',height:'44px'}} type='primary'>Copy Link</Button>
          <h3 className='email-share'>Invite People By Email</h3>
          <Input
            style={{width: '360px',height:'44px'}}
            placeholder="type email here…"
          ></Input>
          <Button className='invite-btn' style={{width:'160px',height:'44px'}} type='normal'>Send Invite</Button>
        </ShareBox>

      )
    }
    const chirpSetting ={
      expirationDay: 3,
      pwdChecked: +chirps.currentChirp.passwordEnabled,
      uploadPermission: +chirps.currentChirp.uploadPermissionEnabled,
      password: '123'
    }
    console.log(chirpSetting)
    return(
      <div>
        <CustomLayout>
          <AppSider></AppSider>
          <Layout className='inner-layout'>
            <Header>
              <Menu
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1">All</Menu.Item>
                <Menu.Item key="2">Photo</Menu.Item>
                <Menu.Item key="3">Video</Menu.Item>
                <Menu.Item key="4">File</Menu.Item>
              </Menu>
              <Rightbox>
                <span>{this.props.chirps.currentChirp && this.props.chirps.currentChirp.name}</span>
                <Popover
                  placement="bottomRight"
                  content={<ShareContent />}
                  title="Public Share Link"
                  trigger="click"
                >
                  <Share onClick={this.handleShare}></Share>
                </Popover>
                <Popover
                  placement="bottomRight"
                  content={<ChirpSettingForm chirpSetting = {chirpSetting} />}
                  trigger="click"
                >
                  <Settings onClick={this.handleSettings}></Settings>
                </Popover>

              </Rightbox>
            </Header>
            <ChirpContnet>
              { chirpMessage.map((message,index)=>{
                if (message.isSelf){
                  return(
                    <SelfChatItem key={index}>
                      <UserInfo>
                        <Avatar className='avatar' size={36} icon="user"></Avatar>
                        <div  className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                          <span className='username'>{message.fromName}</span>
                          <span className='sendtime' id='font-size10'>{message.createTime}</span>
                        </div>
                      </UserInfo>
                      <p>{message.content}</p>
                    </SelfChatItem>
                  )
                }else{
                  return(
                    <ChatItem key={index}>
                      <UserInfo>
                        <Avatar className='avatar' size={36} icon="user"></Avatar>
                        <div className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                          <span className='username'>{message.fromName}</span>
                          <span className='sendtime' id='font-size10'>{message.createTime}</span>
                        </div>
                      </UserInfo>
                      <p>{message.content}</p>
                    </ChatItem>
                  )
                }

              })}
              {/* <ChatItem>
                    <UserInfo>
                      <Avatar size={36} icon="user"></Avatar>
                      <div style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                        <span className='username'>{message.from}</span>
                        <span className='sendtime' id='font-size10'>{message.createTime}</span>
                      </div>
                    </UserInfo>
                    <p>Hi there! 👋🏼</p>
                    <p>Thanks for being here, feel free to share any document about this event! 😄</p>
                    <PhotoBox gutter={10}>
                      <Col className="gutter-row" span={4}>
                        <img src={testImg}></img>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <img src={testImg}></img>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <img src={testImg}></img>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <img src={testImg}></img>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <img src={testImg}></img>
                      </Col>
                      <Col style={{position:'relative'}} className='more' span={4}>
                        <div>
                          +16 more
                        </div>
                      </Col>
                    </PhotoBox>
                    <FileBox>
                      <div className='filelogo'></div>
                      <span>abc.pdf</span>
                    </FileBox>
                  </ChatItem> */}
              <MessegeBox>
                <Icon type="upload" style={{marginLeft:'8px'} } onClick={this.getChirpList}></Icon>
                <Icon type="smile" onClick={this.handleSend}></Icon>
                <Input
                  placeholder='Press Enter to send messege'
                  value = {this.state.message}
                  onPressEnter={this.handleSend}
                  onChange = {this.handleMessageChange}
                ></Input>
              </MessegeBox>
            </ChirpContnet>
          </Layout>
        </CustomLayout>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  chirps: state.chirps
})

export default connect(mapStateToProps, null)(ChirpAll)
