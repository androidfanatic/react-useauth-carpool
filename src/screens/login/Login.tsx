import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useAuth } from 'react-use-auth';
import './Login.scss';

const Home: React.FC = () => {
  const { login } = useAuth();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Container className="pt-4" fluid>
        <Row>
          <Col className="center-text">
            <img className="d-block mx-auto" src="https://i.imgur.com/o8iQou0.png" alt="" />
            <Button className="d-block mx-auto" size="lg" variant="outline-primary" onClick={login}>
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
