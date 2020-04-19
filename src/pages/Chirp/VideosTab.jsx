import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import { Button } from '@components'
import VideoItem from './components/VideoMessageItem'
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
const VideoBox = styled.div`
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
  width: 320px;
  height: 0;
  margin-right: 10px;
`

class VideosTab extends Component{
  constructor(props){
    super(props)
    this.state ={
      videoList: this.props.videoList || [],
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
      await downloadZip(this.state.videoList)

    }else{
      const selectList = this.state.videoList.filter((item)=>{
        if(item.selected){
          return item
        }
      })
      await downloadOneByOne(selectList)
    }
    this.setState({ downloading: false })
  }

  changeSelected = (index)=> {
    let _videoList = this.state.videoList
    _videoList[index]['selected'] = !_videoList[index]['selected']
    this.setState(() => ({
      videoList : _videoList
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
        <VideoBox>
          {
            this.state.videoList.filter(item =>{ return item }).map( ( fileObj, index ) =>{
              return (
                <VideoItem
                  key={index}
                  { ...fileObj }
                  selected={ Boolean(fileObj.selected) }
                  changeSelected ={this.changeSelected.bind(this, index)}
                />
              )
            } )}
          <EmptyItem />
          <EmptyItem />
        </VideoBox>
      </div>
    )
  }
}


export default connect(null, {getChirpList})(VideosTab)
