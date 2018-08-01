import React from 'react';
import { Route, Switch } from 'react-router';
import NoMatch from './components/NoMatch';

const routes = (
  <React.Fragment>
    <Switch>
      <Route exact path="/" component={NoMatch} />
      <Route component={NoMatch} />
    </Switch>
  </React.Fragment>
)

export default routes
