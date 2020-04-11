import { store } from '../store'
import { setChirpList,sendMsgSuccess, deleteChirp } from '@actions/chirps'
import { doLogout } from '@actions/user'
import { serialize } from '@utils/tool'
import NProgress from 'nprogress'
import { message } from 'antd'
import cookies from '@utils/cookies'
function SocketBase(obj){
  this.params = obj.params
  this.connectSuccess
  this.connectFail
  this.heartCheck = {
    timeout: 15000,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function (){
      var self = this
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(function(){
        window.appSocket.send('heartCheck','test heart beat')
        self.serverTimeoutObj = setTimeout(function(){
          window.appSocket.isHeartflag = false
          window.appSocket.reConnect()
        },5000)
      },this.timeout)
    }
  }
  this.handleResponse = () =>{}

  this.receiveMessage = (res) =>{
    let item =res.data
    if(item.fileList){
      if( typeof item.fileList == 'object' ) return
      if(item.fileList[item.fileList.length-1] == ',') item.fileList = item.fileList.substr(0,item.fileList.length-1)
      item.fileList = JSON.parse(item.fileList)
      if(!(item.fileList instanceof Array)) item.fileList = [item.fileList]
      store.dispatch(sendMsgSuccess({type:'img',index:null,chirpId:item.group_id,imgObj:item.fileList[0]}))
    }
    store.dispatch(setChirpList(item))
  }
  //socket对象,用于保存原生websocket的属性、方法
  this.socket = null
  //心跳状态  为false时不能执行操作 等待重连
  this.isHeartflag = false
  //重连状态  避免不间断的重连操作
  this.isReconnect = false
  //自定义Ws连接函数：服务器连接成功
  this.onopen = (() => {

  })
  //自定义Ws消息接收函数：服务器向前端推送消息时触发
  this.onmessage = (res) => {
    let data = res.data
    if(typeof data == 'string'){
      data = JSON.parse(data)
    }
    // eslint-disable-next-line no-undef
    if(process.env.NODE_ENV == 'development'){
      console.log('onmessage返回结果')
      console.log(data)
    }
    //心跳检测
    this.heartCheck.start()
    //不是登录请求的响应直接跳过
    if(data.command==6) {

      if(data.code!=10007){
        NProgress.done()
        message.error(data.msg)
        return
      }
      this.loginState = true
      this.isHeartflag = true
      this.connectSuccess(data)
    }

    if(data.command == 11 ){
      //判断如果是自己的消息则不做处理
      if(cookies.get('uid') == data.data.from){
        return
      }else{
        this.receiveMessage(data)
      }
    }else if(data.command == 12 ){
      this.emit('sendMessage',res)
    }else if(data.command == 18 ){
      this.emit('getUserInfo',res)
    }else if(data.command == 22 ){
      this.emit('createChirp',res)
    }else if(data.command == 24 ){
      this.emit('joinChirp',res)
    }else if(data.command == 28 ){
      this.emit('saveChirpSetting', res)
    }else if(data.command == 30 ){
      this.emit('deleteChirp',res)
    }else if(data.command == 26 ){
      this.emit('getChirpList',res)
    }else if(data.command == 31 ){
      this.emit('getHistoryMessage',res)
    }else if(data.command == 33 ){
      store.dispatch(deleteChirp({ chirpId: data.data, msg: data.msg, code: data.code }))
    }else{
      this.emit('default',res)
    }
  }
  //自定义Ws异常事件：Ws报错后触发
  this.onerror = ((e) => {
    if(!this.loginState) return
    console.log('websocket connect error')
    console.error(e)
    if(typeof this.disconnectFail == 'function'){
      this.disconnectFail
    }
    this.isHeartflag = false
    this.reConnect()
  })
  //自定义Ws关闭事件：Ws连接关闭后触发
  this.onclose = ((msg) => {
    this.isHeartflag = false
    if(!this.loginState) return
    console.log('The websocket is close')
    console.error(msg)
    this.reConnect()
  })
  this.connect()
}

SocketBase.prototype.send =
SocketBase.prototype.addEventListener = function(event, data,callback){
  if(!this.isHeartflag){
    message.error('server disconnect! please retry later')
    return false
  }
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).unshift(callback)
  // eslint-disable-next-line no-undef
  if(process.env.NODE_ENV == 'development'){
    console.log('websocket 请求发送中 参数如下')
    console.log(data)
  }
  this.socket.send(data)
  return this
}

SocketBase.prototype.emit = function(event){
  if(!this.isHeartflag) return
  this._callbacks = this._callbacks || {}

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event]

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i]
  }
  if (callbacks) {
    var callback = callbacks.pop()
    callback.apply(this, args)

  }
  return this
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
  let protocal = window.location.protocol == 'https:' ? 'wss:' : 'ws:'
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
    this.onmessage(res)
  }
}
SocketBase.prototype.close = function(){
  this.socket.close()
}

SocketBase.prototype.disconnect = function () {
  this.loginState = false
  if(this.isHeartflag){
    this.close()
  }
  return new Promise((resolve)=>{
    delete this.socket
    clearTimeout(window.appSocket.heartCheck.timeoutObj)
    clearTimeout(window.appSocket.heartCheck.serverTimeoutObj)
    delete window.appSocket
    resolve('')
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

// var SocketSingleTon = (function(){
//   let instance = null
//   return function(paramsObj){
//     if(instance == null){
//       instance = new SocketBase(paramsObj)
//     }
//     return instance
//   }
// })()


export function sendRequest(params,event = 'default') {
  return new Promise((reslove)=>{
    try{
      const isConnect =  window.appSocket.send(event, JSON.stringify(params), function(res){
        let data = JSON.parse(res.data)
        reslove(data)
      })
      if(!isConnect){
        throw new Error('server disconnect! please retry later')
      }
    }catch(error){
      reslove({ error: true })
    }
  })
}

export function socketLogin(params) {
  if(window.appSocket){
    let response = {code:10007,command: 6,uid: cookies.get('uid'), token: cookies.get('chirp-token')}
    return Promise.resolve(response)
  }
  var appSocket = new SocketBase({params})
  return new Promise((resolve,reject)=>{
    appSocket.connectSuccess = (response) =>{
      window.appSocket = appSocket
      resolve(response)
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
  store.dispatch(doLogout())
  return window.appSocket.disconnect()
}
