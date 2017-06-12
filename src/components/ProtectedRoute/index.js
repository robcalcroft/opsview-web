import React from 'react';
import PropTypes from 'prop-types';
import { Route as PublicRoute, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../../constants/utilities';

const ProtectedRoute = ({ component: PassedComponent, ...routeProps }) => (
  <PublicRoute
    {...routeProps}
    render={componentProps => (
      isLoggedIn() ? (
        <PassedComponent {...componentProps} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {
              from: componentProps.location,
            },
          }}
        />
      )
    )}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

export default ProtectedRoute;
