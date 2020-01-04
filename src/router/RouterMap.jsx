import React from 'react'
import { Switch, Route , BrowserRouter as Router } from 'react-router-dom'
import {AppLayout} from '@components'
import {
  ChirpJoin,
  SignupForm,
  ChirpAll,
  UserSettings,
  ChirpSetting
} from '@pages'
import SigninPage from '@containers/SigninPage'
export default porps =>{
  return(
    <Router>
      <Switch>
        <AppLayout>
          <Route path="/" exact component={SigninPage} />
          <Route path="/signup" exact component={SignupForm} />
          <Route path="/signin" exact component={SigninPage} />
          <Route path="/chirpjoin" exact component={ChirpJoin} />
          <Route path="/chirpall" exact component={ChirpAll} />
          <Route path="/user/settings" exact component={UserSettings} />
          <Route path="/chirpsetting" exact component={ChirpSetting} />
        </AppLayout>
      </Switch>
    </Router>
  )
}
