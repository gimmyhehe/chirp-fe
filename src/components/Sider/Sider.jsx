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
    padding: 32px 0 64px 24px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
    height: min-content;
    max-height: 85%;
    .ant-layout-sider-children{
      height: 100%;
      overflow-y: auto;
    }
    @media (max-width: 700px){
      position: absolute;
      z-index: 10;
      max-height: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
    }
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
      .nav-text.select-chirp{
        color: #4b9d0b;
      }
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
    return(
      <CustomSider
        breakpoint="md"
        collapsedWidth="0"
        width={200}
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <div className="title">Chirps</div>

        <Menu theme="dark" mode="inline"
          defaultSelectedKeys= {[`${this.props.currentChirpId}`]}
        >
          {
            this.props.chirpList.map(( chirp )=>{
              return(
                <Menu.Item key={chirp.id} onClick={(e)=>{this.handleClick(e,chirp)}}>
                  <span
                    className={ this.props.currentChirpId == chirp.id ? 'select-chirp nav-text' : 'nav-text' }
                  >{chirp.name}</span>
                </Menu.Item>
              )
            })
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
  chirpList: state.chirps.chirpList ? state.chirps.chirpList : [],
  currentChirpId: state.chirps.currentChirp ? state.chirps.currentChirp.id : null
})

export default connect(mapStateToProps, {getCurrentChirp})(withRouter(AppSider))
