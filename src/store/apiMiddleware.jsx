import { push } from 'react-router-redux'

/**
 * 这个中间件是来判断向后台取数据的时候，用户是否已经登录
 * 如果已经登录，则进行下一个 action 的操作
 * 如果没有登录，则跳回首页，进行登录操作
 */
export default store => next => action => {
  const { router: { location } } = store.getState()
  const isUnauthorized = location !== null
  && location.pathname !== '/'
  && action.error
  && (action.error.message === '0' || action.error.message === '401')

  if (isUnauthorized) {
    store.dispatch(push('/', { isUnauthorized }))
  } else {
    return next(action)
  }
}
