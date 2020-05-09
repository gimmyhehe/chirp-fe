import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout,Avatar,Dropdown,Menu } from 'antd'
import {  Button } from '@components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import api from '@api'
// import yueyiTTF from '@assets/yueyi.ttf'
import {Link} from 'react-router-dom'
import defaultAvatar from '@assets/icon/user.png'
import downArrow from '@assets/icon/down.png'
import NProgress from 'nprogress'

const mapStateToProps = state => ({
  user: state.user
})

const { Header, Content } = Layout

const StyleLayout = styled(Layout)`
  background-color: rgb(250,249,255) !important;
  min-height: 100vh!important;
`
const Logo = styled.div`
  font-size: 2rem;
  letter-spacing: -0.96px;
  color: rgb(75,157,11);
  display: inline-block;
  height: 4rem;
  line-height: 4rem;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`
const Title = styled.div`
  font-size: 0.8rem;
  display: inline-block;
  color: #000;
  letter-spacing: -0.4px;
  height: 4rem;
  line-height: 4rem;
  margin: 0 auto;
  font-weight: 600;
`
const HeaderRight = styled.div`
  font-size: 1rem;
  cursor: default;
  height: 4rem;
  display: flex;
  align-items: center;
  @media (max-width: 1000px){
    .l-screen{
      display: none;
    }
  }
  @media (min-width: 1000px){
    .s-screen{
      display: none;
    }
  }
  img{
    width: 1.2rem;
    margin-right: 8px;
  }
  span{
    font-size: 0.7rem;
    font-weight: 600;
  }
`
const User = styled.div`
span, .anticon-down{
  height: 1.2rem;
  line-height: 1.2rem;
  vertical-align: middle;
  display: inline-block;
}
.ant-avatar{
  width: 1.2rem;
  margin-right: 6px;
  font-size: 0.9rem;
}
`
const DownArrow = styled.span`
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  background-image: url(${downArrow});
  background-repeat: no-repeat;
  background-size: cover;
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
  home : { key: 'home' , to: '/chirpindex'},
  signin : { key: 'signin' , to: '/signin'},
  signup : { key: 'signup' , to: '/signup'},
}
const anonymousDropdown = ()=>(
  <Menu >
    <Menu.Item >
      <Link to='/signin'>signin</Link>
    </Menu.Item>
    <Menu.Item >
      <Link to='/signup'>signup</Link>
    </Menu.Item>
  </Menu>
)
class AppLayout extends Component{
  onUserLinkSelect = item => {
    if (item.key === 'Log Out') {
      NProgress.start()
      api.logout().then(() => {
        NProgress.done()
      }).catch((error)=>{ console.error(`logout error ${error}`) })
    }
  }

  handleJump = (e)=>{
    let path = e.target.getAttribute('to')
    this.props.history.replace(path)
  }
  render(){
    const userInfo = this.props.user
    const { userName, isLogin } = userInfo
    const DropdwonMenu = (
      <Menu >
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
            userName && isLogin ?
              <HeaderRight>
                <Dropdown overlay={DropdwonMenu} placement="bottomCenter" trigger={['click']}>
                  <User>
                    <Avatar src={defaultAvatar} />
                    <span>{userName}</span>
                    <DownArrow />
                  </User>
                </Dropdown>
              </HeaderRight>
              :
              <HeaderRight>
                <div className='l-screen'>
                  <Button to={linkList.signup.to} type="primary" onClick={this.handleJump}>Sign Up</Button>
                  <Button to={linkList.signin.to} type="normal" onClick={this.handleJump}>Sign In</Button>
                  <img src={defaultAvatar} alt=""/>
                  <span>Anonymous</span>
                </div>
                <Dropdown className='s-screen' overlay={anonymousDropdown} placement="bottomCenter" trigger={['click']}>
                  <User>
                    <Avatar src={defaultAvatar} />
                    <span>Anonymous</span>
                    <DownArrow />
                  </User>
                </Dropdown>
              </HeaderRight>
          }

        </Header>
        <Content>{this.props.children}</Content>
      </StyleLayout>
    )
  }

}

export default connect(mapStateToProps, null)(withRouter(AppLayout))
