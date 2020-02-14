import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Navbar, Row, Spinner, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useAuth } from 'react-use-auth';
import './Home.scss';

const firebaseConfig = {
  apiKey: 'AIzaSyCf1SnE4INHiSPZ8gnaosAmqHeIH87bnzM',
  authDomain: 'carpool-live.firebaseapp.com',
  databaseURL: 'https://carpool-live.firebaseio.com',
  projectId: 'carpool-live',
  storageBucket: 'carpool-live.appspot.com',
  messagingSenderId: '448119506013',
  appId: '1:448119506013:web:bf3b835791e418230379b4',
};

export interface RequestType {
  type: 'offer' | 'receive';
  name: string;
  from: string;
  to: string;
  time: string;
  mobile: string;
}

const Home: React.FC = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    setLoading(true);
    setRequests([]);
    db.ref('/requests').on('value', value => {
      setRequests(value.val());
      setLoading(false);
    });
  }, [loading, requests]);
  const { isAuthenticated, login, user, logout } = useAuth();

  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <React.Fragment>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">CarPool Live</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          {isAuthenticated() ? (
            <React.Fragment>
              Hi, {user.name}
              <Button size="sm" className="ml-3" variant="outline-primary" onClick={logout}>
                Logout
              </Button>
            </React.Fragment>
          ) : (
            <Button size="sm" variant="outline-primary" onClick={login}>
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container className="pt-4" fluid>
        <Row>
          {requests.length === 0 ? (
            <Col className="pt-4 text-center h4">
              {loading ? (
                <React.Fragment>
                  <Spinner className="d-block mx-auto my-4" animation="grow" />
                  Getting all carpool requests...
                </React.Fragment>
              ) : (
                'There is nothing here yet.'
              )}
            </Col>
          ) : null}
        </Row>
        {requests.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Request Type</th>
                <th>Name</th>
                <th>Going From</th>
                <th>Going To</th>
                <th>Time</th>
                <th>Cell</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, idx) => (
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>{request.type}</td>
                  <td>{request.name}</td>
                  <td>{request.from}</td>
                  <td>{request.to}</td>
                  <td>{request.time}</td>
                  <td>{request.mobile}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </Container>
    </React.Fragment>
  );
};

export default Home;
