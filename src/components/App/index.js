import React from 'react';
// Learn React Router
import { HashRouter as Router, Route as PublicRoute, Redirect, Switch } from 'react-router-dom';
import { isLoggedIn } from '../../constants/utilities';
import { DEFAULT_ROUTE } from '../../constants/globals';
import Container from '../Container';
import ProtectedRoute from '../ProtectedRoute';
import HostGroups from '../HostGroups';
import Hosts from '../Hosts';
import Services from '../Services';
import Login from '../Login';
import Lost from '../Lost';

// Look at this with a knowledge of React Router
export default () => (
  <Router>
    <Container>
      <Switch>
        <PublicRoute
          exact
          path="/"
          render={() => <Redirect to={isLoggedIn() ? DEFAULT_ROUTE : '/login'} />}
        />
        <PublicRoute path="/login" component={Login} />

        <ProtectedRoute exact path="/hostgroup" component={HostGroups} />
        <ProtectedRoute path="/hostgroup/:parentId" component={HostGroups} />

        <ProtectedRoute path="/host/:hostGroupId" component={Hosts} />

        <ProtectedRoute path="/service/:hostname" component={Services} />

        <PublicRoute path="*" component={Lost} />
      </Switch>
    </Container>
  </Router>
);
