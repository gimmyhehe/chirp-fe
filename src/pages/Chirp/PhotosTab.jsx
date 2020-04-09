import React,{ Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { saveAs } from 'file-saver'
import JsZip from 'jszip'
import { getChirpList } from '@actions/chirps'
import { Button } from '@components'
import checkIcon from '@assets/icon/check.svg'
import selectCheckIcon from '@assets/icon/select-check.svg'
import imgError from '@assets/img/imgerror.jpg'
import { message } from 'antd'
import { thumbnail} from '../../utils/fileHandle'
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
      photoList: this.props.photoList,
      selfChange: false
    }
  }
  getBase64 = (img) =>{
    if (!img) return
    function getBase64Image(img,width,height) {
      var canvas = document.createElement('canvas')
      canvas.width = width ? width : img.width
      canvas.height = height ? height : img.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      var dataURL = canvas.toDataURL()
      return dataURL.split(',')[1]
    }
    var image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = img
    return new Promise((resolve)=>{
      image.onload =function (){
        resolve(getBase64Image(image))
      }
      image.onerror = () =>{
        resolve(null)
      }
    })
  }
  downLoad = async (option)=>{
    var zip = new JsZip()
    let _photoList = this.state.photoList
    if(option != 'all'){
      _photoList = _photoList.filter((item)=>{
        return item.selected == true
      })
    }
    if(_photoList.length == 0){
      message.info('no image to download!')
      return
    }
    const hide = message.loading('Download Loading...',0)
    let promises = _photoList.map( (item)=>{
      return this.getBase64(item.imgObj.imgUrl)
    })
    let results = await Promise.all(promises)
    let failNum = 0
    results.forEach((item,index) => {
      if(!item){
        failNum ++
        return
      }
      zip.file(Date.now() + `${index}.jpg`,item,{base64: true})
    })
    zip.generateAsync({type:'blob'})
      .then(function(content) {
        // see FileSaver.js
        if(failNum!=0) message.warn(`${failNum} photo download fail`)
        saveAs(content, 'download.zip')
        hide()
      })
  }
  handleImgError = (e)=>{
    e.target.onerror = null
    e.target.src = imgError
  }
  changeSelect = (index) =>{
    let _photoList = this.state.photoList
    _photoList[index]['selected'] = !_photoList[index]['selected']
    this.setState((state) => ({
      photoList : _photoList,selfChange:!state.selfChange
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
            this.state.photoList.filter(item =>{ return item.imgObj }).map((item,index)=>{
              return (
                <PhotoItem
                  key={index}
                  onClick = {this.changeSelect.bind(this,index)}
                >
                  <img src={item.imgObj.imgUrl}
                    width={ thumbnail(item.imgObj.width,item.imgObj.height).width }
                    height={ thumbnail(item.imgObj.width,item.imgObj.height).height }
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
