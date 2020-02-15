import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AuthCallback from 'src/screens/authcallback/AuthCallback';
import Home from 'src/screens/home/Home';
import Login from 'src/screens/login/Login';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/login" component={Login} exact />
      <Route exact path="/auth0_callback" render={() => <AuthCallback />} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default Routes;
