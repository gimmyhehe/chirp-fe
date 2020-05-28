import SparkMD5 from 'spark-md5'
import { message } from 'antd'

export const get_filemd5sum = (ofile) => {
  return new Promise((resolve,reject)=>{
    var file = ofile
    var tmp_md5
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      // file = this.files[0],
      chunkSize = 8097152, // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader()

    fileReader.onload = function(e) {
      // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
      spark.append(e.target.result) // Append array buffer
      currentChunk++
      var md5_progress = Math.floor((currentChunk / chunks) * 100)

      console.log(file.name + '  正在处理，请稍等,' + '已完成' + md5_progress + '%')
      if (currentChunk < chunks) {
        loadNext()
      } else {
        tmp_md5 = spark.end()
        resolve(tmp_md5)
      }
    }

    fileReader.onerror = function() {
      reject('error')
    }

    function loadNext() {
      var start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
  })
}

/**
 * 读取本地文件
 * @param {string} resultType 数据类型, {blob|base64}, 默认blob
 * @param {string} accept 可选文件类型, 默认 * / *
 */
export  async function readDiskFile( config = { fileType : 'all'} ) {
  const result = await new Promise((resolve) => {
    const fileAcceptType = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/x-zip-compressed',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.ppt',
      '.pptx',
      '.doc',
      '.docx',
      '.zip',
      '.xls',
      '.xlsx',
      'pdf'
    ]
    const videoAcceptType =[
      'video/*',
      '.ogm',
      '.wmv',
      '.mpg',
      '.webm',
      '.ogv',
      '.mov',
      '.asx',
      '.mpeg',
      '.mp4',
      '.m4v',
      '.avi',
    ]
    const acceptConfig = {
      'all' : '*/*',
      'image' : {
        accept : 'image/gif, image/jpeg, image/png',
        limit : 1024*1024*3 // 图片限制大小
      },
      file: {
        accept : fileAcceptType.join(','),
        limit : 1024*1024*100 // 文件限制大小
      },
      video: {
        accept : videoAcceptType.join(','),
        limit : 1024*1024*100 // 视频限制大小
      }
    }
    let accept =  config.accept ? config.accept : acceptConfig[config.fileType].accept
    const $input = document.createElement('input')
    $input.style.display = 'none'
    $input.setAttribute('type', 'file')
    $input.setAttribute('accept', accept)
    $input.setAttribute('multiple', 'multiple')
    // 判断用户是否点击取消, 原生没有提供专门事件, 用hack的方法实现
    $input.onclick = () => {
      $input.value = null
      document.body.onfocus = () => {
        // onfocus事件会比$input.onchange事件先触发, 因此需要延迟一段时间
        setTimeout(() => {
          if ($input.value.length === 0) {
            resolve(null)
          }
          document.body.onfocus = null
        }, 500)
      }
    }
    $input.onchange = (e) => {
      // @ts-ignore
      const files = e.target.files
      // resolve(files)


      if (!files) {
        return
      }
      let fileResult = []
      let fileCallback = file => {
        const { name, size, type } = file
        const ext = getFileExt( name )
        if( config.fileType === 'image'){
          if( ['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) == -1){
            message.error('The image type is not support.')
            fileResult.push(null)
          }
          else if(file.size > acceptConfig[config.fileType].limit){
            message.error(`The image is too large! limit ${bytesToSize(acceptConfig[config.fileType].limit)}`)
            fileResult.push(null)
          }
          else{
            let imgUrl = URL.createObjectURL(file)
            fileResult.push({ file, imgUrl, name, size, type, ext})
          }
        }
        else if (config.fileType === 'video') {
          const { name, size, type } = file
          const ext = getFileExt( name )
          if( !videoAcceptType.includes(file.type) && !videoAcceptType.includes('.'+ext) ){
            message.error('The video type is not support.')
            fileResult.push(null)
          }
          else if(file.size > acceptConfig[config.fileType].limit){
            message.error(`The file is too large! limit ${bytesToSize(acceptConfig[config.fileType].limit)}`)
            fileResult.push(null)
          }
          else{
            let fileUrl = null
            fileResult.push({ file, fileUrl, name, size, type, ext })
          }
        }
        else{
          const { name, size, type } = file
          const ext = getFileExt( name )

          if( !fileAcceptType.includes(file.type) && !fileAcceptType.includes('.'+ext) ){
            message.error('The file type is not support.')
            fileResult.push(null)

          }
          else if(file.size > acceptConfig[config.fileType].limit){
            message.error(`The file is too large! limit ${bytesToSize(acceptConfig[config.fileType].limit)}`)
            fileResult.push(null)
          }
          else{
            let fileUrl = null

            fileResult.push({ file, fileUrl, name, size, type, ext })
          }
        }

      }
      Array.prototype.forEach.call(files,fileCallback)
      resolve(fileResult)
    }
    $input.click()
  })


  return result
}


export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B'
  var k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

export const thumbnail = function(imgW,imgH,defaultW = 180 , defaultH = 180){
  if(!imgW || !imgH) return { width: 0, height: 0 }
  let max = Math.max(imgW / defaultW , imgH / defaultH)
  return { width : imgW/max , height: imgH/max }
}

export function getFileExt(filename) {

  var index= filename.lastIndexOf('.')
  var ext = filename.substr(index+1)
  return ext.toLowerCase()
}

export function getBlobFromUrl(url) {
  return new Promise(resolve=> {

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }else{
        resolve(null)
      }
    }
    xhr.onprogress = (event)=>{
      // console.log(event.lengthComputable)
      // console.log(event.loaded)
      // console.log(event.total)
    }
    xhr.onerror = ()=> {
      resolve(null)
    }
    xhr.send()
  })
}
