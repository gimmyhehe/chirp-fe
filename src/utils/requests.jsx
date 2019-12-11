require('es6-promise').polyfill()
require('isomorphic-fetch')

import { requestErrorHandler } from './errorHandler'

const headers = new Headers({
  Accept: '*/*',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest'
})

const uploadOptions = {
  mode: 'no-cors',
  credentials: 'include'
}

const options = {
  ...uploadOptions,
  headers
}

/**
 * 对表单的数据进行序列化
 * @param {object} data 表单数据（注意类型不是 FormData）
 */
function serialize(data) {
  return Object.keys(data)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    })
    .join('&')
}

/**
 * 将字符串转换成对象 Object，如果失败则返回该字符串
 * @param {string} text 要转换的字符串
 */
function parse(text) {
  try {
    const data = JSON.parse(text)
    return data
  } catch (e) {
    if (e instanceof SyntaxError) {
      return text
    } else {
      throw e
    }
  }
}

function getFetchOptions(data, fetchOptions) {
  let body, option
  if (data instanceof FormData) {
    body = data
    option = uploadOptions
  } else {
    body = serialize(data)
    option = options
  }

  return Object.assign({ body }, option, fetchOptions)
}

async function ajax(url, fetchOptions) {
  try {
    const response = await fetch(url, fetchOptions)
    const text = parse(await response.text())
    if (response.ok) {
      return text
    } else {
      const { status, statusText } = response
      throw {
        status,
        statusText,
        text
      }
    }
  } catch (error) {
    requestErrorHandler(error)
  }
}

export default {
  /**
   * 模拟 HTTP GET 方法
   * @param {string} url 要访问的 url
   */
  get(url) {
    return ajax(url, options)
  },
  /**
   * 模拟 HTTP POST 方法
   * @param {string}            url         要访问的 url
   * @param {object|FormData}   data        要发送的数据
   */
  post(url, data) {
    return ajax(
      url,
      getFetchOptions(data, {
        method: 'POST'
      })
    )
  },
  /**
   * 模拟 HTTP PUT 方法
   * @param {string}            url         要访问的 url
   * @param {object|FormData}   data        要发送的数据
   */
  put(url, data) {
    return ajax(
      url,
      getFetchOptions(data, {
        method: 'PUT'
      })
    )
  },
  /**
   * 模拟 HTTP DELETE 方法
   * @param {string}            url         要访问的 url
   * @param {object|FormData}   data        要发送的数据
   */
  delete(url, data) {
    return ajax(
      url,
      getFetchOptions(data, {
        method: 'DELETE'
      })
    )
  }
}
