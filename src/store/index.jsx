import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducers from '@reducers'
import apiMiddleware from './apiMiddleware'

const initialState = window.__INITIAL_STATE__ || {}

export default history => {
  const middleware = [
    thunk,
    apiMiddleware,
    routerMiddleware(history)
  ]

  // eslint-disable-next-line
  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger()
    middleware.push(logger)
  }

  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(...middleware)
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('@reducers', () => {
      const nextRootReducer = require('@reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
