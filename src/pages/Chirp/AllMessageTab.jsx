import React,{ Component } from 'react'
import styled from 'styled-components'
import Viewer from 'react-viewer'
import ChirpInput from './components/ChirpInput'
import MessageContainer from './components/Message'
const AllContnet = styled.div`
  width: 100%;
  height: 100%;
`

const ChirpContent = styled.div`
  overflow-y: auto;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 56px;
`

export default class AllMessageTab extends Component{
  constructor(props){
    super(props)
    this.state = {
      message: null,
      chirpName: null,
      hasPassword: false,
      chirpPassword: null,
      visible: false,
      imgUrl: '',
      autoScroll: true
    }
    this.content = React.createRef()
  }

  throttle = function(cb,delay = 1000) {
    let timer = null
    return function() {
      if(!timer){
        timer = true
        setTimeout( ()=>{
          timer = false
          cb.call(this,arguments)
        }, delay )
      }
    }
  }

  handleScroll = ()=> {
    const { scrollTop, scrollHeight, clientHeight } = this.content.current
    //滚动条往上滚动300PX则新消息到达不会自动滚动到底部
    if( scrollTop + clientHeight  > scrollHeight - 300 && !this.state.autoScroll ){
      this.setState({ autoScroll: true })
    }else if( scrollTop + clientHeight <= scrollHeight - 300  && this.state.autoScroll ){
      this.setState({ autoScroll: false })
    }

  }
  componentDidUpdate() {
    if(this.content.current.scrollHeight > this.content.current.clientHeight && this.state.autoScroll) {
      //设置滚动条到最底部
      this.content.current.scrollTop = this.content.current.scrollHeight
    }

  }

  showBigImg = (imgUrl)=> {
    this.setState({ visible: true, imgUrl })
  }

  renderMessage = function (message, index) {
    return (
      <MessageContainer
        key = {index}
        isSelf = { message.isSelf }
        fileList = { message.fileList }
        fromName = { message.fromName }
        createTime = { message.createTime }
        content = { message.content }
        showBigImg = { this.showBigImg }
      /> )
  }

  render(){
    var chirpMessage = this.props.chirpMessage
    return (
      <AllContnet>
        <Viewer
          visible={this.state.visible}
          onClose={() => { this.setState({ visible: false }) } }
          images={[{src: this.state.imgUrl, alt: ''}]}
        />
        <ChirpContent ref ={this.content} onScroll={ this.throttle.call(this,this.handleScroll) } >

          { chirpMessage.map((message,index)=> this.renderMessage(message,index) )}

        </ChirpContent>

        <ChirpInput />

      </AllContnet>
    )
  }
}
