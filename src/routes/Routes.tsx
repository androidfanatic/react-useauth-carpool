import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { AuthProvider } from 'react-use-auth';
import AuthCallback from 'src/screens/authcallback/AuthCallback';
import Home from 'src/screens/home/Home';
import Login from 'src/screens/login/Login';

const Routes: React.FC = () => {
  const history = useHistory();

  return (
    <AuthProvider
      navigate={(path: string) => history.push(path)}
      auth0_domain="carpool-live.auth0.com"
      auth0_client_id="ziZ9tc6n5rHN7EJNhTCWgHGVEaAtCfRw"
      auth0_params={{}}
    >
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} exact />
        <Route exact path="/auth0_callback" render={() => <AuthCallback />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </AuthProvider>
  );
};

export default Routes;
