import React,{ Component } from 'react'
import styled from 'styled-components'
import {AppSider} from '@components'
import { connect } from 'react-redux'
import { Layout, Tabs,Input,Popover } from 'antd'
import {  Button } from '@components'
import cookies from '@utils/cookies'
import AllContnet from './AllPage'
import PhotoContent from './PhotoPage'
import VideoContent from './VideoPage'
import FileContent from './FilePage'
import ChirpSettingForm from '../ChirpSetting/ChirpSettingForm'
import ShareIcon from '@assets/icon/share.png'
import SettingsIcon from '@assets/icon/settings.png'

const { TabPane } = Tabs
const CustomLayout = styled(Layout)`
  &.ant-layout{
    padding: 24px;
    background: unset;
    position: relative;
    .ant-tabs{
      width: 1168px;
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
      }
      .ant-layout-content{
        margin-top: 0;
      }
      .ant-tabs-tab{
        background: unset;
        line-height: initial!important;
        font-size: 20px;
        letter-spacing: -0.48px;
        display: inline-block;
        width: initial;
      }
      .ant-tabs-top-bar{
        border-bottom: none;
      }
      .ant-tabs-content{
        position: relative;
        padding: 0 1px 4px;
        height: 92%;
      }
      .ant-tabs-tabpane{
        background-color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
        height: 100%;
        width: 100%;
      }
    }
  }
`
const CustomTab = styled(Tabs)`

`


const Rightbox = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  line-height: unset;
  z-index: 9;
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
    messageList: [
      {
        from: 'aaa',
        content:'Hi there! 👋🏼',
        createTime: 1579107542,
        msgType: 0,
        isSelf: false
      }
    ]
  }
  hide = () => {
    this.setState({
      visible: false,
    })
  };

  render(){
    const chirps = this.props.chirps
    var chirpMessage =[]
    if(chirps.allChirpsMessage.length!=0 && chirps.currentChirp && chirps.currentChirp.id){
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
    var TabBarExtraContent = () =>{
      return(
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
      )
    }
    var defaultSetting  = chirps.currentChirp ? chirps.currentChirp : {passwordEnabled:false,uploadPermissionEnabled:false}
    const chirpSetting ={
      expirationDay: 3,
      pwdChecked: +defaultSetting.passwordEnabled,
      uploadPermission: +defaultSetting.uploadPermissionEnabled,
      password: '123'
    }
    console.log(chirps.currentChirp)
    return(
      <div>
        <CustomLayout>
          <AppSider></AppSider>
          {
            chirps.currentChirp == null ? null :
              <CustomTab tabBarExtraContent={<TabBarExtraContent/>}>
                <TabPane tab="All" key="1">
                  <AllContnet chirpMessage ={chirpMessage} currentChirp = {this.props.chirps.currentChirp}/>
                </TabPane>
                <TabPane tab="Photo" key="2">
                  <PhotoContent chirpMessage ={chirpMessage} />
                </TabPane>
                <TabPane tab="Video" key="3">
                  <VideoContent />
                </TabPane>
                <TabPane tab="File" key="4">
                  <FileContent />
                </TabPane>
              </CustomTab>
          }
        </CustomLayout>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  chirps: state.chirps
})

export default connect(mapStateToProps, null)(ChirpAll)
