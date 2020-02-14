import * as firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Nav, Navbar, Row, Spinner, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useAuth } from 'react-use-auth';
import * as yup from 'yup';
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
  type: 'offer' | 'join';
  name: string;
  from: string;
  to: string;
  time: string;
  mobile: string;
}

const Home: React.FC = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalShown, setAddModalShown] = useState(false);
  const [db, setDb] = useState<firebase.database.Database | null>(null);
  const [request, setRequest] = useState<RequestType>({
    type: 'offer',
    name: '',
    to: '',
    from: '',
    time: '',
    mobile: '',
  });
  const [isFormValid, setFormValid] = useState(false);

  const requestSchema = yup.object().shape({
    type: yup
      .string()
      .required()
      .min(3),
    name: yup
      .string()
      .required()
      .min(3),
    to: yup
      .string()
      .required()
      .min(3),
    from: yup
      .string()
      .required()
      .min(3),
    time: yup
      .string()
      .required()
      .matches(/([01]?[0-9]|2[0-3]):[0-5][0-9]/),
    mobile: yup.string().required(),
  });

  const handleClose = () => setAddModalShown(false);
  const handleShow = () => setAddModalShown(true);
  const handleAdd = () => {
    setAddModalShown(false);
    const dbRef = db?.ref('/requests');
    if (dbRef !== undefined && request !== null) {
      const newRequestKey = dbRef.push().key;
      if (newRequestKey !== null) {
        dbRef.update({
          [newRequestKey?.toString()]: request,
        });
      }
    }
  };

  useEffect(() => {
    requestSchema
      .isValid(request)
      .then(valid => {
        setFormValid(valid);
      })
      .catch(err => {
        setFormValid(false);
      });
  }, [requestSchema, request]);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    setDb(firebase.database());

    setLoading(true);
    setRequests([]);
    firebase
      .database()
      .ref('/requests')
      .on('value', value => {
        const newRequests: RequestType[] = [];
        value.forEach(newRequest => {
          newRequests.push(newRequest.val());
        });
        setRequests(newRequests);
        setLoading(false);
      });
  }, [addModalShown]);
  const { isAuthenticated, login, user, logout } = useAuth();

  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">CarPool Live</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          {isAuthenticated() ? (
            <>
              Hi, {user.name}
              <Button size="sm" className="ml-3" variant="outline-primary" onClick={logout}>
                Logout
              </Button>
            </>
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
                <>
                  <Spinner className="d-block mx-auto my-4" animation="grow" />
                  Getting all carpool requests...
                </>
              ) : (
                'There is nothing here yet.'
              )}
            </Col>
          ) : null}
        </Row>
        {requests.length > 0 ? (
          <Row>
            <Col xs={12} className="text-right">
              <Button size="sm" variant="outline-info" onClick={handleShow}>
                Add
              </Button>
            </Col>
            <Col xs={12} className="pt-4">
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Request Type</th>
                    <th>Name</th>
                    <th>Going From</th>
                    <th>Going To</th>
                    <th>Going At</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((carpoolRequest, idx) => (
                    <tr key={idx}>
                      <td>{idx}</td>
                      <td>{carpoolRequest.type}</td>
                      <td>{carpoolRequest.name}</td>
                      <td>{carpoolRequest.from}</td>
                      <td>{carpoolRequest.to}</td>
                      <td>{carpoolRequest.time}</td>
                      <td>{carpoolRequest.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Modal show={addModalShown} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add CarPool Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Request Type</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, type: e.target.value === 'offer' ? 'offer' : 'join' })
                        }
                      >
                        <option value="offer">Offer CarPool</option>
                        <option value="join">Join a CarPool</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, name: e.target.value })
                        }
                        type="text"
                        placeholder="Name"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, from: e.target.value })
                        }
                        type="text"
                        placeholder="Going From"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, to: e.target.value })
                        }
                        type="text"
                        placeholder="Going To"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, time: e.target.value })
                        }
                        type="time"
                        placeholder="Going at Time"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRequest({ ...request, mobile: e.target.value })
                        }
                        type="phone"
                        placeholder="Phone Number"
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button disabled={!isFormValid} variant="primary" onClick={handleAdd}>
                    Add Request
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        ) : null}
      </Container>
    </>
  );
};

export default Home;
