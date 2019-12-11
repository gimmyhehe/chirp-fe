export default {
  // 读取 Cookie
  get(name) {
    const cookieName = `${encodeURIComponent(name)}=`
    const cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length
      }

      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      )
    }

    return cookieValue
  },
  // 设置 Cookie
  set(name, value, options = {}) {
    const { expires, path, domain, secure } = options
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    if (expires) {
      let _expires
      switch (expires.constructor) {
        case String:
          if (/^(?:\d{1,}(y|m|d|h|min|s))$/i.test(expires)) {
            // get capture number group
            let _expireTime = expires.replace(
              /^(\d{1,})(?:y|m|d|h|min|s)$/i,
              '$1'
            )
            // get capture type group , to lower case
            switch (
              expires
                .replace(/^(?:\d{1,})(y|m|d|h|min|s)$/i, '$1')
                .toLowerCase()
            ) {
              // Frequency sorting
              case 'y':
                _expires = +_expireTime * 31104000
                break // 60 * 60 * 24 * 30 * 12
              case 'm':
                _expires = +_expireTime * 2592000
                break // 60 * 60 * 24 * 30
              case 'd':
                _expires = +_expireTime * 86400
                break // 60 * 60 * 24
              case 'h':
                _expires = +_expireTime * 3600
                break // 60 * 60
              case 'min':
                _expires = +_expireTime * 60
                break // 60
              case 's':
                _expires = _expireTime
                break
              default:
                throw new Error('unknown exception of \'set operation\'')
            }
          } else {
            _expires = expires
          }
          break
        case Number:
          _expires = expires
          break
        case Date:
          _expires = parseInt((expires.getTime() - new Date().getTime()) / 1000)
          break
      }

      cookieText += `; max-age=${_expires}`
    }

    if (path) cookieText += `; path=${path}`
    if (domain) cookieText += `; domain=${domain}`
    if (secure) cookieText += '; secure'

    document.cookie = cookieText
  },
  // 删除 Cookie
  remove(name, options) {
    this.set(name, '', {
      ...options,
      expires: 0
    })
  }
}
