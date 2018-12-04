import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import NewNote from './containers/NewNote';
import Note from './containers/Note';
import NotFound from './containers/NotFound';
import AppliedRoute from './components/AppliedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';

export default ({ childProps }) => {
  return (
    <div>
      <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute
          path="/login"
          exact
          component={Login}
          props={childProps}
        />
        <UnauthenticatedRoute
          path="/register"
          exact
          component={Register}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/notes/new"
          exact
          component={NewNote}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/notes/:id"
          exact
          component={Note}
          props={childProps}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
