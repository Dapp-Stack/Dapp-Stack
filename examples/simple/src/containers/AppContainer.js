import { ConnectedRouter } from 'connected-react-router';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import history from '../history';
import AppLayout from '../layouts/AppLayout';
import IpfsExplorer from './IpfsExplorer';
import NoMatch from '../components/NoMatch';

class AppContainer extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <AppLayout {...this.props}>
          <Switch>
            <Route exact path="/" component={NoMatch} />
            <Route exact path="/ipfs-explorer" component={IpfsExplorer} />
            <Route component={NoMatch} />
          </Switch>
        </AppLayout>
      </ConnectedRouter>
    );
  }
}


export default AppContainer;
