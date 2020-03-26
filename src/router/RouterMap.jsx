import React from 'react'
import { Switch, BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import {AppLayout} from '@components'
import renderRoutes from './renderRoutes'
import routes from './router.js'

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps,null)((props) =>{
  let authed = props.user.uid ? true : false
  console.log(props.user)
  return(
    <Router>
      <Switch>
        <AppLayout>
          {renderRoutes(routes, authed)}
        </AppLayout>
      </Switch>
    </Router>
  )
}
)
