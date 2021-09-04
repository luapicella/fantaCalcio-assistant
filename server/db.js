'use strict';

/*const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('fanta.sqlite', (err) => {
  if (err) throw err;
});

module.exports = db;*/

/*const Pool = require("pg").Pool;

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const db = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = db;*/

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "fanta",
  password: "",
  port: 5432,
};

const Pool = require("pg").Pool;

const connectionString = `postgresql://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;

const db = new Pool({
  connectionString: connectionString,
  ssl: {
      rejectUnauthorized: false,
  },
});  

module.exports = db;

