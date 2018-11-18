import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styles from './Blocks.module.scss';

import Loader from '../../components/Loader';
import NetworkStats from '../NetworkStats';
import BlocksPanel from '../BlocksPanel';

class BlocksComponent extends React.Component {
  render() {
    const { transactionCount, blockNumber, address, gasPrice, balance } = this.props
    if (transactionCount === undefined || blockNumber === undefined || !address || gasPrice === undefined || balance === undefined){
      return (
        <div className={`${styles.loadingBody}`}>
          <Loader color="blue" size="medium" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={`pageWrapper-large ${styles.desktopContainer}`}>
          <NetworkStats />
          <div className={styles.panelContainer}>
            <BlocksPanel className={styles.blocksPanel}
                         bodyClass={styles.bodyClass}/>
          </div>
        </div>
        <div className={styles.mobileContainer}>
          <NetworkStats />
          <BlocksPanel className={styles.blocksPanel}
                       bodyClass={styles.bodyClass} />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const blockNumber = state.eth.provider.blockNumber;
  const transactionCount = state.eth.provider.transactionCount;
  const address = state.eth.provider.address;
  const balance = state.eth.provider.balance;
  const gasPrice = state.eth.provider.gasPrice;
  
  return {
    transactionCount,
    blockNumber,
    address,
    gasPrice,
    balance
  };
};

const Blocks = compose(
  connect(
    mapStateToProps,
    {}
  )(BlocksComponent)
);

export default Blocks;