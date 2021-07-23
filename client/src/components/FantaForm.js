import { Modal, Form, Button } from 'react-bootstrap/';

import { useState, useEffect } from 'react';

import { isEmail, isEmpty, isNumeric } from '../validators'

import AlertManager from './AlertManager';

const FantaForm = (props) => {
    const { show, player, teams, onClose, onSave } = props;

    const [team, setTeam] = useState('choose');
    const [price, setPrice] = useState('');

    /*validation state*/
    const [valid, setValid] = useState(true);
    const [errorsForm, setErrorsForm] = useState([]);
    const ERRORS = { TEAMEQUIRED: -1, PRICEREQUIRED: -2, USERNAMEINVALID: -3, PASSWORDINVALID: -4, SERVERERROR: -5 }

    const handleChangeTeam = (ev) => {
        setTeam(ev.target.value);
    }

    const handleChangePrice = (ev) => {
        const price = ev.target.value;
        setPrice(price);
    }

    const handleOnCloseError = (IDERROR) => {
        setErrorsForm((oldError) => {
            return oldError.filter((e) => {
                if (e.id === IDERROR)
                    return false;
                return true;
            })
        })
    }

    const isValidTeam = (team) => {
        let valid = true;
        if (isEmpty(team) || team === 'choose') {
            setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.TEAMREQUIRED, msg: "Team cannot be empty" }]);
            valid = false;
        }
        return valid;
    }

    const isValidPrice = (price) => {
        let valid = true;
        if (isEmpty(price)) {
            setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.PRICEREQUIRED, msg: "Price cannot be empty" }]);
            valid = false;
        } else if (!isNumeric(price)) {
            setErrorsForm((oldMessage) => [...oldMessage, { id: ERRORS.PRICEREQUIRED, msg: "Price must be a number" }]);
            valid = false;
        }
        return valid;
    }


    const handleSubmit = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        //clean error state
        setErrorsForm([]);

        const purchase = {
            id: player.id,
            fantaTeams: team,
            role: player.role,
            price: price,
        }

        let valid = true;
        if (!isValidTeam(team)) valid = false
        if (!isValidPrice(price)) valid = false

        if (valid) {
            setValid(true)
            onSave(purchase);
            onClose();
        } else
            setValid(false);

    }


    return (
        <Modal centered show={show} animation={false} onHide={onClose} >

            <Modal.Header closeButton>
                <Modal.Title>Add player</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>

                    {/*validation errors*/}
                    {!valid ? <AlertManager variant='danger' msgs={errorsForm} onClose={handleOnCloseError} /> : ''}

                    <Form.Group controlId="formGiocatore">
                        <Form.Label>Player</Form.Label>
                        <Form.Control
                            disabled
                            type="text"
                            placeholder="totti"
                            value={player.name}
                        />
                    </Form.Group>

                    <Form.Group controlId="formTeam">
                        <Form.Label>Team</Form.Label>
                        <Form.Control as='select'
                            value={team}
                            onChange={handleChangeTeam}
                        >
                            <option disabled value="choose">Choose team</option>
                            {teams.map(team => {
                                return (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                );
                            })}

                        </Form.Control>
                    </Form.Group>


                    <Form.Group controlId="formPrice">
                        <Form.Label>Prize</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="100"
                            value={price}
                            onChange={handleChangePrice}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} >
                        Cancel
                    </Button>
                    <Button variant="success" type="submit">
                        Save
                    </Button>
                </Modal.Footer>

            </Form>
        </Modal>
    );
}

export default FantaForm;