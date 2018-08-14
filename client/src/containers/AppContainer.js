import {ConnectedRouter} from "connected-react-router";
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Route, Switch} from "react-router-dom";

import history from '../history';
import Layout from '../components/Layout';
import NoMatch from "../components/NoMatch";
import actions  from "../units/accounts/actions";

class AppContainer extends Component {
  componentDidMount() {
    this.props.getAccountsRequest();
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" component={NoMatch} />
            <Route component={NoMatch} />
          </Switch>
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default connect(
  null,
  {
    getAccountsRequest: actions.getAccountsRequest
  },
)(AppContainer);
