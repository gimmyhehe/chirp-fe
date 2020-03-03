import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import pdfIcon from '@assets/icon/pdf.png'

const FileBox = styled.div`
  border: 1px solid #D8DBE2;
  margin-top: 10px;
  width: 240px;
  height: 64px;
  padding:8px;
  .filelogo{
    display:inline-block;
    background: url(${pdfIcon}) no-repeat;
    width: 40px;
    height: 48px;
    background-size: cover;
    vertical-align: middle;
  }
  span{
    font-size: 16px;
    letter-spacing: 0.28px;
    font-weight: 600;
    margin-left:16px;
  }
`

class FilePage extends Component{
  constructor(props){
    super(props)
    this.state = {
      chirpName: null,
      hasPassword: false,
      chirpPassword: null
    }
  }

  render(){
    return (
      <div>
        <FileBox>
          <div className='filelogo'></div>
          <span>abc.pdf</span>
        </FileBox>
      </div>
    )
  }
}


export default connect(null, {getChirpList})(FilePage)
