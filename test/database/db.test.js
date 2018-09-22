let db;

QUnit.module('Database Testing', {
  before: () => {
    // Pull in required local DB information
    require('dotenv').config();
    db = require('../../database/db');
  }
});

QUnit.test('Test local database is valid and can initialize', (assert) => {
  assert.ok(typeof db !== null);
});

QUnit.test('something else');