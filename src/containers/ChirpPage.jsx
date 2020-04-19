import { connect } from 'react-redux'
import { ChirpIndex } from '@pages'
import cookies from '@utils/cookies'
// chirpSetting={},chirpMessage=[], fileList = [], videoList = []

const getChirpSetting = (currentChirp)=> {
  if(!currentChirp) return {}
  return {
    expirationDay: (currentChirp.expiredDate - currentChirp.createTime) / (24*60*60*1000),
    pwdChecked: !!currentChirp.passwordEnabled,
    uploadPermission: !!currentChirp.uploadPermissionEnabled,
    password: ''
  }
}

const getList = (allChirpsMessage, chirpId) =>{
  let msgList = [], photosList = [], fileList = [], videoList = []
  if(JSON.stringify(allChirpsMessage)==='{}' || !chirpId){
    return { msgList, photosList, fileList, videoList }
  }
  msgList = allChirpsMessage[chirpId]

  msgList.forEach(element => {
    if(element.from == cookies.get('uid')){
      element.isSelf = true
    }else{
      element.isSelf = false
    }

    if( +element.msgType === 1 ){
      photosList = photosList.concat(element.fileList)
    }else if( +element.msgType === 2 ){
      fileList = fileList.concat(element.fileList)
    }else if( +element.msgType === 3 ){
      videoList = videoList.concat(element.fileList)
    }

  })
  return { msgList, photosList, fileList, videoList }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state , ownProps)
  const { chirps } = state
  const { currentChirp, allChirpsMessage } = chirps
  const currentChirpId = currentChirp ? currentChirp.id : null
  return{
    currentChirpId,
    currentChirp,
    chirps: state.chirps,
    chirpSetting: getChirpSetting(currentChirp),
    ...getList(allChirpsMessage, currentChirpId)
  }
}

export default connect(mapStateToProps, null )(ChirpIndex)
