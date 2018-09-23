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
});

QUnit.test('Test fail on bad credientials', (assert) => {
  const badDetails = {
    host: 'localhost',
    port: 999,
    database: 'database',
    user: 'user',
    password: 'fail',
  };
  const badDatabase = database.pgp(badDetails);
  const connectionDone = assert.async();
  badDatabase.connect()
      .then((obj) => {
        obj.done();
        assert.ok(false, 'Should not connect!');
        connectionDone();
      })
      .catch((error) => {
        assert.ok(true, 'Should fail with error: ' + error);
        connectionDone();
      });
});
