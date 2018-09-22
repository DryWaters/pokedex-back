require('dotenv').config();

const database = require('../../database/db');

QUnit.module('Database Testing', {
  after: () => {
    // kill DB connection after tests
    database.pgp.end();
  },
});

QUnit.test('Test local database is valid and can initialize', (assert) => {
  assert.ok(typeof database.db !== null);
});

QUnit.test('Test local connection credentials is valid', (assert) => {
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

QUnit.test('Test remote connection credientials is valid', (assert) => {
  const remoteDatabase = database.pgp(process.env.DATABASE_URL + '?ssl=true');
  const connectionDone = assert.async();
  remoteDatabase.connect()
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
