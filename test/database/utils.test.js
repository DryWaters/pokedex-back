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
  assert.ok(utils !== null);
});

QUnit.test('Checks that clears tables', (assert) => {
  const checkTableAmount = assert.async();
  const checkClearedAllTables = assert.async();
  database.db.any('SELECT COUNT(table_name) FROM information_schema.tables '+
  'WHERE table_schema=\'public\'')
      .then((result) => {
        assert.equal(result[0].count, '4', 'Current number of tables is 4');
        checkTableAmount();
        return utils.clearDatabase();
      })
      .then((result) => {
        return database.db.any('SELECT COUNT(table_name) FROM ' +
          'information_schema.tables WHERE table_schema=\'public\'');
      })
      .then((result) => {
        checkClearedAllTables();
        assert.equal(result[0].count, '0', 'Tables is 0');
      })
      .catch((error) => {
        checkTableAmount();
        checkClearedAllTables();
        console.log(error);
        assert.ok(false, 'Unable to clear tables');
      });

  assert.ok(1 == 1);
});

QUnit.test('Checks that tables are created', (assert) => {
  const asyncCreateTables = assert.async();
  utils.clearDatabase()
      .then(() => {
        return utils.createTables();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(table_name) ' +
        'FROM information_schema.tables '+
        'WHERE table_schema=\'public\'');
      })
      .then((result) => {
        asyncCreateTables();
        assert.equal(result[0].count, '4', 'Created tables');
      })
      .catch((err) => {
        asyncCreateTables();
        assert.ok(false, 'Unable to create tables');
      });
});

QUnit.test('Checks that pokemon data is loaded', (assert) => {
  const asyncLoadPokemon = assert.async();
  utils.clearDatabase()
      .then(() => {
        return utils.createTables();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM pokemon');
      })
      .then((result) => {
        assert.equal(result[0].count, '0', 'No pokemon =(');
        return utils.loadPokemonData();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM pokemon');
      })
      .then((result) => {
        asyncLoadPokemon();
        assert.equal(result[0].count, '802', 'Lots of pokemon!');
      })
      .catch((err) => {
        asyncLoadPokemon();
        assert.ok(false, 'Unable to load pokemon data with error ' + err);
      });
});

QUnit.test('Checks that image data is loaded', (assert) => {
  const asyncLoadImage = assert.async();
  utils.clearDatabase()
      .then(() => {
        return utils.createTables();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM images');
      })
      .then((result) => {
        assert.equal(result[0].count, '0', 'No images =(');
        return utils.loadImageData();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM images');
      })
      .then((result) => {
        asyncLoadImage();
        assert.equal(result[0].count, '802', 'Lots of images!');
      })
      .catch((err) => {
        asyncLoadImage();
        assert.ok(false, 'Unable to load image data with error ' + err);
      });
});

QUnit.test('Checks that type data is loaded', (assert) => {
  const asyncLoadTypes = assert.async();
  utils.clearDatabase()
      .then(() => {
        return utils.createTables();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM types');
      })
      .then((result) => {
        assert.equal(result[0].count, '0', 'No types =(');
        return utils.loadTypeData();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM types');
      })
      .then((result) => {
        asyncLoadTypes();
        assert.equal(result[0].count, '18', 'Lots of types!');
      })
      .catch((err) => {
        asyncLoadTypes();
        assert.ok(false, 'Unable to load type data with error ' + err);
      });
});

QUnit.test('Checks that pokemon type data is loaded', (assert) => {
  const asyncLoadPokemonTypes = assert.async();
  utils.clearDatabase()
      .then(() => {
        return utils.createTables();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM pokemon_types');
      })
      .then((result) => {
        assert.equal(result[0].count, '0', 'No pokemon types =(');
        return utils.loadPokemonTypeData();
      })
      .then(() => {
        return database.db.any('SELECT COUNT(*) FROM pokemon_types');
      })
      .then((result) => {
        asyncLoadPokemonTypes();
        assert.equal(result[0].count, '1204', 'Lots of pokemon types!');
      })
      .catch((err) => {
        asyncLoadPokemonTypes();
        assert.ok(false, 'Unable to load type data with error ' + err);
      });
});
