import React from 'react'
import { Switch, Route , BrowserRouter as Router } from 'react-router-dom'
import {AppLayout} from '@components'
import {
  ChirpJoin,
  SigninForm,
  SignupForm,
  ChirpAll,
  UserSettings,
  ChirpSetting
} from '@containers'
function About(){
  return(
    <div>this is router</div>
  )
}
export default porps =>{
  return(
    <Router>
      <Switch>
        <AppLayout>
          <Route path="/" exact component={About} />
          <Route path="/signup" exact component={SignupForm} />
          <Route path="/signin" exact component={SigninForm} />
          <Route path="/chirpjoin" exact component={ChirpJoin} />
          <Route path="/chirpall" exact component={ChirpAll} />
          <Route path="/user/settings" exact component={UserSettings} />
          <Route path="/chirp/setting" exact component={ChirpSetting} />
        </AppLayout>
      </Switch>
    </Router>
  )
}
