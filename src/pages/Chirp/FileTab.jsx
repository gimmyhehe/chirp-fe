import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import FileItem from './components/FileMessageItem'

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
      <div style={{ padding: '16px'}}>
        {
          this.props.fileList.filter(item =>{ return item }).map( ( fileObj, index ) =>{
            return (
              <FileItem key={index} { ...fileObj } />
            )
          } )}
      </div>
    )
  }
}


export default connect(null, {getChirpList})(FilePage)
