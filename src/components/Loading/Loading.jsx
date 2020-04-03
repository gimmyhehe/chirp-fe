import React,{ Component } from 'react'
import { Spin, Icon  } from 'antd'
import styled from 'styled-components'

const LoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${ props=> props.mask === 'true' ? 'rgba(0,0,0,0.1)' : 'unset' };
`
const Loading = styled(Spin)`
&&{
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
`

export default class LoadingComponent extends Component{
  render(){
    return(
      <LoadingBox mask={ !this.props.mask ? 'true' : 'false' } >
        <Loading {...this.props} indicator={<Icon type="loading" style={{ fontSize: 30 }} spin />} />
      </LoadingBox>
    )
  }
}
