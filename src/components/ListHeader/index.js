import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import styles from './ListHeader.scss';

const ListHeader = ({ title, buttons }) => (
  <div className={styles.listHeader}>
    <b>{title}</b>
    <div className={styles.buttonWrapper}>
      {buttons.map(button => (
        <div className={styles.buttonWrapperContainer} key={button.label}>
          {button.supplementaryText && (
            <div className={styles.supplementaryText}>{button.supplementaryText}</div>
          )}
          <Button {...button.props}>{button.label}</Button>
        </div>
      ))}
    </div>
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
