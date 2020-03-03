import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import SparkMD5 from 'spark-md5'
import cookies from '@utils/cookies'
import {Avatar,Col,Icon,Input,Row } from 'antd'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'

const AllContnet = styled.div`
  width: 100%;
  height: 100%;
`
const MessegeBox = styled.div`
  padding:12px;
  position: absolute;
  bottom: 4px;
  right: 1px;
  left: 1px;
  background-color: #f9f9f9;
  height: 8%;
  .anticon{
    font-size:21px;
    margin-right:20px;
  }
  .ant-input{
    display: inline-block;
    width: 90%;
    border-radius: 30px;
    border: 2px solid #000;
  }
`
const ChirpContent = styled.div`
  overflow-y: auto;
  height: 92%;
`

const ChatItem = styled.div`
  padding:16px;
  border-bottom: 2px solid #ebedf0;
  p{
    font-size:17px;
  }
`
const SelfChatItem = styled(ChatItem)`
  overflow:hidden;
  .avatar{
    float: right;
  }
  .info{
    float: right;
    &:after{
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
  }
  p{
    float: right;
    margin-bottom: 0;
    clear:both;
  }
  &:after{
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
`
const fontSize =14
const UserInfo = styled.div`
  .username{
    display: block;
    font-size: 14px;
    color: #000;
    font-weight: 600;
  }
  .sendtime{
    display:block;
    font-size: ${fontSize}px;
    transform: scale(${10/fontSize}) translate(${-(1-10/fontSize)/2*100}%,${-(1-10/fontSize)/2*100}%);
    color: rgba(0,0,0,0.5);
  }
`

const PhotoBox = styled(Row)`
  padding: 16px;
  .ant-col{
    overflow: hidden;
    width: 190px;
    height: 180px;
  }
  .more{
    div{
      width: 180px;
      height: 180px;
      border: 1px solid #D8DBE2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #607585;
      font-size: 16px;
      letter-spacing: -0.38px;
    }
  }
`


class AllPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      message: null,
      chirpName: null,
      hasPassword: false,
      chirpPassword: null
    }
    this.content = React.createRef()
  }

  handleMessageChange = (e) =>{
    this.setState({message:e.target.value})
  }

  handleSend = async (obj) =>{
    let {fileList} = obj
    let params = {
      'from': cookies.get('uid'),
      'createTime': Math.ceil(Date.now() / 1000),
      'cmd':11,
      'group_id': this.props.currentChirp.id,
      'chatType':'1',
      'msgType':'0',
      'content': this.state.message,
      fileList
    }
    this.setState({message:null})
    let res = await api.sendMessage(params)
    if(this.content.current.scrollHeight > this.content.current.clientHeight) {
      //设置滚动条到最底部
      this.content.current.scrollTop = this.content.current.scrollHeight
    }
    console.log(res)
  }
  uploadFile = () => {
    document.getElementById('upload').click()
  }
  doRealUpload = async () =>{
    var uploadfile = document.getElementById('upload')
    var file = uploadfile.files[0]
    console.log(file)
    var formData = new FormData()
    formData.append('chirpId',this.props.currentChirp.id)
    formData.append('userId',cookies.get('uid'))
    formData.append('fileName',file.name)
    var md5Str =  await this.get_filemd5sum(file)
    formData.append('md5',md5Str)
    console.log(md5Str)
    formData.append('file',file)
    var res = await api.upload(formData)
    let fileList = [res.data]
    this.handleSend({fileList})
    console.log(res)
  }
   get_filemd5sum = (ofile) => {
     return new Promise((resolve,reject)=>{
       var file = ofile
       var tmp_md5
       var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
         // file = this.files[0],
         chunkSize = 8097152, // Read in chunks of 2MB
         chunks = Math.ceil(file.size / chunkSize),
         currentChunk = 0,
         spark = new SparkMD5.ArrayBuffer(),
         fileReader = new FileReader()

       fileReader.onload = function(e) {
         // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
         spark.append(e.target.result) // Append array buffer
         currentChunk++
         var md5_progress = Math.floor((currentChunk / chunks) * 100)

         console.log(file.name + '  正在处理，请稍等,' + '已完成' + md5_progress + '%')
         if (currentChunk < chunks) {
           loadNext()
         } else {
           tmp_md5 = spark.end()
           console.log(tmp_md5)
           resolve(tmp_md5)
         }
       }

       fileReader.onerror = function() {
         reject('error')
       }

       function loadNext() {
         var start = currentChunk * chunkSize,
           end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
         fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
       }
       loadNext()
     })
   }
   render(){
     var chirpMessage = this.props.chirpMessage
     console.log(chirpMessage)
     return (
       <AllContnet>
         <ChirpContent ref ={this.content}>
           { chirpMessage.map((message,index)=>{
             if (message.isSelf){
               return(

                 <SelfChatItem key={index}>
                   <UserInfo>
                     <Avatar className='avatar' size={36} icon="user"></Avatar>
                     <div  className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                       <span className='username'>{message.fromName}</span>
                       <span className='sendtime' id='font-size10'>{message.createTime}</span>
                     </div>
                   </UserInfo>
                   {message.fileList ?
                     <PhotoBox gutter={10}>
                       <Col className="gutter-row" span={4}>
                         <img src={message.fileList[0]}></img>
                       </Col>
                     </PhotoBox>
                     :<p>{message.content}</p>}
                 </SelfChatItem>
               )
             }else{
               return(

                 <ChatItem key={index}>
                   <UserInfo>
                     <Avatar className='avatar' size={36} icon="user"></Avatar>
                     <div className='info' style={{display:'inline-block', verticalAlign: 'middle',marginLeft: '6px'}}>
                       <span className='username'>{message.fromName}</span>
                       <span className='sendtime' id='font-size10'>{message.createTime}</span>
                     </div>
                   </UserInfo>
                   {message.fileList ?
                     <PhotoBox gutter={10}>
                       <Col className="gutter-row" span={4}>
                         <img src={message.fileList[0]}></img>
                       </Col>
                     </PhotoBox>
                     :<p>{message.content}</p>}
                 </ChatItem>
               )
             }
             //    <PhotoBox gutter={10}>
             //    <Col className="gutter-row" span={4}>
             //      <img src={message.fileList[0]}></img>
             //    </Col>
             //    <Col style={{position:'relative'}} className='more' span={4}>
             //      <div>
             //             +16 more
             //      </div>
             //    </Col>
             //  </PhotoBox>
           })}

         </ChirpContent>
         <MessegeBox>
           <Icon type="upload" style={{marginLeft:'8px'} } onClick={this.uploadFile}></Icon>
           <input id="upload" type="file" multiple onChange={this.doRealUpload} style={{display: 'none'}} />
           <Icon type="smile" onClick={this.handleSend}></Icon>
           <Input
             placeholder='Press Enter to send messege'
             value = {this.state.message}
             onPressEnter={this.handleSend}
             onChange = {this.handleMessageChange}
           ></Input>
         </MessegeBox>
       </AllContnet>
     )
   }
}


export default connect(null, {getChirpList})(AllPage)
