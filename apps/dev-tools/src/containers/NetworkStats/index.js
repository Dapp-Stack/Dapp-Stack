import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './NetworkStats.module.scss';
import Text from '../../components/Text';
import Avatar from '../../components/Avatar';
import { weiToEther, weiToGwei } from '../../utils/helpers';

class NetworkStatsComponent extends React.Component {
  render() {
    const { transactionCount, blockNumber, address, gasPrice, balance } = this.props;

    const renderStat = (value, label) => {
      return (
        <div className={styles.stat}>
          <Text className={styles.statValue} typeScale="h1" color="purple">
            {value}
          </Text>
          <Text
            className={styles.statLabel}
            typeScale="Small"
            color="defaultGrey"
          >
            {label}
          </Text>
        </div>
      );
    };

    return (
      <div className={styles.dashboardHeader}>
        <div className={styles.dashboardAvatar}>
          <Avatar
            size="large"
            border
            nameTextScale="h2"
            nameTextWeight="fontWeight-bold"
            address={address}
            hash={address}
            className={styles.alignLeft}
            link={false}
          />
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.stats}>
            {renderStat(balance, 'Balance (Eth)')}
            {renderStat(gasPrice, 'Gas Price (Gwei)')}
            {renderStat(transactionCount, 'Tx Count')}
            {renderStat(blockNumber, 'Block Number')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const blockNumber = state.eth.provider.blockNumber;
  const transactionCount = state.eth.provider.transactionCount;
  const address = state.eth.provider.address;
  const balance = weiToEther(state.eth.provider.balance).toFixed(6);
  const gasPrice = weiToGwei(state.eth.provider.gasPrice);
  
  return {
    transactionCount,
    blockNumber,
    address,
    gasPrice,
    balance
  };
};

const NetworkStats = compose(
  connect(
    mapStateToProps,
    {}
  )(NetworkStatsComponent)
);

export default NetworkStats;