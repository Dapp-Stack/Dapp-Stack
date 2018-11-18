import React from 'react';
import styles from './BlockTransactions.module.scss';
import Text from '../../components/Text';
import TransactionCard from '../TransactionCard';

class BlockTransactions extends React.Component {

  renderTransactions = transactions => {
    return transactions.map(transaction => <TransactionCard key={transaction.hash} gasPrice={this.props.gasPrice} transaction={transaction} />);
  };

  render() {
    const { transactions } = this.props;
      
    return (
      <React.Fragment>
        <div className={styles.transactionsHeader}>
          <Text inline typeScale="h3" weight="fontWeight-medium">
            {transactions.length} Transactions
          </Text>
        </div>

        {this.renderTransactions(transactions)}
      </React.Fragment>
    );
  }
}

export default BlockTransactions;