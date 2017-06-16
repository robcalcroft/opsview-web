import React from 'react';
import PropTypes from 'prop-types';
import styles from './Pill.scss';
import colours from '../../styles/colours.scss';

const Pill = ({ state }) => (
  <div className={`${colours[state]} ${colours.whiteText} ${styles.pill}`}>
    {state.toUpperCase()}
  </div>
);

Pill.propTypes = {
  state: PropTypes.string.isRequired,
};

export default Pill;
