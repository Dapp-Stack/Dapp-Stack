import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isConnected, networkId} from "../units/web3/selectors";
import {networkRequest} from "../units/web3/actions";
import { slide as Menu } from 'react-burger-menu'

class NavHeader extends Component {
  componentDidMount() {
    this.props.networkRequest();
  }

  render() {
    return (
      <Menu pageWrapId={ "page-wrap" }>
        <a id="home" className="menu-item" href="/">Home</a>
        <a id="about" className="menu-item" href="/about">About</a>
        <a id="contact" className="menu-item" href="/contact">Contact</a>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    isConnected: isConnected(state),
    networdId: networkId(state)
  };
}

export default connect(
  mapStateToProps,
  {
    networkRequest: networkRequest
  }
)(NavHeader);
