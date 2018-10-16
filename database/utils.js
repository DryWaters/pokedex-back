const database = require('./db');
const fs = require('fs');
const csv = require('csv-parser');
const sql = require('./sql');

/* Rebuilds entire pokemon database tables and inserts all data
 Uses promise chaining to complete each async task one after one another
 TODO:  Allow dynamic creation of definition from an object or array. */
const rebuildData = () => {
  return clearDatabase()
      .then(() => createTables())
      .then(() => loadPokemonData())
      .then(() => loadTypeData())
      .then(() => loadPokemonTypeData())
      .then(() => loadPokemonDescData())
      .then(() => loadEvolutionData())
      .catch((err) => console.log('Error creating database ' +
  'with error: ' + err));
};

// Drops all tables if they exist
const clearDatabase = () => {
  return database.db.none(sql.types.dropTable)
      .then(() => database.db.none(sql.pokemonTypes.dropTable))
      .then(() => database.db.none(sql.pokemon.dropTable))
      .then(() => database.db.none(sql.pokemonDesc.dropTable))
      .then(() => database.db.none(sql.evolutions.dropTable));
};

// Create all tables and primary keys
const createTables = () => {
  return database.db.none(sql.pokemonTypes.createTable)
      .then(() => database.db.none(sql.types.createTable))
      .then(() => database.db.none(sql.pokemon.createTable))
      .then(() => database.db.none(sql.pokemonDesc.createTable))
      .then(() => database.db.none(sql.evolutions.createTable));
};

/* Loads all pokemon data from CSV file expected to be in location is
./data/csv/pokemon.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array.
*/
const loadPokemonData = () => {
  return new Promise((resolve, reject) => {
    let pokemonData = [];
    fs.createReadStream('./data/csv/pokemon.csv')
        .pipe(csv())
        .on('data', (data) => pokemonData.push(
            {
              pokemon_id: data.pokemon_id,
              name: data.name,
              species_id: data.species_id,
              image_id: data.image_id,
              evol_id: data.evol_id,
              hp: data.hp,
              attack: data.attack,
              defense: data.defense,
              special_attack: data.special_attack,
              special_defense: data.special_defense,
              speed: data.speed,
            }
        ))
        .on('end', () => {
          const insert =
            database.pgp.helpers.insert(pokemonData, database.pokemonColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                 'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

/* Loads all type definition data from CSV file expected to be in location is
./data/csv/types.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array. */
const loadTypeData = () => {
  return new Promise((resolve, reject) => {
    let typeData = [];
    fs.createReadStream('./data/csv/types.csv')
        .pipe(csv())
        .on('data', (data) => typeData.push(
            {
              type_id: data.type_id,
              name: data.name,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(typeData, database.typeColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

/* Loads all pokemon types data from CSV file expected to be in location is
./data/csv/pokemon_types.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array. */
const loadPokemonTypeData = () => {
  return new Promise((resolve, reject) => {
    let pokemonTypeData = [];
    fs.createReadStream('./data/csv/pokemon_types.csv')
        .pipe(csv())
        .on('data', (data) => pokemonTypeData.push(
            {
              pokemon_id: data.pokemon_id,
              type_id: data.type_id,
              slot: data.slot,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(pokemonTypeData,
              database.pokemonTypeColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At pokemon type data');
              });
        });
  });
};

/* Loads all pokemon description data from CSV file expected to be in
location ./data/csv/pokemon_desc.csv.  It uses NPM package csv-parser.
Data is inserted into one large batch after all data has been added to an array.
*/
const loadPokemonDescData = () => {
  return new Promise((resolve, reject) => {
    let pokemonDescData = [];
    fs.createReadStream('./data/csv/pokemon_desc.csv')
        .pipe(csv({separator: '`'}))
        .on('data', (data) => pokemonDescData.push(
            {
              pokemon_id: data.pokemon_id,
              p_desc: data.p_desc,
            }
        ))
        .on('end', () => {
          const insert =
            database.pgp.helpers.insert(pokemonDescData,
                database.pokemonDescColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                 'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

/* Loads all type definition data from CSV file expected to be in location is
./data/csv/types.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array. */
const loadEvolutionData = () => {
  return new Promise((resolve, reject) => {
    let evolutionData = [];
    fs.createReadStream('./data/csv/evolutions.csv')
        .pipe(csv())
        .on('data', (data) => evolutionData.push(
            {
              evolution_id: data.evolution_id,
              evolve_1: data.evolve_1,
              evolve_2: data.evolve_2 || null,
              evolve_3: data.evolve_3 || null,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(evolutionData, database.evolutionColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

// Exports all functions so they can be tested, only function needed
// by main application is the rebuildData() that calls all other functions
module.exports = {
  rebuildData,
  clearDatabase,
  createTables,
  loadPokemonData,
  loadTypeData,
  loadPokemonTypeData,
  loadPokemonDescData,
  loadEvolutionData,
};

