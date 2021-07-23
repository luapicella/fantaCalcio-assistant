import { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';


const AlertManager = (props) => {
    const { msgs, variant, onClose } = props;

    return (
        <>
            {msgs.map((m) => <AlertDismissible key={m.id} onClose={() => onClose(m.id)} variant={variant} msg={m.msg} />)}
        </>
    );
}

const AlertDismissible = (props) => {
    const { msg, onClose } = props;


    return (
        <>
            <Alert variant="danger" onClose={onClose} dismissible>
                {msg}
            </Alert>
        </>
    );

}

export default AlertManager;