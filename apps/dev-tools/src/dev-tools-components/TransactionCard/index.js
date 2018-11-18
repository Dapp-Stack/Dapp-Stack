import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import styles from './TransactionCard.module.scss';

import Card from '../../components/Card';
import Text from '../../components/Text';
import Currency from '../../components/Currency';
import { weiToGwei } from '../../utils/helpers';

const TransactionCard = ({transaction}) => {

  return (
    <Card hover className={styles.transactionCard}>
      <Card.Body>
        <div className="row">
          <div
            className={`col-xs-9 col-sm-6 col-lg-7 ${styles.transactionPrimaryData}`}
          >
            <Link to={`/blocks/${transaction.hash}`} className={styles.link}>
              <Text
                typeScale="h4"
                weight="fontWeight-medium"
                className={styles.titleText}
              >
                {transaction.hash}
              </Text>
            </Link>
            <div className={styles.data}>
              {transaction.data}
            </div>
          </div>
          <div
            className={`col-xs-12 col-sm-4 col-lg-3 ${styles.transactionMetaData}`}
          >
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {transaction.from}
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                From
              </Text>
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey" className={styles.detailIcon}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {transaction.to}
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                To
              </Text>
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey" className={styles.detailIcon}>
                  <FontAwesomeIcon icon={faCheck} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {transaction.confirmations}
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                Confirmations
              </Text>
            </div>
          </div>
          <div className={`col-xs-3 col-sm-2 col-lg-2 ${styles.transactionCost}`}>
            <Currency
              className={styles.price}
              primaryValue={weiToGwei(transaction.gasPrice)}
              primaryCurrency={"Gwei"}
              primaryClassName={styles.gwei}
              currencyClass={styles.currency}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;