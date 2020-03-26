import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentChirp } from '@actions/chirps'
const {  Sider } = Layout

const CustomSider = styled(Sider)`

  &.ant-layout-sider{
    background-color: #fff;
    padding: 32px 24px 64px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
    height: min-content;
    .ant-layout-sider-zero-width-trigger{
      right: -16px;
      background: #489d0b;
    }
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
  handleJump = (e) =>{
    e.preventDefault()
    this.props.history.push('/chirpjoin')
  }
  handleClick = (e,chirp) =>{
    this.props.getCurrentChirp(chirp)
  }
  render(){
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
        {/* defaultSelectedKeys={['1']} */}
        <Menu theme="dark" mode="inline" >
          {
            this.props.chirps.chirpList ? this.props.chirps.chirpList.map((chirp,index)=>{
              return(
                <Menu.Item key={index+1} onClick={(e)=>{this.handleClick(e,chirp)}}>
                  <span className="nav-text">{chirp.name}</span>
                </Menu.Item>
              )
            }) : <NoChirp/>
          }
          <Menu.Item key='createorjoin'>
            <span className="nav-text" onClick={this.handleJump} style={{color:'#00f'}} >create/join</span>
          </Menu.Item>
        </Menu>
      </CustomSider>
    )
  }
}

const mapStateToProps = state => ({
  chirps: state.chirps
})

export default connect(mapStateToProps, {getCurrentChirp})(withRouter(AppSider))
