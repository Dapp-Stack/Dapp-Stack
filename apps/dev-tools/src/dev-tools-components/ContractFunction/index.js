import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFileSignature } from '@fortawesome/free-solid-svg-icons';

import styles from './ContractFunction.module.scss';

import Card from '../../components/Card';
import Text from '../../components/Text';
import ZeroState from '../../components/ZeroState';
import FunctionDescription from '../FunctionDescription';

const ContractFunction = (props) => {
  if (props.error) {
    return (
      <div className={styles.notStartedWrapper}>
        <div className={styles.notStarted}>
          <Card className={styles.notStartedCard}>
            <Card.Body>
              <ZeroState
                title={'Start a DApp Stack Instance'}
                type="error"
                iconColor="red"
                icon={faExclamationTriangle}
              >
                <ZeroState.BodyText>
                  In order for you to show and interact with the contracts,
                  please start a DApp Stack instance.
                </ZeroState.BodyText>
              </ZeroState>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <React.Fragment>
      <Text className={styles.title} typeScale="h3">
        <FontAwesomeIcon icon={faFileSignature} className={styles.icon} />
        {props.contractName}
      </Text>
      {props.contract && props.contract.interface.abi.map((description, index) => (
        <FunctionDescription key={index} func={description} contract={props.contract}/>
      ))}
    </React.Fragment>
  );
};

export default ContractFunction;
