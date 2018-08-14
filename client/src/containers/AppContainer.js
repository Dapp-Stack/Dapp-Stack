import {ConnectedRouter} from "connected-react-router";
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Route, Switch} from "react-router-dom";

import history from '../history';
import Layout from '../components/Layout';
import NoMatch from "../components/NoMatch";
import actions  from "../units/accounts/actions";
import { isConnected, networkId } from "../units/web3/selectors";
import { accounts } from "../units/accounts/selectors";

class AppContainer extends Component {
  componentDidMount() {
    this.props.getAccountsRequest();
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout {...this.props}>
          <Switch>
            <Route exact path="/" component={NoMatch} />
            <Route component={NoMatch} />
          </Switch>
        </Layout>
      </ConnectedRouter>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    isConnected: isConnected(state),
    networkId: networkId(state),
    accounts: accounts(state)
  };
};

export default connect(
  mapStateToProps,
  {
    getAccountsRequest: actions.getAccountsRequest
  },
)(AppContainer);
