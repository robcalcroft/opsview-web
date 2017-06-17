import React from 'react';
import PropTypes from 'prop-types';
import styles from './Pill.scss';
import colours from '../../styles/colours.scss';

const Pill = ({ state, label }) => (
  <div className={`${colours[state]} ${colours.whiteText} ${styles.pill}`}>
    {(label || state).toUpperCase()}
  </div>
);

Pill.propTypes = {
  state: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Pill.defaultProps = {
  label: '',
};

export default Pill;
