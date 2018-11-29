import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { faSignInAlt, faUnlock } from '@fortawesome/free-solid-svg-icons';

import styles from './RequireLoginComponent.module.scss';
import Card from '../components/Card';
import ZeroState from '../components/ZeroState';

function RequireLoginComponentHOC(WrappedComponent) {
  class RequireLoginComponent extends Component {
    static propTypes = {};

    unlock = async () => {
      try {
        await window.ethereum.enable();
        window.location.reload();
      } catch(error) {
        console.error(error);
      }
    }

    render() {
      const { network, address } = this.props;

      if (!network) {
        return (
          <div className={styles.notConnectedWrapper}>
            <div className={`${styles.notConnected}`}>
              <Card className={styles.notConnectedCard}>
                <Card.Body>
                  <ZeroState
                    title={'Connect to use DApp Stack Dev Tools.'}
                    iconColor="blue"
                    icon={faSignInAlt}
                  >
                    <ZeroState.BodyText>
                      In order to use DApp Stack Dev tools, you need to be
                      connected to Ethereum network. In order to do so,
                      you can install metamask or use mist browser.
                    </ZeroState.BodyText>
                  </ZeroState>
                </Card.Body>
              </Card>
            </div>
          </div>
        );
      }

      if (!address) {
        return (
          <div className={styles.notConnectedWrapper}>
            <div className={`${styles.notConnected}`}>
              <Card className={styles.notConnectedCard}>
                <Card.Body>
                  <ZeroState
                    title={'Unlock your account to use DApp Stack Dev Tools.'}
                    action
                    actionText={'Unlock'}
                    iconColor="blue"
                    onActionClick={this.unlock}
                    icon={faUnlock}
                  >
                    <ZeroState.BodyText>
                      In order for you to use certain features of the dev tools,
                      please unlock your account.
                    </ZeroState.BodyText>
                  </ZeroState>
                </Card.Body>
              </Card>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.connectedWrapper}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    network: state.eth.provider.network,
    address: state.eth.provider.address
  });

  return compose(
    withRouter,
    connect(
      mapStateToProps,
      {}
    )
  )(RequireLoginComponent);
}

export default RequireLoginComponentHOC;