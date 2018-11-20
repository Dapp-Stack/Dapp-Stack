import * as React from 'react';
import { connect } from 'react-redux';
import eth from '@dapp-stack/redux-eth';
import styles from './Contracts.module.scss';
import Loader from '../../components/Loader';
import ContractFunction from '../../dev-tools-components/ContractFunction';
import ContractsSidebar from '../../dev-tools-components/ContractsSidebar';
import { actions as trackerActions } from '../../modules/Tracker'

class Contracts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeContract: '',
    }
  }

  componentDidMount() {
    this.props.getTracker();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.tracker && this.props.tracker) {
      this.props.loadContracts(this.props.tracker);
    }

    if (Object.keys(prevProps.contracts).length === 0 && Object.keys(this.props.contracts).length > 0) {
      this.switchContract(Object.keys(this.props.contracts)[0]);
    }
  }

  render() {
    if (this.props.loading) {
      return (
        <div className={styles.bodyLoading}>
          <Loader color="blue" size="medium" />
        </div>
      );
    }
    
    return (
      <React.Fragment>
        <div className={styles.contractsSidebar}>
          <ContractsSidebar position="fixed"
                            switchContract={this.switchContract}
                            contracts={this.props.contracts} />
        </div>
        <div className={styles.contractsBody}>
          <ContractFunction error={this.props.error} 
                            contractName={this.state.activeContract}
                            contract={this.props.contracts[this.state.activeContract]} />
        </div>
      </React.Fragment>
    );
  }

  switchContract = (name) => {
    this.setState({ activeContract: name });
  };
}

function mapStateToProps(state) {
  const trackerData = state.tracker.data
  let tracker;
  if (trackerData) {
    tracker = trackerData[state.eth.provider.network.chainId]
  }

  return {
    loading: state.tracker.loading,
    error: state.tracker.error,
    contracts: state.eth.contracts,
    tracker
  };
}

export default connect(
  mapStateToProps,
  {
    getTracker: trackerActions.getTracker,
    loadContracts: eth.actions.contracts.load,
  },
)(Contracts);
