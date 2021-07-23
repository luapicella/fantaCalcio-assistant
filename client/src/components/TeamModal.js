import { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap/';
import { X } from 'react-bootstrap-icons';

import NavRole from './NavRole';


const TeamModal = (props) => {
    const { show, team, name, loggedIn, onClose, onDelete } = props;

    const [role, setRole] = useState('P');

    const handleChangeRole = (role) => {
        setRole(role);
    }

    //total fantaMilion 
    let total = 0;


    return (
        <Modal centered show={show} animation={false} onHide={onClose} >

            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <NavRole onSelect={handleChangeRole} />

                <ListGroup>
                    {team.filter((it) => it.role === role).map((player) => {
                        total += player.price;
                        return (
                            <ListGroup.Item
                                className="d-flex w-100 justify-content-between"
                                key={player.id}
                            >
                                <PlayerRowData
                                    player={player}
                                    onDelete={() => onDelete(player.id, role)}
                                    loggedIn={loggedIn}
                                />
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>

                <div className="d-flex justify-content-end">
                    <Badge variant='warning'>{total} {'FM'}</Badge>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} >
                    Close
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

const PlayerRowData = (props) => {
    const { player, loggedIn, onDelete } = props;
    return (
        <>
            <div className="flex-fill m-auto">
                {loggedIn ? <span onClick={onDelete}><X color='red' /></span>: ''}
                {player.name}
            </div>
            <Badge className='mx-2 ' variant='light'>{player.team}</Badge>
            <Badge className='mx-2 ' variant='light'>{player.price} {' FM'}</Badge>
        </>
    );
}

export default TeamModal;