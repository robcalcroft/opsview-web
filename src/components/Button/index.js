import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.scss';

const Button = ({ children, onClick, type, className, width }) => (
  <button
    type={type}
    className={[styles.button, className].join(' ')}
    onClick={onClick}
    style={width ? { width } : {}}
  >
    {children}
  </button>
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
  width: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  type: '',
  className: '',
  width: '',
};

export default Button;
