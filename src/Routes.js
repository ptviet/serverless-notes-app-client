import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import NewNote from './containers/NewNote';
import Note from './containers/Note';
import NotFound from './containers/NotFound';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) => {
  return (
    <div>
      <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute
          path="/login"
          exact
          component={Login}
          props={childProps}
        />
        <AppliedRoute
          path="/register"
          exact
          component={Register}
          props={childProps}
        />
        <AppliedRoute
          path="/notes/new"
          exact
          component={NewNote}
          props={childProps}
        />
        <AppliedRoute
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
