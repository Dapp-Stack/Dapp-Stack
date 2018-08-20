import React, { Component, Children } from "react";
import { connect, Provider } from "react-redux";
import PropTypes from "prop-types";
import createStore from "../units/store";
import {initWeb3Request} from "../units/web3/actions"

class Initializer extends Component {
  static propTypes = {
    options: PropTypes.object,
  };

  constructor(props) {
    super(props);

    if (window.web3 && window.web3.currentProvider) {
      props.onInit({ provider: window.web3.currentProvider });
    } else {
      props.onInit({ provider: "ws://localhost:8546" });
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

const EnhancedInitializer = connect(
  state => state,
  {
    onInit: initWeb3Request
  }
)(Initializer);

class ProviderContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (!context.store) {
      this.store = createStore();
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <EnhancedInitializer {...this.props}>
          {this.props.children}
        </EnhancedInitializer>
      </Provider>
    );
  }
}

ProviderContainer.contextTypes = {
  store: PropTypes.object,
};

export default ProviderContainer;
