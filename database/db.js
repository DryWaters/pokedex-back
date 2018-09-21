// Check if connection should be local 
// or Heroku DB
const pgp = require('pg-promise')();
let db;

if (process.env.LOCAL && process.env.LOCAL === 'TRUE') {
  connectionDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
  db = pgp(connectionDetails);
} else {
  db = pgp(process.env.DATABASE_URL);
}

module.exports = db;