import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';

import Avatar from '../../components/Avatar';
import Network from '../../components/Network';
import Text from '../../components/Text';
import BeeLogo from '../../styles/logo.js';

const HeaderComponent = props => {
  const { network, address, onShowNav } = props;

  return (
    <div className={`${styles.header} page-header`}>
      <div className={`${styles.iconArea}`}>
        <Link to="/blocks">
          <BeeLogo />
        </Link>
      </div>
      {network && <Network network={network} className={styles.network} />}
      <div className={styles.sideNavTrigger} onClick={onShowNav}>
        <Text typeScale="h3" color="blue">
          <FontAwesomeIcon icon={faBars} />
        </Text>
      </div>
      <div className={`${styles.avatarArea}`}>
        {address &&
          <Avatar
            size="small"
            hash={address}
            address={address}
            link={false}
            className={styles.avatar}/>
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  address: state.eth.provider.address,
  network: state.eth.provider.network
});

const Header = compose(
  withRouter,
  connect(
    mapStateToProps,
    { }
  )
)(HeaderComponent);

export default Header;