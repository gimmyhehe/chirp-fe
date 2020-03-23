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
        console.log(tmp_md5)
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
    const fileAccept = {
      'all' : '*/*',
      'image' : {
        accept : 'image/gif, image/jpeg, image/png',
        limit : 1024*1024*2 // 图片限制大小
      }
    }
    let accept =  config.accept ? config.accept : fileAccept[config.fileType].accept
    const $input = document.createElement('input')
    $input.style.display = 'none'
    $input.setAttribute('type', 'file')
    $input.setAttribute('accept', accept)
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
      const file = e.target.files[0]
      if (!file) {
        return
      }
      if( config.fileType === 'image'){
        if( ['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) == -1){
          message.error('The image type is not support!')
          resolve(null)
        }else if(file.size > fileAccept[config.fileType].limit){
          message.error(`The image is too large! limit ${bytesToSize(fileAccept[config.fileType].limit)}`)
          resolve(null)
        }
        let img = new Image()
        let imgUrl = URL.createObjectURL(file)
        img.onload = function(){
          let { width , height } = thumbnail(img.width,img.height)
          resolve({
            file,
            imgUrl,
            width,
            height
          })
        }
        img.src = imgUrl

      }
    }
    $input.click()
  })


  return result
}


function bytesToSize(bytes) {
  if (bytes === 0) return '0 B'
  var k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

export const thumbnail = function(imgW,imgH,defaultW = 180 , defaultH = 180){
  let max = Math.max(imgW / defaultW , imgH / defaultH)
  return { width : imgW/max , height: imgH/max }
}
