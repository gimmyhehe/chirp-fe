import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout,Avatar,Dropdown,Menu } from 'antd'
import {  Button } from '@components'
// import yueyiTTF from '@assets/yueyi.ttf'
import {Link} from 'react-router-dom'
import defaultAvatar from '@assets/icon/user.png'
const { Header, Content } = Layout

const StyleLayout = styled(Layout)`
  background-color: rgb(250,249,255) !important;
  min-height: 100vh!important;
  min-width: 1000px;
`
const Logo = styled.div`
  font-size: 40px;
  letter-spacing: -0.96px;
  color: rgb(75,157,11);
  display: inline-block;
  height: 80px;
  line-height: 80px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`
const Title = styled.div`
  font-size: 16.8px;
  display: inline-block;
  color: #000;
  letter-spacing: -0.4px;
  height: 80px;
  line-height: 80px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  font-weight: 600;
`
const User = styled.div`
  float: right;
  font-size: 20px;
  cursor: default;
  height: 80px;
  display: flex;
  align-items: center;
  img{
    width: 24px;
    margin-right: 8px;
  }
  span{
    font-size: 14px;
    font-weight: 600;
  }
`
const userLinks = [
  {
    to: { pathname: '/user/settings', state: { fromState: 'accountSettings' } },
    text: 'Settings'
  },
  {
    to: { pathname: '/help', state: { fromState: 'help' } },
    text: 'Help'
  },
  {
    to: '#logout',
    text: 'Log Out'
  }
]

export default class AppLayout extends Component{
  render(){
    const isLogin = true

    const DropdwonMenu = (
      <Menu style={{ minWidth: 150 }}>
        {userLinks.map(({ to, text }) => (
          <Menu.Item key={text} onClick={this.onUserLinkSelect}>
            <Link to={to}>{text}</Link>
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <StyleLayout>
        <Header>
          <Logo>Chrip</Logo>
          <Title>Chirps</Title>
          {
            isLogin ?
              <Dropdown overlay={DropdwonMenu}>
                <User>
                  <Avatar size={24} src={defaultAvatar} />
                  <span>Olivia Wang</span>
                </User>
                {/* <DropdwonMenu></DropdwonMenu> */}
              </Dropdown>
              : <User>
                <Button type="primary">Sign Up</Button>
                <Button type="normal">Sign In</Button>
                <img src={defaultAvatar} alt=""/>
                <span>Anonymous</span>
              </User>
          }

        </Header>
        <Content>{this.props.children}</Content>
      </StyleLayout>
    )
  }

}
