import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import eth from '@dapp-stack/redux-eth';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import styles from './BlocksPanel.module.scss';

import Card from '../../components/Card';
import Button from '../../components/Button';
import Search from '../../components/Search';
import Text from '../../components/Text';
import ZeroState from '../../components/ZeroState';
import BlockCard from '../../dev-tools-components/BlockCard';

class BlocksPanelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blockNumber: '' };
  }

  componentDidMount = () => {
    if (this.props.blocks.length < 5) {
      this.loadMore();
    }
  }

  loadMore = () => {
    const from = this.props.blockNumber - this.props.blocks.length;
    [...Array(5).keys()].forEach(index => {
      const blockNumber = from - index;
      if(blockNumber > 0) {
        this.props.findBlock(blockNumber);
      }
    })
  }

  renderBlocks = blocks => {
    return blocks.map(block => <BlockCard key={block.number} gasPrice={this.props.gasPrice} block={block} />);
  };

  handleBlockNumberChange = (newValue) => {
    this.setState({ blockNumber: newValue });
  }

  goTo = () => {
    this.props.history.push(`/blocks/${this.state.blockNumber}`)
  }

  render() {
    const {
      blocks,
      loading,
      error,
      blockNumber
    } = this.props;

    let body = (
      <React.Fragment>
        {this.renderBlocks(blocks)}
        {blocks.length < blockNumber && (
          <div className={styles.loadMoreButton}>
            <Button
              loading={loading}
              onClick={this.loadMore}
            >
              Load More
            </Button>
          </div>
        )}
      </React.Fragment>
    );

    if (blockNumber <= 0) {
      body = (
        <div className={styles.zeroStateWrapper}>
          <Card className={styles.zeroState}>
            <Card.Body>
              <ZeroState
                iconColor="orange"
                icon={faExclamationTriangle}
                title={`You have no blocks`}
                text={`It looks like there is no mined block yet in the node you are connected to.`}
              />
            </Card.Body>
          </Card>
        </div>
      );
    }

    if (error) {
      body = (
        <div className={styles.zeroStateWrapper}>
          <Card className={styles.zeroState}>
            <Card.Body>
              <ZeroState
                type="error"
                text="Something went wrong. Try again later."
                iconColor="red"
                icon={faExclamationTriangle}
              />
            </Card.Body>
          </Card>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={styles.blocksPanelHeader}>
          <Text inline typeScale="h3" weight="fontWeight-medium">
            {blocks.length} Blocks out of {blockNumber}
          </Text>
          <div className={styles.search}>
            <Search value={this.state.blockNumber}
                    placeholder="Go to block"
                    onChange={this.handleBlockNumberChange}
                    onEnter={this.goTo} />
          </div>
        </div>

        {body}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const blockNumber = state.eth.provider.blockNumber;
  const blocks = state.eth.provider.blocks;
  const error = state.eth.provider.errors.block;
  const loading = state.eth.provider.loading.block;
  const gasPrice = state.eth.provider.gasPrice;

  return {
    blockNumber,
    blocks,
    gasPrice,
    error,
    loading
  };
};

const BlocksPanel = compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      findBlock: eth.actions.provider.findBlock,
    }
  )
)(BlocksPanelComponent);

export default BlocksPanel;