import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import moment from 'moment'
import Calendar from 'react-big-calendar'
import RouterMap from './router/RouterMap'
import history from './router/history'
import { store } from './store'
import cookies from '@utils/cookies'
import { doLogin } from './actions/user'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'nprogress/nprogress.css'
import 'antd/dist/antd.less'
import './App.less'
import './antd.less'

Calendar.setLocalizer(Calendar.momentLocalizer(moment))

if(cookies.get('password')){
  let values = {
    email: cookies.get('userName'),
    password: cookies.get('password'),
    deviceID: '123'
  }
  store.dispatch(doLogin(values)).then(()=>{
  })
}


render((
  <Provider store={store}>
    <RouterMap history={history}/>
  </Provider>
), document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}

