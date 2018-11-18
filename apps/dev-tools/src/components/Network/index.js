import React from 'react';
import PropTypes from 'prop-types';
import styles from './Network.module.scss';
import Pill from '../Pill';

const Network = props => {
  const { network, className, theme } = props;

  let networkName = 'Unknown Network';
  let circleStyle = styles.unknownCircle;

  if (network.name === 'rinkeby') {
    circleStyle = styles.rinkebyCircle;
    networkName = 'Rinkeby Network';
  }

  if (network.name === 'ropsten') {
    circleStyle = styles.ropstenCircle;
    networkName = 'Ropsten Network';
  }

  if (network.name === 'homestead') {
    circleStyle = styles.mainnetCircle;
    networkName = 'Main Ethereum Network';
  }

  return (
    <Pill
      textColor={theme === 'light' ? 'white' : 'black'}
      className={className}
    >
      <span className={circleStyle}>&#9679;</span>
      {networkName}
    </Pill>
  );
};

Network.propTypes = {
  network: PropTypes.shape({ name: PropTypes.string }),
  theme: PropTypes.oneOf(['light', 'dark']),
  className: PropTypes.string
};

Network.defaultProps = {
  theme: 'dark'
};

export default Network;
