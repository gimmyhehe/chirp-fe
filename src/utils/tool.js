/*
 * @Author: your name
 * @Date: 2019-12-27 00:12:36
 * @LastEditTime : 2019-12-29 11:49:03
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\utils\tool.js
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * @description: 把url中的参数格式化为对象
 * @param {String} http://www.xxx.com/test?name=zhangshan&age=100#hello
 * @return: {name: "zhangshan", age: "100"}
 */
export function getParams(url) {
  try {
    var index = url.indexOf('?')
    url = url.match(/\?([^#]+)/)[1]
    var obj = {}, arr = url.split('&')
    for (var i = 0; i < arr.length; i++) {
      var subArr = arr[i].split('=')
      var key = decodeURIComponent(subArr[0])
      var value = decodeURIComponent(subArr[1])
      obj[key] = value
    }
    return obj

  } catch (err) {
    return null
  }
}
