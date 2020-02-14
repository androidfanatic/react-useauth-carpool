import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Navbar, Row, Table } from 'react-bootstrap';
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
      const db = firebase.database();
      setLoading(true);
      setRequests([]);
      db.ref('/requests').on('value', value => {
        setRequests(value.val());
        setLoading(false);
      });
    }
  }, [loading, requests]);

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">CarPool Live</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
        </Navbar.Collapse>
      </Navbar>
      <Row>
        {requests.length === 0 ? (
          <Col className="pt-4 text-center h4">
            {loading ? 'Getting all carpool requests...' : 'There is nothing here yet.'}
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
  );
};

export default Home;
