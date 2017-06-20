import React from 'react';

// TODO: Move to a sass file
const styles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '75%',
};

export default () => (
  <div style={styles}>
    {/* eslint-disable */}
    <b style={{ fontSize: '150%' }}>Oops that page doesn&apos;t exist 🤔</b>
    {/* eslint-enable */}
  </div>
);
