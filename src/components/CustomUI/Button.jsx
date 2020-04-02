import React,{ Component } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

const PrimaryButton = styled(Button)`
  &&{
      width: 120px;
      height: 44px;
      font-weight: 600;
      box-shadow: 1px 4px 12px 0 rgba(75,157,11,0.3);
      margin-right: 24px;
      span{
        font-size: 0.9rem;
      }
  }
`
const NormalButton = styled(PrimaryButton)`
&&{
  background-color: #fff;
  color: rgb(75,157,11);
  border: rgb(75,157,11) 2px solid;
  box-shadow: unset;
}
`

export default class AppButton extends Component{
  render(){
    return(
      this.props.type == 'normal' ?  <NormalButton {...this.props} >{this.props.children}</NormalButton>
        : <PrimaryButton {...this.props}>{this.props.children}</PrimaryButton>
    )
  }
}
