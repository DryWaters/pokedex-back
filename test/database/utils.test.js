const utils = require('../../database/utils');
const database = require('../../database/db');

QUnit.module('Database Util Testing', {
  before: (assert) => {
    const done = assert.async();
    utils.rebuildData()
        .then(() => {
          console.log('done setting up');
          done();
        })
        .catch((error) => {
          console.log('error');
          done();
        });
  },
});

QUnit.test('Checks that Database Utils Exists', (assert) => {
  const checkTableAmount = assert.async();
  database.db.any('SELECT COUNT(table_name) FROM information_schema.tables '+
    'WHERE table_schema=\'public\'')
      .then((result) => {
        checkTableAmount();
        console.log(result);
        database.db.any('SELECT * FROM pokemon')
            .then(((result) => {
              console.log(result);
              assert.equal(result[0].count, '4', 'Current number of tables is 4');
            }) );
      });
});

// QUnit.test('Checks that clears tables', (assert) => {
//   // const checkTableAmount = assert.async();
//   // const checkClearedAllTables = assert.async();
//   // database.db.any('SELECT COUNT(table_name) FROM information_schema.tables '+
//   // 'WHERE table_schema=\'public\'')
//   //     .then((result) => {
//   //       assert.equal(result[0].count, '4', 'Current number of tables is 4');
//   //       checkTableAmount();
//   //       utils.clearDatabase()
//   //           .then((result) => {
//   //             database.db.any('SELECT COUNT(table_name) FROM information_schema.tables '+
//   //             'WHERE table_schema=\'public\'')
//   //                 .then((result) => {
//   //                   checkClearedAllTables();
//   //                   assert.equal(result[0].count, '0', 'Current number of tables is 0');
//   //                 });
//   //           });
//   //     })
//   //     .catch((error) => {
//   //       checkTableAmount();
//   //       checkClearedAllTables();
//   //       console.log(error);
//   //       assert.ok(false, 'Unable to get current tables');
//   //     });

//   assert.ok(1 == 1);
// });

// QUnit.test('Database tables are cleared clearDatabase', (assert) => {
//   // database.db.none('SELECT COUNT(*) FROM ' +
//   //   'information_schema.tables where table_schema = "public"')
//   //     .then((result) => console.log(result));
//   assert.ok(1 == 1);
// });
