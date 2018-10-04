import React, { Component } from 'react';
import { actions as ipfsActions } from '@solon/redux-ipfs';

class IpfsExplorer extends Component {
  componentDidMount() {
    ipfsActions.config.init()
  }
  render() {
    return (
      <p>Hello</p>
    );
  }
}

export default IpfsExplorer;
