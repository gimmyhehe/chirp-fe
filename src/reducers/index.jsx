import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import user from './user'
import chirps from './chirps'

export default combineReducers({
  router,
  user,
  chirps
})
