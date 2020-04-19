import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import { Button } from '@components'
import checkIcon from '@assets/icon/check.svg'
import selectCheckIcon from '@assets/icon/select-check.svg'
import imgError from '@assets/img/imgerror.jpg'
import { thumbnail } from '@/utils/imageHandle'
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
const PhotoBox = styled.div`
  padding-bottom: 0.8rem;
  position: absolute;
  top: 80px;
  bottom: 4px;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  padding-right: 0.5rem;
`
const PhotoItem = styled.div`
  vertical-align: top;
  width: 180px;
  height: 180px;
  display: inline-block;
  margin: 0.5rem 0 0 0.5rem;
  position: relative;
  overflow: hidden;
  background-color: rgba(0,0,0,0.1);
  @media (max-width: 620px){
    width: 140px;
    height: 140px;
  }
  @media (max-width: 450px){
    width: 100px;
    height: 100px;
  }
  @media (max-width: 350px){
    width: 90px;
    height: 90px;
  }
  img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
const EmptyItem = styled(PhotoItem)`
  height: 0!important;
`

const Check = styled.div`
  width: 40px;
  height 40px;
  position: absolute;
  right: 8px;
  top: 8px;
  background: url(${checkIcon}) no-repeat;
  background-size: cover;
`
const SelectCheck = styled(Check)`
  background-image: url(${selectCheckIcon});
`


class PhotosTab extends Component{
  constructor(props){
    super(props)

    this.state = {
      photosList: this.props.photosList,
      selfChange: false,
      downloading: false
    }
  }

  downLoad = async (option)=>{
    if(this.state.downloading) return
    this.setState({ downloading: true })
    if(option==='all'){
      await downloadZip(this.state.photosList)
    }else{
      const selectList = this.state.photosList.filter((item)=>{
        if(item.selected){
          return item
        }
      })
      await downloadOneByOne(selectList)
    }
    this.setState({ downloading: false })
  }

  handleImgError = (e)=>{
    e.target.onerror = null
    e.target.src = imgError
  }
  changeSelect = (index) =>{
    let _photosList = this.state.photosList
    _photosList[index]['selected'] = !_photosList[index]['selected']
    this.setState((state) => ({
      photosList : _photosList,selfChange:!state.selfChange
    })
    )

  }
  static getDerivedStateFromProps(nextProps) {
    // 当父组件的 props 改变时，重新请求数据
    // let { chirpMessage } = nextProps
    return nextProps
  }
  render(){
    return (
      <div>
        <ButtonBox>
          <Button type='normal' onClick={this.downLoad}>Download</Button>
          <Button type='primary' onClick = {this.downLoad.bind(this,'all')}>Download All</Button>
        </ButtonBox>
        <PhotoBox>
          {
            this.state.photosList.filter(item =>{ return item.imgUrl }).map((item,index)=>{
              return (
                <PhotoItem
                  key={index}
                  onClick = {this.changeSelect.bind(this,index)}
                >
                  <img src={item.imgUrl}
                    width={ thumbnail(item.width,item.height).width }
                    height={ thumbnail(item.width,item.height).height }
                    onError={this.handleImgError} />
                  { item.selected ? <SelectCheck /> : <Check /> }
                </PhotoItem>
              )
            })
          }
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
          <EmptyItem />
        </PhotoBox>
      </div>
    )
  }
}


export default connect(null, {getChirpList})(PhotosTab)
