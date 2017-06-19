import React from 'react';
import { HashRouter as Router, Route as PublicRoute, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../../constants/utilities';
import { DEFAULT_ROUTE } from '../../constants/globals';
import Container from '../Container';
import ProtectedRoute from '../ProtectedRoute';
import HostGroups from '../HostGroups';
import Hosts from '../Hosts';
import Login from '../Login';

export default () => (
  <Router>
    <Container>
      <Redirect from="/" to={isLoggedIn() ? DEFAULT_ROUTE : '/login'} />
      <PublicRoute path="/login" component={Login} />

      <ProtectedRoute exact path="/hostgroup" component={HostGroups} />
      <ProtectedRoute path="/hostgroup/:parentId" component={HostGroups} />

      <ProtectedRoute exact path="/host" component={Hosts} />
      <ProtectedRoute path="/host/:hostGroupId" component={Hosts} />
    </Container>
  </Router>
);
