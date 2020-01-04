import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout,Avatar,Dropdown,Menu } from 'antd'
import {  Button } from '@components'
import { connect } from 'react-redux'
import cookies from '@utils/cookies'
import { withRouter } from 'react-router-dom'
import api from '@api'
// import yueyiTTF from '@assets/yueyi.ttf'
import {Link} from 'react-router-dom'
import defaultAvatar from '@assets/icon/user.png'
import NProgress from 'nprogress'

const mapStateToProps = state => ({
  user: state.user
})

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

const  linkList = {
  home : { key: 'home' , to: '/chirpall'},
  signin : { key: 'signin' , to: '/signin'},
  signup : { key: 'signup' , to: '/signup'},
}
class AppLayout extends Component{
  onUserLinkSelect = item => {
    if (item.key === 'Log Out') {
      cookies.remove('userName')
      cookies.remove('password')
      cookies.remove('uid')
      NProgress.start()
      api.logout().then(() => {
        NProgress.done()
        this.props.history.push('/signin')
      })
    }
  }

  handleJump = (e)=>{
    let path = e.target.getAttribute('to')
    this.props.history.replace(path)
  }
  render(){
    const isLogin = cookies.get('userName') && this.props.user.data.firstName ? true : false
    const userName = isLogin && this.props.user.data.firstName + this.props.user.data.lastName
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
          <Logo to={linkList.home.to} onClick={this.handleJump}>Chirp</Logo>
          <Title>Chirps</Title>
          {
            isLogin ?
              <Dropdown overlay={DropdwonMenu}>
                <User>
                  <Avatar size={24} src={defaultAvatar} />
                  <span>{userName}</span>
                </User>
                {/* <DropdwonMenu></DropdwonMenu> */}
              </Dropdown>
              : <User>
                <Button to={linkList.signup.to} type="primary" onClick={this.handleJump}>Sign Up</Button>
                <Button to={linkList.signin.to} type="normal" onClick={this.handleJump}>Sign In</Button>
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

export default connect(mapStateToProps, null)(withRouter(AppLayout))
