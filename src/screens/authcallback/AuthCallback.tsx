import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from 'react-use-auth';

const Auth0CallbackPage: React.FC = () => {
  const { handleAuthentication } = useAuth();
  useEffect(() => {
    handleAuthentication({ postLoginRoute: '/' });
  }, [handleAuthentication]);

  return (
    <Container>
      <h1>This is the auth callback page, you should be redirected immediately.</h1>
    </Container>
  );
};

export default Auth0CallbackPage;
