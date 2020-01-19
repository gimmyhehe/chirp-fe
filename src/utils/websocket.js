/*
 * @Author: your name
 * @Date: 2019-12-10 00:54:02
 * @LastEditTime : 2020-01-17 01:43:44
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\utils\websocket.js
 */
import { store } from '../store'
import { setChirpList } from '@actions/chirps'
export default  function Socket(obj){
  /*
    websocket接口地址
    1、http请求还是https请求 前缀不一样
	2、ip地址host
    3、端口号
    */
  const protocol = 'ws:'
  const host =  '54.144.207.148'
  const port = ':8888'
  this.params = obj.params
  this.handleResponse = (msg) =>{
    console.log('initail handleResponse')
    console.log(msg)
  }
  this.sendRequest = (params,callback) =>{
    if(!this.isHeartflag){
      console.log('no connect')
      return false
    }
    console.log(this.socket)
    console.log(this.socket.onmessage)
    this.handleResponse = callback
    this.socket.send(params)
  }
  this.receiveMessage = (data) =>{
    store.dispatch(setChirpList(data.data))
  }
  //接口地址url
  this.url = protocol + host + port
  //socket对象,用于保存原生websocket的属性、方法
  this.socket
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
    //处理各种推送消息
    // console.log(message)
    this.handleResponse(res)
  })
  //自定义Ws异常事件：Ws报错后触发
  this.onerror = ((e) => {
    console.log('error')
    this.isHeartflag = false
    this.reConnect()
  })
  //自定义Ws关闭事件：Ws连接关闭后触发
  this.onclose = ((e) => {
    console.log('close')
  })
}

//初始化websocket连接
Socket.prototype.connect = function () {
  window.WebSocket = window.WebSocket || window.MozWebSocket
  if (!window.WebSocket) { // 检测浏览器支持
    alert('错误: 浏览器不支持websocket')
    return
  }
  var response
  let paramsStr = serialize(this.params)
  return new Promise((resolve,reject) => {

    this.socket = new WebSocket(`${this.url}?${paramsStr}`)

    this.socket.onopen = (msg)=>{
      this.onopen(msg)
    }
    this.socket.onerror =(error)=>{
      this.onerror(error)
      reject(error)
    }
    this.socket.onclose = (msg)=>{
      this.onclose(msg)
      this.socket = null // 清理
    }
    this.socket.onmessage = (msg)=>{
      response = msg.data
      console.log(response)
      this.socket.onmessage = (res) =>{
        console.log('onmessage 方法被调用了！')
        console.log(res)
        let data = JSON.parse(res.data)
        //this.handleResponse(res)
        if(data.command =='11'){
          this.receiveMessage(data)
        }else{

          this.handleResponse(res)
        }
      }
      resolve(response)
    }
  })
}

Socket.prototype.disconnect = function () {
  this.socket.close()
  return new Promise((resolve,reject)=>{
    this.socket.onclose=(msg)=>{
      this.socket = null
      delete window.appSocket
      resolve(msg)
    }
  })
}

Socket.prototype.reConnect = function () {
  if (this.isReconnect) return
  this.isReconnect = true
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout( ()=> {
    this.connect()
    this.isReconnect = false
  }, 2000)
}

function serialize(data) {
  return Object.keys(data)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    })
    .join('&')
}

export function sendRequest(params) {
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
  var appSocket = new Socket({params})
  window.appSocket = appSocket
  return appSocket.connect()
}

export function socketLogout() {
  return window.appSocket.disconnect()
}
