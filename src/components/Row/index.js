import React from 'react';
import PropTypes from 'prop-types';
import { row } from './Row.scss';

const Row = ({ children }) => (
  <div className={row} data-component-name="Row">{children}</div>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Row;
