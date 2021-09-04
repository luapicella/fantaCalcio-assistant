'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const socketIo = require("socket.io");
const { check, validationResult } = require('express-validator'); // validation middleware
//const dao = require('./dao'); // module for accessing the DB
const examDao = require('./fantaDao'); // module for accessing the exams in the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./userDao'); // module for accessing the users in the DB
const fantaDao = require('./fantaDao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); //req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3003;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());


// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

// custom middleware: check if a given request is coming from an authenticated user
const isNotPurchased = (req, res, next) => {
  fantaDao.getPurchased(req.body.id)
    .then(row => {
      if (row.length > 0)
        return res.status(401).json({ error: 'already purchased' });
      else
        return next();
    })
    .catch(() => res.status(500).end());
}

// custom middleware: check if a given request is coming from an authenticated user
const isCompleted = (req, res, next) => {
  fantaDao.getNumberRole(req.body.fantateams, req.body.role)
    .then(row => {
      let valid = true;
      switch (req.body.role) {
        case 'P':
          if (row.length === 3) valid = false;
          break;
        case 'D':
          if (row.length === 8) valid = false;
          break;
        case 'C':
          if (row.length === 8) valid = false;
          break;
        case 'A':
          if (row.length === 6) valid = false;
          break;
      }
      if (!valid)
        return res.status(401).json({ error: `${req.body.fantaTeams}: role complete` });
      else
        return next();
    })
    .catch(() => res.status(500).end());
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '- Astra inclinant, sed non obligant -',
  resave: false,
  saveUninitialized: false
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

/*** AUTH APIs ***/

//POST /sessions
app.post('/api/sessions',
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user
        return res.json(req.user);
      });0
    })(req, res, next);
  });

//DELETE /sessions/current 
app.delete('/api/sessions/current',
  (req, res) => {
    req.logout();
    res.end();
  });


// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current',
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    }
    else
      res.status(401).json({ error: 'Unauthenticated user!' });;
  });


//POST /sessions
app.post('/api/sessions',
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user
        return res.json(req.user);
      });
    })(req, res, next);
  });

//DELETE /sessions/current 
app.delete('/api/sessions/current',
  (req, res) => {
    req.logout();
    res.end();
  });


// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current',
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    }
    else
      res.status(401).json({ error: 'Unauthenticated user!' });;
  });

/*** APIs ***/

// GET /api/fataTeams
app.get('/api/fantaTeams',
  (req, res) => {
    fantaDao.getFantaTeams()
      .then(fantaTeams => res.json(fantaTeams))
      .catch(() => res.status(500).end());
  });

// GET /api/players
app.get('/api/players',
  isLoggedIn,
  (req, res) => {
    fantaDao.getPlayers(req.query.role)
      .then(players => res.json(players))
      .catch(() => res.status(500).end());
  });

// GET /api/fatntaTeams/<id>
app.get('/api/fantaTeams/:id',
  (req, res) => {
    fantaDao.getFantaTeam(req.params.id)
      .then(team => res.json(team))
      .catch(() => res.status(500).end());
  });



// POST /api/purchase
app.post('/api/purchase',
  isLoggedIn,
  isNotPurchased,
  isCompleted,
  [
    check('id').isInt(),
    check('role').isIn(['P', 'D', 'C', 'A']),
    check('price').isInt(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const pur = {
        id: req.body.id,
        fantateams: req.body.fantateams,
        role: req.body.role,
        price: req.body.price,
      };
      console.log(pur)
      return res.status(422).json({ errors: errors.array() });
    }


    const purchase = {
      id: req.body.id,
      fantateams: req.body.fantateams,
      role: req.body.role,
      price: req.body.price,
    };

    fantaDao.addPurchase(purchase)
      .then(obj => res.status(201).json(obj).end())
      .catch((err) => {
        console.log(err)
        res.status(500).end()
      });

  });

// DELETE /api/purchase/id
app.delete('/api/purchase/:id',
  isLoggedIn,
  [
    check('id').isInt(),
  ],
  (req, res) => {
    fantaDao.deletePurchase(req.params.id)
      .then(() => res.json({}))
      .catch(() => res.status(500).end());
  });



/*** Other express-related instructions ***/

// Activate the server
const server = app.listen(port, () => {
  console.log(`react-fanta-server listening at http://localhost:${port}`);
});

const io = socketIo(server);

io.on("connection", socket => {
  console.log("New client connected " + socket.id);
  //console.log(socket);
  // Returning the initial data of food menu from FoodItems collection
  socket.on('update', () => {
    fantaDao.getFantaTeams()
      .then(fantaTeams => {
        io.sockets.emit("update", fantaTeams);
      })
      .catch(err => console.log(err))
  })
  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
