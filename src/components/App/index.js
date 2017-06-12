import React from 'react';
import { HashRouter as Router, Route as PublicRoute, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../../constants/utilities';
import ProtectedRoute from '../ProtectedRoute';
import Container from '../Container';
import HostGroupsHostsAndServices from '../HostGroupsHostsAndServices';
import Login from '../Login';

const defaultRoute = '/hosts';

export default () => (
  <Router>
    <Container>
      <Redirect from="/" exact to={isLoggedIn() ? defaultRoute : '/login'} />
      <PublicRoute path="/login" component={Login} />
      <ProtectedRoute path="/hosts" component={HostGroupsHostsAndServices} />
    </Container>
  </Router>
);
