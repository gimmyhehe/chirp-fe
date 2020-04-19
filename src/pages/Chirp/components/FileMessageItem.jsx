import React from 'react'
import styled from 'styled-components'
import { Loading } from '@components'
import { bytesToSize } from '@utils/fileHandle'
import DownloadSelect from './DownLoadSelect'
import pdfIcon from '@assets/icon/pdf.png'
import docxIcon from '@assets/icon/docx.png'
import defaultIcon from '@assets/icon/file.png'
import excelIcon from '@assets/icon/excel.png'
import pptIcon from '@assets/icon/ppt.png'
import zipIcon from '@assets/icon/zip.png'

const FileItem = styled.div`
  display: inline-block;
  position: relative;
  border: 1px solid #D8DBE2;
  margin-top: 10px;
  width: 240px;
  height: 64px;
  padding:8px;
  margin-right: 10px;
  cursor: pointer;
  .filelogo{
    display:inline-block;
    background-repeat: no-repeat;
    background-image: ${ props =>  props.fileLogo ? `url('${props.fileLogo}')` : `url('${defaultIcon}')` } ;
    width: 40px;
    height: 48px;
    background-size: contain;
    vertical-align: top;
  }
  .fileinfo{
    display: inline-block;
    width: 180px;
  }
  span{
    display: block;
    width: 160px;
    font-size: 16px;
    letter-spacing: 0.28px;
    font-weight: 600;
    margin-left:16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-size{
    font-size: 12px;
    color: #ccc;
  }
`

export default function FileMessageItem(props) {
  const { fileUrl, status, name, ext, size, selected, changeSelected } = props

  function downLoadFile(fileUrl, status) {
    if(status == 'sending' || selected!=null) return
    window.open(fileUrl, '_blank')
  }

  function fileLogo(ext) {
    if( ['pdf'].includes(ext) ){
      return pdfIcon
    }else if( ['doc','docx'].includes(ext) ){
      return docxIcon
    }else if( ['xls','xlsx'].includes(ext) ){
      return excelIcon
    }else if( ['pptx','ppt'].includes(ext) ){
      return pptIcon
    }else if( ['zip'].includes(ext) ){
      return zipIcon
    }else{
      return defaultIcon
    }
  }
  return(
    <FileItem  fileLogo={ fileLogo(ext) } onClick={ downLoadFile.bind(this, fileUrl, status) } >
      < DownloadSelect changeSelected={changeSelected} selected={ selected } />
      <div className='filelogo'></div>
      <div className='fileinfo'>
        <span title={name}>{ name }</span>
        <span className='file-size'>{ bytesToSize(size) }</span>
      </div>
      { status == 'sending' ? <Loading  /> : null }
    </FileItem>
  )
}
