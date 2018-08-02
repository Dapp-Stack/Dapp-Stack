import {ConnectedRouter} from "connected-react-router";
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Route, Switch} from "react-router-dom";

import history from '../history';
import Layout from '../components/Layout';
import NoMatch from "../components/NoMatch";

class AppContainer extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout>
          <p>hello{this.props.isLoading} {this.props.accounts}</p>
          <Switch>
            <Route exact path="/" component={NoMatch} />
            <Route component={NoMatch} />
          </Switch>
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default connect(({ accounts }) => ({
  isLoading: accounts.isLoading,
  accounts: accounts.items
}))(AppContainer);
