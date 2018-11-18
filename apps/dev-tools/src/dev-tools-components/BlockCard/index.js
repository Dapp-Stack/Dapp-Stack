import React from 'react';
import styles from './BlockCard.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGasPump, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/Card';
import Text from '../../components/Text';
import Currency from '../../components/Currency';
import LinkedAvatar from '../../components/LinkedAvatar'
import { scrollToTop, weiToGwei } from '../../utils/helpers';

const BlockCard = ({block, gasPrice}) => {
  const value = weiToGwei(block.gasUsed * gasPrice)
  const gasPercentage = (block.gasUsed / block.gasLimit * 100).toFixed(2);
  return (
    <Card hover className={styles.blockCard}>
      <Card.Body>
        <div className="row">
          <div
            className={`col-xs-9 col-sm-6 col-lg-7 ${styles.blockPrimaryData}`}
          >
            <Link to={`/blocks/${block.number}`} className={styles.link}>
              <Text
                typeScale="h4"
                weight="fontWeight-medium"
                className={styles.titleText}
              >
                {block.number}
              </Text>
            </Link>
            <div className={styles.avatar}>
              <LinkedAvatar
                address={block.hash}
                hash={block.hash}
                to={`/blocks/${block.number}`}
                onClick={() => scrollToTop()}
                size="small"
              />
            </div>
          </div>
          <div
            className={`col-xs-12 col-sm-4 col-lg-3 ${styles.blockMetaData}`}
          >
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey">
                  <FontAwesomeIcon icon={faClock} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {block.timestamp}
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                Timestamp
              </Text>
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey" className={styles.detailIcon}>
                  <FontAwesomeIcon icon={faGasPump} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {block.gasUsed.toString()} ({gasPercentage}%)
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                Gas Used
              </Text>
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.detailIcon}>
                <Text inline color="defaultGrey" className={styles.detailIcon}>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </Text>
              </div>
              <Text
                inline
                className={styles.detailInput}
                weight="fontWeight-medium"
              >
                {block.transactions.length}
              </Text>
              <Text inline color="defaultGrey" className={styles.detailLabel}>
                Transactions
              </Text>
            </div>
          </div>
          <div className={`col-xs-3 col-sm-2 col-lg-2 ${styles.blockCost}`}>
            <Currency
              className={styles.price}
              primaryValue={value}
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

export default BlockCard;