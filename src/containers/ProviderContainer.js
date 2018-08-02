import React, { Component, Children } from "react";
import { connect, Provider } from "react-redux";
import PropTypes from "prop-types";
import createStore from "../units/store";

class Initializer extends Component {
  static propTypes = {
    options: PropTypes.object,
  };

  constructor(props) {
    super(props);

    if (props.provider) {
      props.onInit(props.provider);
    } else if (window.web3 && window.web3.currentProvider) {
      props.onInit(window.web3.currentProvider);
    } else {
      props.onInitFailed();
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInit: provider =>
      dispatch({
        type: "WEB3/INIT",
        provider,
      }),
    onInitFailed: () =>
      dispatch({
        type: "WEB3/INIT_FAILED",
      }),
  };
};

const EnhancedInitializer = connect(
  state => state,
  mapDispatchToProps
)(Initializer);

class ProviderContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (!context.store) {
      this.store = createStore();
    }
  }

  render() {
    if (this.store) {
      return (
        <Provider store={this.store}>
          <EnhancedInitializer {...this.props}>
            {this.props.children}
          </EnhancedInitializer>
        </Provider>
      );
    } else {
      console.log("existing store found");
      return (
        <EnhancedInitializer {...this.props}>
          {this.props.children}
        </EnhancedInitializer>
      );
    }
  }
}

ProviderContainer.contextTypes = {
  store: PropTypes.object,
};

export default ProviderContainer;
