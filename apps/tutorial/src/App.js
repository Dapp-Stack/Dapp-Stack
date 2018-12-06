import React from 'react';
import eth from '@dapp-stack/redux-eth';
import ipfs from '@dapp-stack/redux-ipfs';
import { connect } from 'react-redux';
  
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: null, uploading: false, transaction: null, fileHash: '' };
  }

  componentDidMount() {
    this.props.ethStart();
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.network && this.props.network) {
      this.props.loadContracts(window.tracker[this.props.network.chainId]);
    }

    if (!this.state.file || this.state.fileHash || !this.props.files.length > 0) {
      return;
    }
     
    const file = this.props.files.find((f) => f.name === this.state.file.name)

    if (!file) {
      return;
    }

    this.setState({file: null});
    try {
      await window.ethereum.enable();
      const transaction = await this.props.contracts.SimpleStorage.set(file.hash);
      await transaction.wait();
      this.setState({ transaction });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <p>Network: {this.props.network && this.props.network.name}</p>
          <input type="file" onChange={this.setFile}/>
          {!this.state.uploading && <button onClick={this.uploadFile}>Upload</button>}
          {this.state.uploading && <span>Uploading...</span>}
        </div>
        <div>
          {this.state.transaction && 
            <p>Transaction Hash: {this.state.transaction.hash}</p>
          }
        </div>
        <div>
          <button onClick={this.getFileHash}>Get File Hash</button>

          <p>File Hash: {this.state.fileHash}</p>
        </div>
      </React.Fragment>
    );
  }

  setFile = (event) => {
    this.setState({ file: event.target.files[0] })
  }

  uploadFile = (event) => {
    event.preventDefault();

    if (!this.state.file) {
      return;
    }

    this.setState({uploading: true})
    const reader = new FileReader();
    reader.onload = () => {
      this.props.touch({ name: this.state.file.name, content: reader.result });
      this.setState({uploading: false});
    };
    reader.readAsArrayBuffer(this.state.file);
  }

  getFileHash = async (event) => {
    event.preventDefault();
    debugger
    const fileHash = await this.props.contracts.SimpleStorage.get();
    this.setState({ fileHash });
  }
}

function mapStateToProps(state) {
  return {
    contracts: state.eth.contracts,
    network: state.eth.provider.network,
    files: state.ipfs.files.list
  };
}

const App = connect(
  mapStateToProps,
  {
    ethStart: eth.actions.provider.start,
    loadContracts: eth.actions.contracts.load,
    touch: ipfs.actions.files.touch,
  }
)(AppComponent);

export default App;