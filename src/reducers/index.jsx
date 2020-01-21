import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import clients from './clients'
import user from './user'
import chirps from './chirps'

export default combineReducers({
  router,
  clients,
  user,
  chirps
})
