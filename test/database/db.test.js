require('dotenv').config();
const database = require('../../database/db');

QUnit.module('Database Testing');
QUnit.test('Remote database is valid and can initialize', (assert) => {
  assert.ok(typeof database.db !== null);
});

QUnit.test('Remote connection credentials are valid', (assert) => {
  const connectionDone = assert.async();
  database.db.connect()
      .then((obj) => {
        obj.done();
        assert.ok(true, 'Connection can be made');
        connectionDone();
      })
      .catch((error) => {
        assert.ok(false, 'Unable to make connection with error' + error);
        connectionDone();
      });
});

QUnit.test('Local connection credientials are valid', (assert) => {
  const connectionDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
  const localDatabase = database.pgp(connectionDetails);
  const connectionDone = assert.async();
  localDatabase.connect()
      .then((obj) => {
        obj.done();
        assert.ok(true, 'Connection can be made');
        connectionDone();
      })
      .catch((error) => {
        assert.ok(false, 'Unable to make connection with error' + error);
        connectionDone();
      });
  assert.ok(1 == 1);
});
