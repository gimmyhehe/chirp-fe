import React,{ Component } from 'react'
import styled from 'styled-components'
const LoadingCircle = styled.div`
  font-size: 5px;
  text-indent: -9999em;
  width: 10em;
  height: 10em;
  border-radius: 50%;
  /* 线性渐变，从左到右，从白色到透明，0％代表起点和100％是终点 */
  background: linear-gradient(to right, #ccc 10%, rgba(204, 204,204, 0) 42%);
  position: relative;
  animation: load3 1.4s infinite linear;


  &:before,
  &::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
  }
  &:before {
    width: 50%;
    height: 50%;
    background: #ccc;
    border-radius: 100% 0 0 0;
  }
  &:after {
    background: #fff;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    margin: auto;
    bottom: 0;
    right: 0;
  }
  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

`

export default class Loading extends Component{
  render(){
    return(
      <LoadingCircle style={this.props.customStyle}></LoadingCircle>
    )
  }
}
