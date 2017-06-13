import React from 'react';
import PropTypes from 'prop-types';
import styles from './Container.scss';

const Container = ({ children }) => (
  <div className={styles.container}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ])).isRequired,
};

export default Container;
