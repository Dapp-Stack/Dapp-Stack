import * as React from 'react';
import { connect } from 'react-redux';
import ipfs from '@dapp-stack/redux-ipfs';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

import styles from './Ipfs.module.scss'
import { downloadFile } from '../../utils/helpers';
import IpfsSidebar from '../../dev-tools-components/IpfsSidebar';
import Files from '../../dev-tools-components/Files';

class Ipfs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      touchInProgress: false,
      newFolderName: ''
    }
  }

  componentDidMount() {
    this.props.ls();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.root !== this.props.root) {
      this.props.ls();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.ipfsSidebar}>
          <IpfsSidebar position="fixed" 
                       touch={this.touch}
                       touchInProgress={this.state.touchInProgress}
                       mkdir={this.mkdir}
                       error={this.props.error}
                       newFolderName={this.newFolderName}/>
        </div>
        <div className={styles.ipfsBody}>
          <Files
            root={this.props.root}
            cwdUp={this.cwdUp}
            error={this.props.error}
            files={this.props.files}
            icon={this.icon}
            open={this.open}
            delete={this.delete}
            className={styles.ipfsBody}
          />
        </div>
      </React.Fragment>
    );
  }

  open = (file) => {
    if (this.isDirectory(file)) {
      return this.props.cwd(`${this.props.root}${file.name}/`);
    }
    downloadFile(`http://localhost:8080/ipfs/${file.hash}`);
  };

  delete = (file) => {
    if (this.isDirectory(file)) {
      return this.props.rmdir(file.name);
    }

    this.props.rm(file.name);
  };

  cwdUp = () => {
    const paths = this.props.root.split('/');
    paths.pop();
    paths.pop();
    this.props.cwd(`${paths.join('/')}` || '/');
  };

  isDirectory = (file) => file.type === 1;

  icon = (file) => this.isDirectory(file) ? faFolder : faFile;

  touch = (file) => {
    this.setState({touchInProgress: true})
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({touchInProgress: false})
      this.props.touch({ name: file.name, content: reader.result });
    };
    reader.readAsArrayBuffer(file);
  };

  newFolderName = (newFolderName) => {
    this.setState({ newFolderName });
  };

  mkdir = (event) => {
    event.preventDefault();
    this.props.mkdir(this.state.newFolderName);
  };
}

function mapStateToProps(state) {
  return {
    files: state.ipfs.files.list,
    root: state.ipfs.files.root,
    error: state.ipfs.files.error
  };
}

export default connect(
  mapStateToProps,
  {
    ls: ipfs.actions.files.ls,
    touch: ipfs.actions.files.touch,
    mkdir: ipfs.actions.files.mkdir,
    cwd: ipfs.actions.files.cwd,
    rm: ipfs.actions.files.rm,
    rmdir: ipfs.actions.files.rmdir,
  },
)(Ipfs);
