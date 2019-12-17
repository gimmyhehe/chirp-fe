import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import moment from 'moment'
import Calendar from 'react-big-calendar'
import configureStore from './store'
import RouterMap from './router/RouterMap'
import history from './router/history'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'nprogress/nprogress.css'
import 'antd/dist/antd.less'
import './App.less'
import './antd.less'

Calendar.setLocalizer(Calendar.momentLocalizer(moment))
const store = configureStore(history)
render((
  <Provider store={store}>
    <RouterMap history={history}/>
  </Provider>
), document.getElementById('root'))

// if (module.hot) {
//   module.hot.accept()
// }

