import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import styles from './ListHeader.scss';

const ListHeader = ({ title, buttons }) => (
  <div className={styles.listHeader}>
    <b>{title}</b>
    {buttons.map(button => (
      <Button key={button.label} {...button.props}>{button.label}</Button>
    ))}
  </div>
);

ListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    props: PropTypes.object,
  })),
};

ListHeader.defaultProps = {
  buttons: [],
};

export default ListHeader;
