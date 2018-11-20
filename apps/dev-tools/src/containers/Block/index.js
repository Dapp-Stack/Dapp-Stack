import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import eth from '@dapp-stack/redux-eth';

import styles from './Block.module.scss';

import Loader from '../../components/Loader';
import Text from '../../components/Text';
import Card from '../../components/Card';
import ZeroState from '../../components/ZeroState';
import BlockCard from '../../dev-tools-components/BlockCard';
import BlockTransactions from '../../dev-tools-components/BlockTransactions';

class BlockComponent extends React.Component {
  componentDidMount() {
    if (this.props.block) {
      this.loadTransactions();
    } else {
      this.props.findBlock(parseInt(this.props.match.params.number, 10));
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.block && this.props.block) {
      this.loadTransactions()
    }
  }

  loadTransactions() {
    this.props.block.transactions.forEach(hash => {
      this.props.findTransaction(hash);
    });
  }

  render() {
    const { block, transactionCount, blockNumber, address, gasPrice, balance } = this.props
    if (!transactionCount === undefined || blockNumber === undefined || !address || gasPrice === undefined || balance === undefined){
      return (
        <div className={`${styles.loadingBody}`}>
          <Loader color="blue" size="medium" />
        </div>
      );
    }

    if (!block) {
      return (
        <div className={styles.noBlockWrapper}>
          <div className={`${styles.noBlock}`}>
            <Card className={styles.notBlockCard}>
              <Card.Body>
                <ZeroState
                  title={'No block.'}
                >
                  <ZeroState.BodyText>
                    We could not find the block with the following number:
                    {this.props.match.params.number}. Make sure you enter
                    a correct block number.
                  </ZeroState.BodyText>
                </ZeroState>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={`pageWrapper-large ${styles.desktopContainer}`}>
          <Text typeScale="h1" weight="fontWeight-medium" className={styles.title}>
            Block {block.number}
          </Text>
          <BlockCard block={block} gasPrice={gasPrice} />
          <div className={styles.panelContainer}>
            <BlockTransactions
              className={styles.transactionsPanel}
              bodyClass={styles.bodyClass}
              transactions={this.props.transactions}
            />
          </div>
        </div>
        <div className={styles.mobileContainer}>
          <Text typeScale="h1" weight="fontWeight-medium">Block {block.number}</Text>
          <BlockCard block={block} gasPrice={gasPrice} />
          <BlockTransactions
            className={styles.transactionsPanel}
            bodyClass={styles.bodyClass}
            transactions={this.props.transactions}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const blockNumber = state.eth.provider.blockNumber;
  const transactionCount = state.eth.provider.transactionCount;
  const address = state.eth.provider.address;
  const balance = state.eth.provider.balance;
  const gasPrice = state.eth.provider.gasPrice;
  const block = state.eth.provider.blocks.find(block => parseInt(props.match.params.number, 10) === block.number);
  let transactions = []
  if (block) {
    transactions = state.eth.provider.transactions.filter(transaction => block.transactions.includes(transaction.hash))
  }

  return {
    transactions,
    block,
    transactionCount,
    blockNumber,
    address,
    gasPrice,
    balance
  };
};

const Block = compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      findBlock: eth.actions.provider.findBlock,
      findTransaction: eth.actions.provider.findTransaction,
    }
  )
)(BlockComponent);

export default Block;