import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import clients from './clients'
import user from './user'
import works from './works'
import staffs from './staffs'
import invoices from './invoices'

export default combineReducers({
  router,
  clients,
  user,
  staffs,
  works,
  invoices
})
