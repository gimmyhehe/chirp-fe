
import { saveAs } from 'file-saver'
import JsZip from 'jszip'
import { message } from 'antd'
import { getBlobFromUrl } from '@/utils/fileHandle'

/**
 * @description 打包下载文件
 * @param {*} option
 */

export const downloadZip = async (fileList)=>{
  return new Promise( resolve=> {
    var zip = new JsZip()
    let failNum = 0
    if(fileList.length == 0){
      message.info('nothing to download!')
      resolve(null)
    }
    const hide = message.loading('Download Loading...',0)
    let promises = fileList.map( (item)=>{
      return getBlobFromUrl(item.imgUrl || item.fileUrl)
    })
    Promise.all(promises).then( results=> {

      hide()
      results.forEach((item,index) => {
        if(!item){
          failNum ++
          return
        }
        zip.file(getFileName({ ...fileList[index] }, true), item)
      })

      if(failNum!=0) message.warn(`${failNum} photo download fail`)
      zip.generateAsync({type:'blob'})
        .then(function(content) {
          saveAs(content, 'download.zip')
          resolve()
        })
    } )
  })
}

export const downloadOneByOne = async (fileList)=> {
  return new Promise( resolve=> {
    if(fileList.length == 0){
      message.info('nothing to download!')
      resolve(null)
    }
    const hide = message.loading('Download Loading...',0)
    let promises = fileList.map( (item)=>{
      return downloadFile(item.imgUrl || item.fileUrl, item)
    })
    Promise.all(promises)
      .then(()=>{
        hide()
        resolve()
      })
      .catch(()=>{
        hide()
        resolve()
      })
  } )
}

function downloadFile(url, file) {
  return new Promise( resolve=> {
    const fileName = getFileName({...file})
    getBlobFromUrl(url).then(res=>{
      saveAs(res, fileName)
      resolve()
    }).catch(()=> {
      message.error(`${fileName} download fail.`)
      resolve()
    })
  })
}

function getFileName({ ext, name }, random=false ){
  if(random){
    if(ext) return Date.now() + (Math.random()*1000).toFixed(0) + `.${ext}`
    return 'unknow' + Date.now() + (Math.random()*1000).toFixed(0)
  }else{
    if(name) return name
    if(ext) return Date.now() + (Math.random()*1000).toFixed(0) + `.${ext}`
    return 'unknow' + Date.now() + (Math.random()*1000).toFixed(0)
  }
}
