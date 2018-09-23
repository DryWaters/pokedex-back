require('dotenv').config();
const database = require('../database/db');
const utils = require('../database/utils');

QUnit.done(() => {
  // Reset everything back and close database connection
  utils.rebuildData()
      .then(() => database.pgp.end());
});
