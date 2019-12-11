
const ip = '52.90.125.239'
const port = 8888

export default function(){
  if ('WebSocket' in window){
    return 11
  }
  alert('你的浏览器不支持WebSocket!')
  return
}
// var curUser

// if(curUser){
//   console.log('当前已登录,请先退出登录!')
// }


// //socket = new WebSocket("ws:"+ip+":"+port+"?authToken="+authToken+"&deviceID=123");
// var socket = new WebSocket('ws:'+ip+':'+port+'?email='+email+'&password='+password+'&deviceID=123')
// socket.onopen = function(e){

// }
// socket.onerror = function(error){
//   console.log(`出现异常${error}`)
// }
// socket.onclose = function(e){
//   curUser = null
//   console.log('关闭连接')
// }
// socket.onmessage = function(e){
//   var data = e.data
//   console.log(data)
// }
