import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import LoadingButton from './LoadingButton';
import AlertManager from './AlertManager';


import { isEmail, isEmpty } from '../validators'


function LoginForm(props) {
  const { login } = props;

  /*form data*/
  const [username, setUsername] = useState('apc.luigi@gmail.com');
  const [password, setPassword] = useState('');

  /*route state*/
  const [submitted, setSubmitted] = useState(false);

  /*loading state*/
  const [loading, setLoading] = useState(false);

  /*validation state*/
  const [valid, setValid] = useState(true);
  const [errorsForm, setErrorsForm] = useState([]);
  const ERRORS = { USERNAMEREQUIRED: -1, PASSWORDREQUIRED: -2, USERNAMEINVALID: -3, PASSWORDINVALID: -4, SERVERERROR: -5 }

 
  const handleOnCloseError = (IDERROR) => {
    setErrorsForm((oldError) => {
      return oldError.filter((e) => {
        if (e.id === IDERROR)
          return false;
        return true;
      })
    })
  }

  const isValidUsername = (username) => {
    let valid = true;
    if (isEmpty(username)) {
      setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.USERNAMEREQUIRED, msg: "Email cannot be empty" }]);
      valid = false;
    }
    else if (!isEmail(username)) {
      setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.USERNAMEINVALID, msg: "Please enter a correct email" }]);
      valid = false;
    }
    return valid;
  }

  const isValidPassword = (password) => {
    let valid = true;
    if (isEmpty(password)) {
      setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.PASSWORDREQUIRED, msg: "Password cannot be empty" }]);
      valid = false;
    }
    return valid;
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    //clean error state
    setErrorsForm([]);

    const credentials = { username, password };

    let valid = true;
    if (!isValidUsername(username)) valid = false
    if (!isValidPassword(password)) valid = false

    if (valid) {
      setValid(true)
      setLoading(true);
      login(credentials)
        .then(() => setSubmitted(true))
        .catch((err) => {
          setErrorsForm([{ id: ERRORS.SERVERERROR, msg: err }]);
          setValid(false)
          setLoading(false);
        })
    } else
      setValid(false);
  };


  return (
    <>
      {submitted

        ? <Redirect to='/home'/>

        : <Modal centered show animation={false} onHide={() => setSubmitted(true)} >
          <Form onSubmit={handleSubmit}>

            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              {/*validation errors*/}
              {!valid ? <AlertManager variant='danger' msgs={errorsForm} onClose={handleOnCloseError} /> : ''}

              <Form.Group controlId="username">
                <Form.Label>email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={username}
                  disabled={loading}
                  onChange={(ev) => setUsername(ev.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  disabled={loading}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </Form.Group>

            </Modal.Body>

            <Modal.Footer>
              <Button className="mr-2" variant="secondary"  disabled={loading} onClick={() => setSubmitted(true)}>Cancel</Button>
              <LoadingButton type="submit" variant='success' action='Login' loading={loading} />
            </Modal.Footer>
          
          </Form>
        </Modal>
      }
    </>
  );
}


export default LoginForm;
