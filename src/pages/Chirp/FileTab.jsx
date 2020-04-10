import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import FileItem from './components/FileMessageItem'

const FileBox = styled.div`
  padding: 16px;
  overflow-y: scroll;
  height: 100%;
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
  handleDownLoad = (fileUrl, status)=> {
    if(status == 'sending') return
    window.open(fileUrl, '_blank')
  }
  render(){
    return (
      <FileBox>
        {
          this.props.fileList.filter(item =>{ return item }).map( ( fileObj, index ) =>{
            return (
              <FileItem key={index} { ...fileObj } />
            )
          } )}
      </FileBox>
    )
  }
}


export default connect(null, {getChirpList})(FilePage)
