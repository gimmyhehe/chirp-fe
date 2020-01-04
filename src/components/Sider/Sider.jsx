import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout, Menu, Icon } from 'antd'
import cookies from '@utils/cookies'
import { withRouter } from 'react-router-dom'
import api from '@api'
const { Header, Content, Footer, Sider } = Layout

const CustomSider = styled(Sider)`

  &.ant-layout-sider{
    background-color: #fff;
    padding: 32px 24px 64px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
    height: min-content;
    &.ant-layout-sider-collapsed{
      padding:0;
    }
    .title{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 14px;
    }
    .ant-menu-item{
      padding: 0!important;
      margin: 0!important;
      &.ant-menu-item-selected{
        background-color: unset;
        .nav-text{
          color: #4b9d0b;
        }
      }
    }
    .ant-menu{
      background-color: #fff;
      .nav-text{
        color: #000;
        font-size: 14px;
      }
    }
  }

`

class AppSider extends Component{
  state={
    chirpList : [],
  }
  componentDidMount() {
    let params ={
      cmd: 25,
      memberId: cookies.get('uid')
    }
    cookies.get('userName') && api.getChirpList(params).then(res=>{
      if(res.code==10027){
        this.setState({chirpList:res.data})
      }
      console.log(res)
    })


  }
  getChirpList = async () =>{1
    let params ={
      cmd: 25,
      memberId: cookies.get('uid')
    }
    let res = await api.getChirpList(params)
    console.log(res)
  }
  handleJump = (e) =>{
    e.preventDefault()
    this.props.history.push('/chirpjoin')
  }

  render(){
    const chirpList = this.state.chirpList
    var NoChirp = ()=>(
      <Menu.Item key="1">
        <span className="nav-text">no chirp</span>
      </Menu.Item>
    )
    return(
      <CustomSider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <div className="title">Chirps</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          {
            chirpList ? chirpList.map((item,index)=>{
              return(
                <Menu.Item key={index+1}>
                  <span className="nav-text">{item.name}</span>
                </Menu.Item>
              )
            }) : <NoChirp/>
          }
          <Menu.Item key={chirpList.length+1}>
            <span className="nav-text" onClick={this.handleJump} style={{color:'#00f'}} >create/join</span>
          </Menu.Item>
        </Menu>
      </CustomSider>
    )
  }
}
export default withRouter(AppSider)
