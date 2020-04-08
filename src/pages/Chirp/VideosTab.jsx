import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'

class VideosTab extends Component{
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
            开发中。。。
      </div>
    )
  }
}


export default connect(null, {getChirpList})(VideosTab)
