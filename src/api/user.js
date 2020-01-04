/*
 * @Author: your name
 * @Date: 2019-12-29 01:23:22
 * @LastEditTime : 2019-12-29 02:11:25
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\api\user.js
 */


export function getUserInfo(){
  return new Promise((reslove,reject)=>{
    // reslove(123)
    let createChirp ={
      cmd: 17,
      type: '0',
      uid: 'b9bd443f-ecc8-4276-a6a9-fb30f05f7b0a'
    }
    window.appSocket.sendRequest(JSON.stringify(createChirp),function(res){
      let data = JSON.parse(res.data)
      console.log(data)
      reslove(data)
    })
  })
}

export default {
  getUserInfo,
}
