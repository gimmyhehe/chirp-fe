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
const ButtonBox = styled.div`
  position: absolute;
  padding: 16px;
  width: 100%;
  height: 80px;
  z-index: 9;
  .ant-btn{
    float: right;
    width: 180px;
    height: 48px;
  }
`
const PhotoBox = styled.div`
  position: absolute;
  top: 80px;
  bottom: 4px;
  overflow-y: auto;
  width: 100%;

`
const PhotoItem = styled.div`
  vertical-align: top;
  width: 180px;
  height: 180px;
  display: inline-block;
  margin: 10px 0 0 10px;
  position: relative;
  background-color: #ccc;
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
class PhotoPage extends Component{
  constructor(props){
    super(props)

    this.state = {
      photoList: this.props.photoList,
      selfChange: false
    }
  }
  static getDerivedStateFromProps(nextProps,prevState) {
    // 当父组件的 props 改变时，重新请求数据
    // let { chirpMessage } = nextProps
    console.log(prevState)
    console.log(nextProps)
    return nextProps
    // if(prevState.selfChange){
    //   return
    // }
    // let photoList = nextProps.photoList.map((item)=>{
    //   return {
    //     url: item,
    //     selected: false
    //   }
    // })
    // return {photoList}
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
    return new Promise((resolve,reject)=>{
      image.onload =function (){
        resolve(getBase64Image(image))
      }
      image.onerror = (error) =>{
        reject(error)
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
    let promises = _photoList.map( (item)=>{
      return this.getBase64(item.url)
    })
    let results = await Promise.all(promises)
    results.forEach((item,index) => {
      zip.file(Date.now() + `${index}.jpg`,item,{base64: true})
    })
    zip.generateAsync({type:'blob'})
      .then(function(content) {
        // see FileSaver.js
        saveAs(content, 'download.zip')
      })
  }
  changeSelect = (index) =>{
    let _photoList = this.state.photoList
    _photoList[index]['selected'] = !_photoList[index]['selected']
    this.setState((state) => ({
      photoList : _photoList,selfChange:!state.selfChange
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
        <PhotoBox>
          {
            this.state.photoList.map((item,index)=>{
              return (
                <PhotoItem
                  style={{backgroundImage:`url(${item.url})`}}
                  key={index}
                  onClick = {this.changeSelect.bind(this,index)}
                >
                  { item.selected ? <SelectCheck /> : <Check /> }
                </PhotoItem>
              )
            })
          }

        </PhotoBox>
      </div>
    )
  }
}


export default connect(null, {getChirpList})(PhotoPage)
