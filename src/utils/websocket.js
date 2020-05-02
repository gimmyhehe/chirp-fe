import { store } from '../store'
import { setChirpList,sendMsgSuccess, deleteChirp } from '@actions/chirps'
import { doLogout } from '@actions/user'
import { serialize } from '@utils/tool'
import NProgress from 'nprogress'
import { message } from 'antd'
import cookies from '@utils/cookies'
function SocketBase(obj){
  this.params = obj.params
  this.onmessageHandler={}
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
    if(this.loginState){
      this.heartCheck.start()
    }
    if(data.command && this.onmessageHandler[data.command]){
      this.emit(data.command, data)
    }else{
      // eslint-disable-next-line no-undef
      if(process.env.NODE_ENV == 'development'){
        console.error(`命令${data.command}未定义onmessageHandler方法`)
      }
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
SocketBase.prototype.addServerListener = function(command, callback) {
  this.onmessageHandler = this.onmessageHandler || {}
  this.onmessageHandler[command] = callback
}

SocketBase.prototype.send  = function(command, data, callback){
  if(!this.isHeartflag){
    message.error('server disconnect! please retry later')
    return false
  }
  console.log(callback)
  this.onmessageHandler = this.onmessageHandler || {};
  (this.onmessageHandler[command] = this.onmessageHandler[command] || []).unshift(callback)
  // eslint-disable-next-line no-undef
  if(process.env.NODE_ENV == 'development'){
    console.log('websocket 请求发送中 参数如下')
    console.log(data)
  }
  this.socket.send(data)
  return this
}

SocketBase.prototype.emit = function(command){
  if(!this.isHeartflag && +command != 6) return
  this.onmessageHandler = this.onmessageHandler || {}

  var args = new Array(arguments.length - 1)
    , callbacks = this.onmessageHandler[command]

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i]
  }
  if (callbacks) {
    console.log(this.onmessageHandler)
    if(callbacks instanceof Array){
      var callback = callbacks.pop()
      callback.apply(this, args)
    }else{
      callbacks.apply(this, args)
    }

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
  let paramsStr = typeof this.params === 'object' ? serialize(this.params) : this.params
  console.log('与服务器器连接websocket中。。。')
  let protocal = window.location.protocol == 'https:' ? 'wss:' : 'ws:'
  //process.env.WEBSOCKET_URL是webpack的DefinePlugin需要替换的变量
  // eslint-disable-next-line no-undef
  this.socket = new WebSocket(protocal+process.env.WEBSOCKET_URL+`?${paramsStr}`)
  console.log(paramsStr)
  this.initServerListener()
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

SocketBase.prototype.initServerListener = function() {
  this.addServerListener(11, (res)=> {
    if(cookies.get('uid') == res.data.from){
      return
    }else{
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
  })

  this.addServerListener(33, res=> {
    store.dispatch(deleteChirp({ chirpId: res.data, msg: res.msg, code: res.code }))
  })
}

SocketBase.prototype.close = function(){
  this.socket.close()
}

SocketBase.prototype.disconnect = function () {
  this.loginState = false
  if(this.isHeartflag){
    this.close()
  }
  delete this.socket
  clearTimeout(window.appSocket.heartCheck.timeoutObj)
  clearTimeout(window.appSocket.heartCheck.serverTimeoutObj)
  delete window.appSocket
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


export function sendRequest(params, command) {
  return new Promise((reslove)=>{
    try{
      const isConnect =  window.appSocket.send(command, JSON.stringify(params), function(res){
        reslove(res)
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
    window.appSocket.disconnect()
  }
  var appSocket = new SocketBase({params})
  return new Promise((resolve)=>{
    appSocket.addServerListener(6, res=> {
      if(res.code!=10007){
        NProgress.done()
        message.error(res.msg)
        resolve({ error: true })
        return
      }
      window.appSocket = appSocket
      appSocket.loginState = true
      appSocket.isHeartflag = true
      resolve(res)
    })
  })
}

export function socketLogout() {
  cookies.remove('uid')
  cookies.remove('userEmail')
  cookies.remove('password')
  store.dispatch(doLogout())
  window.appSocket.disconnect()
  window.location.reload()
}
