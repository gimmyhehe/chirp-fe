import React,{ Component } from 'react'
import styled from 'styled-components'
import { getParams } from '@utils/tool'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import ChirpSettingFrom from './ChirpSettingForm'
import { Form   } from 'antd'


const Title = styled.h1`
  font-size: 1.8rem;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
`


class ChirpSetting extends Component{

  render(){
    return(
      <div className='center-box'>
        <Title>Chirp Setting</Title>
        <ChirpSettingFrom operation ='create' history={this.props.history} chirpName={ getParams(this.props.location.search).chirpName } />
      </div>
    )
  }
}

export default connect(null, {getChirpList})(Form.create()(ChirpSetting))
