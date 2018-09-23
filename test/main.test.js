require('dotenv').config();
const database = require('../database/db');
const utils = require('../database/utils');

QUnit.done(() => {
  database.pgp.end();
});
