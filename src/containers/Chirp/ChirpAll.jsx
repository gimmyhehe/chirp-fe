import React,{ Component } from 'react'
import styled from 'styled-components'
import {AppSider} from '@components'
import { Layout,Menu,Row, Col,Avatar,Icon,Input  } from 'antd'

import ShareIcon from '@assets/icon/share.png'
import SettingsIcon from '@assets/icon/settings.png'
import testImg from '@assets/icon/test.png'
import pdfIcon from '@assets/icon/pdf.png'
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


export default class ChirpAll extends Component{
  handleShare = () =>{
    alert(123)
  }
  handleSettings = () =>{
    alert(456)
  }
  render(){
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
                <span>My First Chirp</span>
                <Share onClick={this.handleShare}></Share>
                <Settings onClick={this.handleSettings}></Settings>
              </Rightbox>
            </Header>
            <ChirpContnet>
              <ChatItem>
                <UserInfo>
                  <Avatar size={36} icon="user"></Avatar>
                  <div style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                    <span className='username'>Mike</span>
                    <span className='sendtime' id='font-size10'>Sep 1, 2019</span>
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
              </ChatItem>
              <MessegeBox>
                <Icon type="upload" style={{marginLeft:'8px'} }></Icon>
                <Icon type="smile" ></Icon>
                <Input></Input>
              </MessegeBox>
            </ChirpContnet>
          </Layout>
        </CustomLayout>
      </div>
    )
  }
}
