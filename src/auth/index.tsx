import React from 'react';
import { useHistory } from 'react-router-dom';
import { AuthProvider } from 'react-use-auth';
const Auth: React.FC = ({ children }) => {
  const history = useHistory();

  return (
    <AuthProvider
      navigate={(path: string) => history.push(path)}
      auth0_domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      auth0_client_id={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      auth0_params={{}}
    >
      {children}
    </AuthProvider>
  );
};

export default Auth;
