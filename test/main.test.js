require('dotenv').config();
const database = require('../database/db');

QUnit.done(() => {
  database.pgp.end();
});
