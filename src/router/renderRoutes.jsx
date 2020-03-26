import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { message } from 'antd'
const renderRoutes = (routes, authed, authPath = '/signin', extraProps = {}, switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={(props) => {
          if (!route.requiresAuth || authed || route.path === authPath) {
            return <route.component {...props} {...extraProps} route={route} />
          }
          message.warn('you should login first')
          return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
        }}
      />
    ))}
    <Route render={ () => <Redirect to="/" /> } />
  </Switch>
) : null
export default renderRoutes
