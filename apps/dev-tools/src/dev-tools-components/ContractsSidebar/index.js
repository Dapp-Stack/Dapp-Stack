import React from 'react';
import styles from './ContractsSidebar.module.scss';
import Text from '../../components/Text';

const ContractsSidebar = props => {
  return (
    <div className={`${styles.contractsSidebar} ${styles['fixed']}`}>
      <div className={styles.marginTop}>
        <Text inline typeScale="h3" weight="fontWeight-medium">
          Contracts
        </Text>
      </div>
      
      {Object.keys(props.contracts).map(name => (
        <div key={name} onClick={() => props.switchContract(name)} className={styles.contractLink}>
          <Text>{name}</Text>
          <Text fontStyle="italic" className={styles.address}>
            {props.contracts[name].address}
          </Text>
        </div>  
      ))}
    </div>
  );
};

export default ContractsSidebar;