import React,{ Component } from 'react'
import styled from 'styled-components'
import {AppSider} from '@components'
import { connect } from 'react-redux'
import { Layout, Tabs,Input,Popover,Modal,message } from 'antd'
import {  Button } from '@components'
import cookies from '@utils/cookies'
import AllContnet from './AllPage'
import PhotoContent from './PhotoPage'
// import VideoContent from './VideoPage'
// import FileContent from './FilePage'
import ChirpSettingForm from '../ChirpSetting/ChirpSettingForm'
import ShareIcon from '@assets/icon/share.png'
import SettingsIcon from '@assets/icon/settings.png'

const { TabPane } = Tabs
const CustomLayout = styled(Layout)`
  &.ant-layout{
    padding: 24px 24px 0 24px;
    background: unset;
    position: relative;
    .ant-tabs{
      width: 1168px;
      min-width: 800px;
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
        position: absolute;
        padding: 0 1px 4px;
        min-width: 800px;
        top:70px;
        bottom:0;
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
  padding: 20px 32px;
  overflow: hidden;
  .chirp-link{
    font-size: 16px;
    display: block;
    color: #4b9d0b;
    margin-bottom: 16px;
  }
  .link-share{
    font-size: 20px;
    letter-spacing: 0.35px;
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
  handleSettings = (chirp) =>{
    if(cookies.get('uid') !=  chirp.hostUid){
      message.warn('you are not the owner of this chirp')
    }
  }
  state = {
    settingPermission: false,
    messageList: [],
    activeKey: 1
  }
  hide = () => {
    this.setState({
      visible: false,
    })
  };
  componentDidMount(){
    if(cookies.get('uid')){
      this.setState({isLogin:true})
    }else{
      this.setState({isLogin:false})
      Modal.info({
        title: 'No permission',
        content: (
          <div>
            <p>you should login first!</p>
          </div>
        ),
        onOk: ()=> {
          this.props.history.replace('/signin')
        },
      })
    }
  }
  render(){
    const chirps = this.props.chirps
    const {allChirpsMessage,currentChirp,chirpsPhoto} = chirps
    var chirpSetting={},chirpMessage=[]
    if(currentChirp){
      chirpSetting ={
        expirationDay: (currentChirp.expiredDate - currentChirp.createTime) / 24*60*60,
        pwdChecked: !!currentChirp.passwordEnabled,
        uploadPermission: !!currentChirp.uploadPermissionEnabled,
        password: ''
      }
      if(JSON.stringify(allChirpsMessage)!='{}'){
        chirpMessage = allChirpsMessage[currentChirp.id]
        chirpMessage.forEach(element => {
          if(element.from == cookies.get('uid')){
            element.isSelf = true
          }else{
            element.isSelf = false
          }
        })
      }
    }
    var ShareContent = () =>{
      return(
        <ShareBox>
          <h3 className='link-share'>Public Share Link</h3>
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
          <span>{currentChirp.name}</span>
          <Popover
            placement="bottomRight"
            content={<ShareContent />}
            trigger="click"
          >
            <Share onClick={this.handleShare}></Share>
          </Popover>
          <Popover
            placement="bottomRight"
            content={  cookies.get('uid') ==  currentChirp.hostUid ? <ChirpSettingForm {...this.props.chirps} chirpSetting = {chirpSetting} /> : null}
            trigger="click"
          >
            <Settings onClick={this.handleSettings.bind(this,currentChirp)}></Settings>
          </Popover>

        </Rightbox>
      )
    }
    return(
      <div>
        <CustomLayout>
          {!this.state.isLogin ? <div></div> : <AppSider></AppSider> }
          {
            !cookies.get('uid') || currentChirp == null ? null :
              <CustomTab tabBarExtraContent={<TabBarExtraContent/>} onChange={(activeKey)=>{this.setState({activeKey})}}>
                <TabPane tab="All" key="1">
                  <AllContnet
                    chirpMessage ={chirpMessage}
                    currentChirp = {currentChirp}
                    tabInfo = {{key : 2 ,activeKey : this.state.activeKey}}
                  />
                </TabPane>
                <TabPane tab="Photo" key="2">
                  <PhotoContent
                    photoList ={chirpsPhoto[currentChirp.id]}
                    currentChirp = {currentChirp}
                    tabInfo = {{key : 2 ,activeKey : this.state.activeKey}} />
                </TabPane>
                {/* <TabPane tab="Video" key="3">
                  <VideoContent />
                </TabPane>
                <TabPane tab="File" key="4">
                  <FileContent />
                </TabPane> */}
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
