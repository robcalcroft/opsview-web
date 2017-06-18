import React from 'react';
import PropTypes from 'prop-types';
import styles from './Loader.scss';

const Loader = ({ children }) => (
  <div className={styles.loader}><b>{children}</b></div>
);

Loader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

Loader.defaultProps = {
  children: 'Loading...',
};

export default Loader;
