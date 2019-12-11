import React from 'react'
import { Switch, Route , BrowserRouter as Router } from 'react-router-dom'
import {AppLayout} from '@components'
import { ChirpJoin } from '@containers'
function About(){
  return(
    <div>this is router</div>
  )
}

function About2(){
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
          <Route path="/signup" exact component={About2} />
          <Route path="/signin" exact component={About2} />
          <Route path="/chirpjoin" exact component={ChirpJoin} />
        </AppLayout>
      </Switch>
    </Router>
  )
}
