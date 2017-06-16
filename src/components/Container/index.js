import React from 'react';
import PropTypes from 'prop-types';
import styles from './Container.scss';
import { logout } from '../../constants/utilities';

const logo = require('../../assets/logo-white.png');

const Container = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.navBar}>
      <img className={styles.navBar__img} src={logo} alt="Opsview's Logo" />
      <div className={styles.navBar__links}>
        <a href="/" className={styles.navBar__link} onClick={logout}>Logout</a>
      </div>
    </div>
    <div className={styles.childrenWrapper}>{children}</div>
  </div>
);

Container.propTypes = {
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ])).isRequired,
};

export default Container;
