/*
 * @Author: your name
 * @Date: 2020-01-05 10:12:49
 * @LastEditTime : 2020-01-21 19:35:40
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\actions\chirps.js
 */
import {
  CHIRPS_INFO_PENDING, CHIRPS_INFO_FULFILLED, CHIRPS_INFO_REJECTED,
  CURRENT_CHIRP_PENDING, CURRENT_CHIRP_FULFILLED, CURRENT_CHIRP_REJECTED,
  SET_CHIRP_PENDING, SET_CHIRP_FULFILLED, SET_CHIRP_REJECTED
} from '@constants/actionTypes'
import cookies from '@utils/cookies'
import api from '@api'

export function getChirpList() {
  return async (dispatch) => {
    dispatch({ type: CHIRPS_INFO_PENDING, data: 'loading' })
    try {
      let params ={
        cmd: 25,
        memberId: cookies.get('uid')
      }
      console.log(cookies.get('uid'))
      const {data} = await api.getChirpList(params)
      console.log('-----------66666666666---------')
      dispatch({ type: CHIRPS_INFO_FULFILLED, data })
    } catch (error) {

      dispatch({ type: CHIRPS_INFO_REJECTED, error })

    }
  }
}

export function getCurrentChirp(chirp) {
  return async (dispatch) =>{
    dispatch({ type: CURRENT_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: CURRENT_CHIRP_FULFILLED, chirp })
    }catch(error){
      dispatch({ type: CURRENT_CHIRP_REJECTED, error })
    }
  }
}

export function setChirpList(data) {
  return async (dispatch) =>{
    dispatch({ type: SET_CHIRP_PENDING, data: 'loading' })
    try{
      dispatch({ type: SET_CHIRP_FULFILLED, data })
    }catch(error){
      dispatch({ type: SET_CHIRP_REJECTED, error })
    }
  }
}


