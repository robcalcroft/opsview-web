import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.scss';

const Button = ({ children, onClick, type, className }) => (
  <button type={type} className={[styles.button, className].join(' ')} onClick={onClick}>{children}</button>
);

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  type: '',
  className: '',
};

export default Button;
