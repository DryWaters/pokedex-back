require('dotenv').config();
const database = require('../database/db');
const utils = require('../database/utils');
const redis = require('../database/redis');

QUnit.done(() => {
  redis.disconnect();
  // Reset everything back and close database connection
  utils.rebuildData()
      .then(() => database.pgp.end());
});
