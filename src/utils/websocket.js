/*
 * @Author: your name
 * @Date: 2019-12-10 00:54:02
 * @LastEditTime: 2020-03-16 23:22:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\utils\websocket.js
 */
import { store } from '../store'
import { setChirpList,sendMsgSuccess } from '@actions/chirps'
import { serialize } from '@utils/tool'
import cookies from '@utils/cookies'
function SocketBase(obj){
  this.params = obj.params
  this.connectSuccess
  this.connectFail
  this.handleResponse = () =>{}
  this.sendRequest = (params,callback) =>{
    if(!this.isHeartflag){
      console.log('no connect')
      return false
    }
    this.handleResponse = callback
    this.socket.send(params)
  }
  this.receiveMessage = (data) =>{
    store.dispatch(setChirpList(data.data))
    if(data.data.fileList){
      store.dispatch(sendMsgSuccess({type:'img',index:null,chirpId:data.data.group_id,imgUrl:data.data.fileList[0]}))
    }
  }
  //socket对象,用于保存原生websocket的属性、方法
  this.socket = null
  //心跳状态  为false时不能执行操作 等待重连
  this.isHeartflag = false
  //重连状态  避免不间断的重连操作
  this.isReconnect = false
  //自定义Ws连接函数：服务器连接成功
  this.onopen = ((msg) => {
    this.isHeartflag = true
    console.log(`websocket connect is success, the connect message is as follow:
                 ${msg}`)
  })
  //自定义Ws消息接收函数：服务器向前端推送消息时触发
  this.onmessage = ((res) => {
    let response = res.data
    if(typeof response == 'string'){
      response = JSON.parse(response)
    }
    this.connectSuccess(response)
    //登录成功后重写onmessage方法
    this.onmessage = (res) =>{
      console.log('onmessage 方法被调用了!!!')
      console.log(res)
      let data = JSON.parse(res.data)
      //this.handleResponse(res)
      if(data.command =='11'){
        //判断如果是自己的消息则不做处理
        if(cookies.get('uid') == data.data.from){
          return
        }else{
          this.receiveMessage(data)
        }
      }else{
        this.handleResponse(res)
      }
    }
  })
  //自定义Ws异常事件：Ws报错后触发
  this.onerror = ((e) => {
    console.log(`websocket connect error${e}`)
    if(typeof this.disconnectFail == 'function'){
      this.disconnectFail
    }
    this.isHeartflag = false
    this.reConnect()
  })
  //自定义Ws关闭事件：Ws连接关闭后触发
  this.onclose = ((msg) => {
    console.log(`The websocket is close${msg}`)
  })
  this.connect()
}

//初始化websocket连接
SocketBase.prototype.connect = function () {
  window.WebSocket = window.WebSocket || window.MozWebSocket
  if (!window.WebSocket) { // 检测浏览器支持
    alert('错误: 浏览器不支持websocket')
    return
  }
  let paramsStr = serialize(this.params)
  console.log('与服务器器连接websocket中。。。')
  //process.env.WEBSOCKET_URL是webpack的DefinePlugin需要替换的变量
  let protocal = window.location.protocol == 'https' ? 'wss:' : 'ws:'
  // eslint-disable-next-line no-undef
  this.socket = new WebSocket(protocal+process.env.WEBSOCKET_URL+`?${paramsStr}`)
  //将原生socket的各种方法绑定到自定义的Socket类上
  this.socket.onopen = (msg)=>{
    this.onopen(msg)
  }
  this.socket.onerror =(error)=>{
    this.onerror(error)
  }
  this.socket.onclose = (msg)=>{
    this.onclose(msg)
    this.socket = null // 清理
  }
  this.socket.onmessage = (res)=>{
    console.log(`原生websocket返回结果：
                  ${res}`)
    this.onmessage(res)
  }
}

SocketBase.prototype.disconnect = function () {
  this.socket.close()
  return new Promise((resolve,reject)=>{
    this.socket.onclose=(msg)=>{
      this.socket = null
      window.appSocket = null
      resolve(msg)
    }
    this.disconnectFail = (error)=>{
      reject(error)
    }
  })
}

SocketBase.prototype.reConnect = function () {
  if (this.isReconnect) return
  console.info('wecsocket is reconnenting')
  this.isReconnect = true
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout( ()=> {
    this.connect()
    this.isReconnect = false
  }, 2000)
}

var SocketSingleTon = (function(){
  let instance = null
  return function(paramsObj){
    if(instance == null){
      instance = new SocketBase(paramsObj)
    }
    return instance
  }
})()


export function sendRequest(params) {
  console.log('websocket 请求发送中 参数如下')
  console.log(params)
  return new Promise((reslove,reject)=>{
    try{
      window.appSocket.sendRequest(JSON.stringify(params),function(res){
        let data = JSON.parse(res.data)
        reslove(data)
      })
    }catch(error){
      reject(error)
    }
  })
}

export function socketLogin(params) {
  if(window.appSocket){
    let response = {code:10007,msg:'msg'} , appSocket = window.appSocket
    return Promise.resolve({response,appSocket})
  }
  var appSocket = new SocketBase({params})
  return new Promise((resolve,reject)=>{
    appSocket.connectSuccess = (response) =>{
      resolve({response,appSocket})
    }
    appSocket.connectFail = (error) =>{
      reject(error)
    }
  })
}

export function socketLogout() {
  cookies.remove('uid')
  cookies.remove('userName')
  cookies.remove('password')
  return window.appSocket.disconnect()
}
