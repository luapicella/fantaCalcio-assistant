import { useState, useEffect } from 'react';

import { ListGroup, Badge, Form } from 'react-bootstrap';

import NavRole from './NavRole';


const ListPlayers = (props) => {
    const onClick = props.onClick;
    const onSelect = props.onSelect;

    const [searchPlayer, setSearchPlayer] = useState('');

    const filterPlayers = searchPlayer === '' ? props.players : props.players.filter((item) => {
        return item.name.includes(searchPlayer);
    })

    const orderPlayers = filterPlayers.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    })

    const handleChangePlayer = (ev) => {
        setSearchPlayer(ev.target.value.toUpperCase())
    }

    return (
        <>
            <NavRole
                onSelect={onSelect}
            />
            <SearchBar
                value={searchPlayer}
                onChange={handleChangePlayer}
            />
            <ListGroup>
                {orderPlayers.map((player) => {
                    return (
                        <ListGroup.Item
                            action
                            variant={player.status}
                            className="d-flex w-100 justify-content-between"
                            key={player.id}
                            variant="secondary"
                            onClick={() => onClick(player)}
                        >
                            <PlayerRowData player={player} />
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </>
    );
}

const PlayerRowData = (props) => {
    const { player } = props;
    return (
        <>
            <div className="flex-fill m-auto">{player.name}</div>
            <Badge className='mx-2 ' variant='light'>{player.team}</Badge>
            <Badge variant='warning'>QI: 22</Badge>
        </>
    );
}

const SearchBar = (props) => {
    const { value, onChange } = props;
    return (
        <Form className='nav-role'>
            <Form.Control
                type="search"
                placeholder="Search"
                className="mr-2"
                aria-label="Search"
                value={value}
                onChange={(ev) => onChange(ev)}
            />
        </Form>
    );
}


export default ListPlayers;