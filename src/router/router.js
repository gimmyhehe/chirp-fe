import {
  ChirpJoin,
  SignupForm,
  ChirpSetting
} from '@pages'
import SigninPage from '@containers/SigninPage'
import ChirpPage from '@containers/ChirpPage'
import UserSettingPage from '@containers/UserSettingPage'
const routes = [
  { path: '/',
    exact: true,
    component: SigninPage,
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
    path: '/chirpjoin',
    exact: true,
    component: ChirpJoin,
    requiresAuth: true,
  },
  {
    path: '/chirpindex',
    exact: true,
    component: ChirpPage,
    requiresAuth: true,
  },
  {
    path: '/chirpsetting',
    exact: true,
    component: ChirpSetting,
    requiresAuth: true,
  },
  {
    path: '/user/settings',
    exact: true,
    component: UserSettingPage,
    requiresAuth: true, //需要登陆后才能跳转的页面
  },
]

export default routes
