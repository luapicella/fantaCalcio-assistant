import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import LoadingButton from './LoadingButton';


import { Redirect, Switch, Route, Link, useParams, useHistory, useRouteMatch } from 'react-router-dom';

function LogoutForm(props) {
    const { logout } = props;

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        logout()
            .catch((err) => { 
                setErrorMessage(err);
                setLoading(false); 
                setShow(true); 
            })
    };

    return (
        <>
            {submitted
                
                ? <Redirect to='home' />
                
                : <Modal centered show animation={false} onHide={() => setSubmitted(true)}>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Logout</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button className="mr-2" variant="secondary" onClick={() => setSubmitted(true)}>Cancel</Button>
                            <LoadingButton type="submit" variant='danger' action='Logout' loading={loading} />
                        </Modal.Footer>

                    </Form>
                </Modal>
            }
        </>
    )
}

export default LogoutForm;
