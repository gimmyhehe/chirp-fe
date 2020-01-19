import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import moment from 'moment'
import Calendar from 'react-big-calendar'
import { store } from './store'
import RouterMap from './router/RouterMap'
import history from './router/history'

import cookies from '@utils/cookies'
import api from '@api'
import NProgress from 'nprogress'
import { getUserInfo } from './actions/user'
import { getChirpList } from './actions/chirps'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'nprogress/nprogress.css'
import 'antd/dist/antd.less'
import './App.less'
import './antd.less'

Calendar.setLocalizer(Calendar.momentLocalizer(moment))

if(cookies.get('password')){
  NProgress.start()
  let values = {
    email: cookies.get('userName'),
    password: cookies.get('password'),
    deviceID: '123'
  }
  api.login(values).then(async (response)=>{
    response = JSON.parse(response)
    await store.dispatch(getUserInfo())
    await store.dispatch(getChirpList())
    if (response.code == 10007) {
      NProgress.set(0.5)
      NProgress.done()
      // this.props.history.push('chirpall')
    } else {
      NProgress.done()
      this.setState({
        error: true
      })
    }
    NProgress.done()
  },e=>{ console.log(e) })
}


render((
  <Provider store={store}>
    <RouterMap history={history}/>
  </Provider>
), document.getElementById('root'))

// if (module.hot) {
//   module.hot.accept()
// }

