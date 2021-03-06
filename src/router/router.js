import {
  ChirpJoin,
  SignupForm,
  ChirpIndex,
  UserSettings,
  ChirpSetting
} from '@pages'
import SigninPage from '@containers/SigninPage'
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
    component: ChirpIndex,
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
    component: UserSettings,
    requiresAuth: true, //需要登陆后才能跳转的页面
  },
]

export default routes
