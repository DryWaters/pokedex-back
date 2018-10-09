const utils = require('../../database/utils');
const database = require('../../database/db');
const POKEMON = require('../../constants/pokemonConstants');

QUnit.module('Database Util Testing', {
  before: (assert) => {
    const done = assert.async();
    utils.rebuildData()
        .then(() => {
          done();
        })
        .catch((error) => {
          console.err('error');
          done();
        });
  },
  after: (assert) => {
    const done = assert.async();
    utils.rebuildData()
        .then(() => {
          done();
        })
        .catch((error) => {
          console.err('error');
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
  database.db.any('SELECT COUNT(table_name) FROM information_schema.tables ' +
    'WHERE table_schema=\'public\'')
      .then((result) => {
        assert.equal(result[0].count, POKEMON.NUMBER_OF_TABLES,
            `Current number of tables is ${POKEMON.NUMBER_OF_TABLES}`);
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
        'FROM information_schema.tables ' +
        'WHERE table_schema=\'public\'');
      })
      .then((result) => {
        asyncCreateTables();
        assert.equal(result[0].count, POKEMON.NUMBER_OF_TABLES,
            'Created tables');
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
        assert.equal(result[0].count, POKEMON.NUM_POKEMON_WITH_ALT_FORMS,
            'Lots of pokemon!');
      })
      .catch((err) => {
        asyncLoadPokemon();
        assert.ok(false, `Unable to load pokemon data with error ${err}`);
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
        assert.equal(result[0].count, POKEMON.NUMBER_OF_TYPES,
            'Lots of types!');
      })
      .catch((err) => {
        asyncLoadTypes();
        assert.ok(false, `Unable to load type data with error ${err}`);
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
        assert.equal(result[0].count, POKEMON.TOTAL_POKEMON_WITH_TYPES,
            'Lots of pokemon types!');
      })
      .catch((err) => {
        asyncLoadPokemonTypes();
        assert.ok(false, `Unable to load type data with error ${err}`);
      });

  QUnit.test('Checks that pokemon desc data is loaded', (assert) => {
    const asyncLoadPokemonTypes = assert.async();
    utils.clearDatabase()
        .then(() => {
          return utils.createTables();
        })
        .then(() => {
          return database.db.any('SELECT COUNT(*) FROM pokemon_desc');
        })
        .then((result) => {
          assert.equal(result[0].count, '0', 'No pokemon desc =(');
          return utils.loadPokemonDescData();
        })
        .then(() => {
          return database.db.any('SELECT COUNT(*) FROM pokemon_desc');
        })
        .then((result) => {
          asyncLoadPokemonTypes();
          assert.equal(result[0].count, POKEMON.NUMBER_OF_POKEMON,
              'Lots of pokemon descriptions!');
        })
        .catch((err) => {
          asyncLoadPokemonTypes();
          assert.ok(false, `Unable to load type data with error ${err}`);
        });
  });
});
