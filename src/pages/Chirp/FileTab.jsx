import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import FileItem from './components/FileMessageItem'
import { Button } from '@components'
import { downloadZip, downloadOneByOne } from '@utils/fileDownload'
const ButtonBox = styled.div`
  position: absolute;
  padding: 16px;
  width: 100%;
  height: 4rem;
  z-index: 9;
  @media (max-width: 700px){
    display: flex;
    justify-content: space-around;
    .ant-btn{
      margin-right: 0;
    }
  }
  .ant-btn{
    float: right;
    width: 10rem;
    max-width: 180px;
    max-height: 48px;
    height: 3rem;
  }
`

const FileBox = styled.div`
  padding: 0 16px 16px;
  position: absolute;
  top: 80px;
  bottom: 4px;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-evenly;
`

const EmptyItem = styled.div`
  width: 240px;
  height: 0;
  margin-right: 10px;
`

class FilePage extends Component{
  constructor(props){
    super(props)
    this.state = {
      fileList: this.props.fileList,
      downloading: false
    }
  }
  static getDerivedStateFromProps(nextProps) {
    return nextProps
  }
  downLoad = async (option)=>{
    if(this.state.downloading) return
    this.setState({ downloading: true })
    if(option==='all'){
      await downloadZip(this.state.fileList)
    }else{
      const selectList = this.state.fileList.filter((item)=>{
        if(item.selected){
          return item
        }
      })
      await downloadOneByOne(selectList)
    }
    this.setState({ downloading: false })
  }

  changeSelected = (index)=> {
    let _fileList = this.state.fileList
    _fileList[index]['selected'] = !_fileList[index]['selected']
    this.setState(() => ({
      fileList : _fileList
    })
    )
  }

  render(){
    return (
      <div>
        <ButtonBox>
          <Button type='normal' onClick={this.downLoad}>Download</Button>
          <Button type='primary' onClick = {this.downLoad.bind(this,'all')}>Download All</Button>
        </ButtonBox>
        <FileBox>
          {
            this.state.fileList.filter(item =>{ return item }).map( ( fileObj, index ) =>{
              return (
                <FileItem
                  key={index} { ...fileObj }
                  selected={ Boolean(fileObj.selected) }
                  changeSelected ={this.changeSelected.bind(this, index)}
                />
              )
            } )}
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
        </FileBox>
      </div>
    )
  }
}


export default connect(null, {getChirpList})(FilePage)
