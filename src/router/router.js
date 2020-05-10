import {
  ChirpJoin,
  SignupForm,
  ChirpSetting,
  ForgotPassword,
  Reset
} from '@pages'
import SigninPage from '@containers/SigninPage'
import ChirpPage from '@containers/ChirpPage'
import UserSettingPage from '@containers/UserSettingPage'
const routes = [
  { path: '/',
    exact: true,
    component: ChirpJoin,
    requiresAuth: false,
  },
  {
    path: '/signin',
    exact: true,
    component: SigninPage,
    requiresAuth: false,
  },
  {
    path: '/signup',
    exact: true,
    component: SignupForm,
    requiresAuth: false,
  },
  {
    path: '/forgotpassword',
    exact: true,
    component: ForgotPassword,
    requiresAuth: false,
  },
  {
    path: '/chirpjoin',
    exact: true,
    component: ChirpJoin,
    requiresAuth: false,
  },
  {
    path: '/chirpindex',
    exact: true,
    component: ChirpPage,
    requiresAuth: false,
  },
  {
    path: '/chirpsetting',
    exact: true,
    component: ChirpSetting,
    requiresAuth: false,
  },
  {
    path: '/user/settings',
    exact: true,
    component: UserSettingPage,
    requiresAuth: true, //需要登陆后才能跳转的页面
  },
  {
    path: '/reset',
    exact: true,
    component: Reset,
    requiresAuth: false
  }
]

export default routes
