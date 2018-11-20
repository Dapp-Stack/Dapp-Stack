import React from 'react';
import eth from '@dapp-stack/redux-eth';
import { hot } from 'react-hot-loader';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './App.module.scss';
import { NAV_ITEMS } from './constants';
import RequireLoginComponentHOC from '../../hocs/RequireLoginComponent';
import Sidebar from '../../components/Sidebar';
import ToastContainer from '../../components/ToastContainer';
import Network from '../../components/Network';
import Header from '../Header';
import Contracts from '../../containers/Contracts'
import Ipfs from '../../containers/Ipfs'
import Block from '../../containers/Block'
import Blocks from '../../containers/Blocks'
import { currentRouteSelector, scrollToTop } from '../../utils/helpers';

class HeaderComponent extends React.Component {
  state = {
    showMobileSidebar: false
  };

  renderSideNavItems() {
    return NAV_ITEMS.map(navItem => <Sidebar.TabIcon {...navItem} key={navItem.tabKey} />);
  }

  render() {
    const { showMobileSidebar } = this.state;
    const { history, network, location } = this.props;

    return (
      <React.Fragment>
        <Header onShowNav={() => this.setState({ showMobileSidebar: true })} />
        <Sidebar
          activeTab={currentRouteSelector(location.pathname)}
          defaultActiveTab="dashboard"
          className={styles.sideNav}
          onTabClick={route => {
            history.push(route);
            scrollToTop();
            this.setState({ showMobileSidebar: false });
          }}
          mobileVisible={showMobileSidebar}
          onMobileHide={() => this.setState({ showMobileSidebar: false })}
        >
          <Sidebar.TabGroup>{this.renderSideNavItems()}</Sidebar.TabGroup>
          <Sidebar.Footer>
            <div className={styles.network}>
            {network && <Network network={network} theme="light" />}
            </div>
          </Sidebar.Footer>
        </Sidebar>
      </React.Fragment>
    );
  }
}

const mapHeaderStateToProps = state => {
  return {
    network: state.eth.provider.network
  };
};

const PageHeader = compose(
  withRouter,
  connect(mapHeaderStateToProps)
)(HeaderComponent);

class AppComponent extends React.Component {
  componentDidMount() {
    this.props.ethStart();
  }

  currentRouteSelector = () => {
    const { pathname } = this.props.location;
    return pathname.split('/')[1] || '';
  };

  render() {
    return (
      <div className={styles.app}>
        <ToastContainer
          newestOnTop
          autoClose={false}
          hideProgressBar
          draggable
        />
        <PageHeader />,
        <div className={`${styles.body} page-body`}>
          <Switch>
            <Route exact path="/blocks" component={RequireLoginComponentHOC(Blocks)} />
            <Route exact path="/blocks/:number" component={RequireLoginComponentHOC(Block)} />
            <Route exact path="/contracts" component={RequireLoginComponentHOC(Contracts)} />
            <Route exact path="/ipfs" component={RequireLoginComponentHOC(Ipfs)} />
            <Redirect from="/" to="/blocks" />
          </Switch>
        </div>
      </div>
    );
  }
}

const App = compose(
  hot(module),
  withRouter,
  connect(
    null,
    {
      ethStart: eth.actions.provider.start
    }
  )
)(AppComponent);

export default App;