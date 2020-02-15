import React from 'react';
import { useHistory } from 'react-router-dom';
import { AuthProvider } from 'react-use-auth';
const Auth: React.FC = ({ children }) => {
  const history = useHistory();

  return (
    <AuthProvider
      navigate={(path: string) => history.push(path)}
      auth0_domain="carpool-live.auth0.com"
      auth0_client_id="ziZ9tc6n5rHN7EJNhTCWgHGVEaAtCfRw"
      auth0_params={{}}
    >
      {children}
    </AuthProvider>
  );
};

export default Auth;
