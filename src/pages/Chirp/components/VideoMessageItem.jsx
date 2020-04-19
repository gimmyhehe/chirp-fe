import React from 'react'
import styled from 'styled-components'
import { Loading } from '@components'
import DownloadSelect from './DownloadSelect'
const VideoItem = styled.div`
  display: inline-block;
  position: relative;
  margin-top: 10px;
  width: 320px;
  height: 200px;
  margin-right: 10px;
  cursor: pointer;
  background: rgba(0,0,0,0.2)
`

export default function VideoMessageItem(props) {
  const { fileUrl, status, selected, changeSelected } = props

  return(
    <VideoItem>
      { status == 'sending' ? <Loading  /> : null }
      < DownloadSelect changeSelected={changeSelected} selected={ selected } />
      <video width='320' height='200' src={fileUrl} controls >
        your browser does not support the video tag
      </video>
    </VideoItem>
  )
}
