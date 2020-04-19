export const thumbnail = function(imgW,imgH,defaultW = 180 , defaultH = 180){
  if(!imgW || !imgH) return { width: 0, height: 0 }
  let max = Math.max(imgW / defaultW , imgH / defaultH)
  return { width : imgW/max , height: imgH/max }
}

export function getImgWH(imageUrl){
  return new Promise((resolve)=>{
    let img = new Image()
    img.onload = function(){
      let result ={}
      result.width = img.width
      result.height = img.height
      resolve(result)
    }
    img.src = imageUrl
  })

}

export function getBase64(img) {
  if (!img) return
  function getBase64Image(img,width,height) {
    var canvas = document.createElement('canvas')
    canvas.width = width ? width : img.width
    canvas.height = height ? height : img.height

    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    var dataURL = canvas.toDataURL()
    return dataURL.split(',')[1]
  }
  var image = new Image()
  image.crossOrigin = 'Anonymous'
  image.src = img
  return new Promise((resolve)=>{
    image.onload =function (){
      resolve(getBase64Image(image))
    }
    image.onerror = () =>{
      resolve(null)
    }
  })
}
