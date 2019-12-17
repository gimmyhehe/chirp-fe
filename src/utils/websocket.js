
const ip = '54.144.207.148'
const port = 8888

function serialize(data) {
  return Object.keys(data)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    })
    .join('&')
}

export default function(data){
  if ('WebSocket' in window){
    return new Promise(function (resolve,reject) {
      var response

      var params = serialize(data)
      console.log(params)
      var socket = new WebSocket(`ws:${ip}:${port}?${params}&deviceID=123`)
      socket.onopen = function(e){

      }
      socket.onerror = function(error){
        console.log(`出现异常${error}`)
        reject(error)
      }
      socket.onclose = function(e){
        console.log('关闭连接')
      }
      socket.onmessage = function(e){
        response = e.data
        console.log(response)
        resolve(response)
      }
    })
  }
  alert('你的浏览器不支持WebSocket!')
  return

}
// var curUser

// if(curUser){
//   console.log('当前已登录,请先退出登录!')
// }


// socket = new WebSocket("ws:"+ip+":"+port+"?authToken="+authToken+"&deviceID=123");

