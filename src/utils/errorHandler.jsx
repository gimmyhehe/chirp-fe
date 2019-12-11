import { message } from 'antd'
import history from '../routes/history'
import NProgress from 'nprogress'
import cookies from '@utils/cookies'

export function requestErrorHandler(error) {
  let errorMessage = ''
  if (error instanceof TypeError) {
    errorMessage = 'Please check your Network!'
  } else {
    switch (error.status) {
      case 0:
      case 401:
      case 500:
        if (!cookies.get('userName')) {
          message.error('Please Login!')
          history.replace({
            pathname: '/',
            state: {
              from: location.pathname
            }
          })
        }
        break
      case 501:
      case 502:
      case 503:
      case 504:
      default:
        errorMessage = 'The System is busy now, please try again later!'
        break
    }
  }

  NProgress.done()
  if (errorMessage) {
    message.error(errorMessage)
  }
}
