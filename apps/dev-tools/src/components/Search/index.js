import React from 'react';
import PropTypes from 'prop-types';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class Search extends React.Component {
  state = {
    searchText: ''
  };

  onSearchChange = e => {
    const { value } = e.target;
    this.setState({ searchText: value });
    this.props.onChange(value);
  };

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.onEnter();
    }
  }

  render() {
    const { value } = this.props;
    const { searchText } = this.state;

    const searchValue = typeof value === 'string' ? value : searchText;

    return (
      <div className={`${styles.searchContainer}`}>
        <i className={styles.searchIcon}>
          <FontAwesomeIcon icon={faSearch} />
        </i>
        <input
          className={`${styles.searchInput}`}
          type="text"
          placeholder={this.props.placeholder}
          onChange={this.onSearchChange}
          value={searchValue}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

Search.propTypes = {
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string
};

Search.defaultProps = {
  placeholder: "Search...",
  onChange: () => {},
  onEnter: () => {}
};

export default Search;
