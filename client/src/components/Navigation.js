import { Navbar, Nav, Button } from 'react-bootstrap/';
import { Redirect, Switch, Route, Link, useParams } from 'react-router-dom';

import { EmojiSunglasses as Emoji } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';

const Navigation = (props) => {
    const { loggedIn, user } = props;

    return (
        <Navbar bg="dark" variant="dark" fixed="top">

            <Navbar.Brand href="/">
                <Emoji className="mr-1" size="30" /> Fantapezzenti
            </Navbar.Brand>
            <Nav className="mr-auto">
                {loggedIn
                    ? <>
                        <Nav.Link as={Link} to='/home'>Home</Nav.Link>
                    </>
                    : ''}
                <Nav.Link as={Link} to='/about'>About</Nav.Link>
            </Nav>

            <Nav className="ml-auto justify-content-end">
                <Navbar.Text className="mx-2">
                    {user && user.name && `Welcome, ${user?.name}!`}
                </Navbar.Text>
                {loggedIn ?
                    <Nav.Link as={Link} to='/logout'><Button variant='light'>logout</Button></Nav.Link>
                    :
                    <Nav.Link as={Link} to='/login'><Button variant='light'>login</Button></Nav.Link>
                }
            </Nav>

        </Navbar>
    );
}

export default Navigation;