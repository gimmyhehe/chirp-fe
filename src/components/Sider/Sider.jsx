import React,{ Component } from 'react'
import styled from 'styled-components'
import { Layout, Menu, Icon } from 'antd'
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

export default class AppSider extends Component{
  render(){
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
          <Menu.Item key="1">
            <span className="nav-text">My First Chirp</span>
          </Menu.Item>
          <Menu.Item key="2">
            <span className="nav-text">UI Meeting</span>
          </Menu.Item>
          <Menu.Item key="3">
            <span className="nav-text">Hiking Group</span>
          </Menu.Item>
        </Menu>
      </CustomSider>
    )
  }
}
