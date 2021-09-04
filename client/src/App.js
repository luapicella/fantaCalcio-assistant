import { useState, useEffect } from 'react';
import { Container, Row, Col, Toast } from 'react-bootstrap/';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import socketIOClient from "socket.io-client";

import Navigation from './components/Navigation';
import FantaForm from './components/FantaForm';
import Dashboard from './components/Dashboard';
import NavRole from './components/NavRole';
import ListPlayers from './components/ListPlayers';
import TeamModal from './components/TeamModal';
import LoginForm from './components/LoginForm';
import LogoutForm from './components/LogoutForm';

import API from './API';


function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

const socket = socketIOClient('/');


const Main = (props) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [checkAuth, setCheckAuth] = useState(false);

  const [dirty, setDirty] = useState('true');
  const [dirtypurchase, setDirtyPurchase] = useState('true');

  const [loading, setLoading] = useState(true);

  //all fanta Teams to sho in dashboard
  const [fantaTeams, setFantaTeams] = useState([]);

  //team to swow in modal
  const [fantaTeam, setFantaTeam] = useState([]);
  const [name, setName] = useState('');


  const [role, setRole] = useState('P');
  const [players, setPlayers] = useState([]);

  //player to pass form
  const [player, setPlayer] = useState({});

  const [showFormCreate, setShowFormCreate] = useState(false);
  const [showTeam, setShowTeam] = useState(false);

  /*error msg state*/
  const [message, setMessage] = useState('');



  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        setCheckAuth(true);
      }
    };
    checkAuth()
      .then(() => setCheckAuth(true))
  }, []);

  //get fantaTeams
  useEffect(() => {
    const getFantaTeams = async () => {
      const teams = await API.getFantaTeams();
      setFantaTeams(teams);
    };
    if (dirty) {
      getFantaTeams()
        .then(() => setDirty(false))
        .catch((err) => console.log(err));
    }
  }, []);

  //get connect with socket
  useEffect(() => {

    socket.on('update', (teams) => {
      setFantaTeams(teams);
    })
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  //get players
  useEffect(() => {
    const getPlayers = async () => {
      const p = await API.getPlayers(role);
      setPlayers(p);
    };
    if (loggedIn)
      getPlayers()
        .catch((err) => console.log(err));
  }, [loggedIn, role]);

  //handle chenge role players in the list
  const handleChangeRole = (role) => {
    setRole(role);
  }

  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
  }

  //show/not show the form for save new players in one teams
  const handleChangeShowFormCreate = () => {
    setShowFormCreate((old) => !old);
  }

  // set state of player choose and show form
  const handleChosePlayer = (player) => {
    setPlayer(player);
    handleChangeShowFormCreate();
  }

  const handleAddPurchase = (purchase) => {
    setFantaTeams((oldFantaTeams) => {
      return oldFantaTeams.map(item => {
        if (item.id === purchase.fantaTeams)
          return { ...item, status: 'warning' }
        else
          return item;
      })
    })
    API.addPurchase(purchase)
      .then(() => {
        setDirty(true);
        socket.emit('update', '')
      })
      .catch(err => {
        handleErrors(err)
      })
  }

  const handleDeletePurchase = (id, role) => {
    API.deletePurchase(id, role)
      .then(() => {
        socket.emit('update', '');
        setFantaTeam((oldTeam) => {
          return oldTeam.filter((it) => it.id !== id)
        })
      })
      .catch(err => {
        handleErrors(err)
      })
  }

  const handleChangeShowTeam = () => {
    setShowTeam((old) => !old);
    setFantaTeam([]);
  }

  const handleShowTeam = (id, name) => {
    handleChangeShowTeam()
    handleChangeName(name)
    API.getFantaTeam(id)
      .then((team) => setFantaTeam(team))
  }

  const handleChangeName = (name) => {
    setName(name);
  }

  const handleLogIn = async (credentials) => {
    const user = await API.logIn(credentials);
    setLoggedIn(true);
    setDirty(true);
    setLoading(true);
    setUser(user);
  }

  const handleLogOut = async () => {
    await API.logOut()
    // clean up everything
    setLoggedIn(false);
    setDirty(true);
    setLoading(true);
    setUser({});
  }

  return (
    <Container fluid>
      <Row>
        <Navigation loggedIn={loggedIn} user={user} />
      </Row>

      <Switch>

        <Route exact path="/login" render={() =>
          <>
            {
              loggedIn
                ? <Redirect to="/home" />
                : <LoginForm login={handleLogIn} />
            }
          </>
        } />


        <Route exact path="/logout" render={() =>
          <>
            {
              loggedIn
                ? <LogoutForm logout={handleLogOut} />
                : <Redirect to="/home" />
            }
          </>
        } />

        <Route exact path='/about'>
          <Row className="justify-content-md-center">
            <Col sm={6} className="below-nav" >
              <h3>About</h3>
              <p>FantaCalcio assistant is a simple and fast website that assists the fantacalcio auction . The list of players is provided by the following <a href="https://www.fantacalcio.it/quotazioni-fantacalcio">site.</a> <br /> <br /> FantaCalcio assistant is an open source project that you are free to contribute : <a href='https://github.com/luapicella/fantaCalcio-assistant'>https://github.com/luapicella/fantaCalcio-assistant.</a></p>
            </Col>
          </Row>
        </Route>

        <Route path='/home' render={() => {
          return (
            <>
              <Row className="justify-content-md-center">


                {loggedIn
                  ? <Col sm={4} className="below-nav" >
                    <ListPlayers
                      players={players}
                      onSelect={handleChangeRole}
                      onClick={handleChosePlayer} />
                    <FantaForm
                      show={showFormCreate}
                      player={player}
                      teams={fantaTeams.map(team => ({ id: team.id, name: team.name }))}
                      onClose={handleChangeShowFormCreate}
                      onSave={handleAddPurchase}
                    />
                  </Col>
                  : ''
                }


                <Col sm={6} className="below-nav">

                  <Toast role='alert' show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
                    <Toast.Body>{message?.msg}</Toast.Body>
                  </Toast>

                  <Dashboard
                    fantaTeams={fantaTeams}
                    onShow={handleShowTeam}
                  />
                  <TeamModal
                    show={showTeam}
                    team={fantaTeam}
                    name={name}
                    loggedIn={loggedIn}
                    onClose={handleChangeShowTeam}
                    onDelete={handleDeletePurchase}
                  />
                </Col>

              </Row>
            </>
          );
        }} />

        <Redirect to='/home' />

      </Switch>



    </Container >
  );
}

export default App;

