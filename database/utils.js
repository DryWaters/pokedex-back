const database = require('./db');
const fs = require('fs');
const csv = require('csv-parser');
const POKEMON = require('../constants/pokemonConstants');

/* Rebuilds entire pokemon database tables and inserts all data
 Uses promise chaining to complete each async task one after one another
 TODO:  Allow dynamic creation of definition from an object or array. */
const rebuildData = () => {
  return clearDatabase()
      .then(() => createTables())
      .then(() => loadPokemonData())
      .then(() => loadImageData())
      .then(() => loadTypeData())
      .then(() => loadPokemonTypeData())
      .catch((err) => console.log('Error creating database ' +
      'with error: ' + err));
};

// Drops all tables if they exist
const clearDatabase = () => {
  return database.db.none('DROP TABLE IF EXISTS public.images')
      .then(() => database.db.none('DROP TABLE IF EXISTS public.types'))
      .then(() => database.db.none('DROP TABLE IF EXISTS public.pokemon_types'))
      .then(() => database.db.none('DROP TABLE IF EXISTS public.pokemon'));
};

// Create all tables and primary keys
const createTables = () => {
  return database.db.none('CREATE TABLE public.pokemon_types' +
    ' (pokemon_id INTEGER, type_id INTEGER, slot INTEGER, CONSTRAINT ' +
    ' pokemon_types_pkey PRIMARY KEY (pokemon_id, slot))')
      .then(() => database.db.none('CREATE TABLE public.types' +
      ' (type_id INTEGER PRIMARY KEY, name CHARACTER VARYING(50))'))
      .then(() => database.db.none('CREATE TABLE' +
      ' public.pokemon (pokemon_id INTEGER PRIMARY KEY, name' +
      ' CHARACTER VARYING(50), image_id INTEGER UNIQUE)'))
      .then(() => database.db.none('CREATE TABLE public.images' +
      ' (image_id INTEGER PRIMARY KEY, small_image_path' +
      ' CHARACTER VARYING(255), large_image_path CHARACTER VARYING(255))'));
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
              image_id: data.image_id,
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

/* Loads all image data from CSV file expected to be in location is
./data/csv/images.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array.
Currently, all image_ids are assumed to be a one-to-one match
to the Pokemon ID number.
TODO:  Autoincrement ID in image_id field and insert that ID into
the pokemon data table */
const loadImageData = () => {
  return new Promise((resolve, reject) => {
    let imageData = [];
    fs.createReadStream('./data/csv/images.csv')
        .pipe(csv())
        .on('data', (data) => imageData.push(
            {
              image_id: data.image_id,
              small_image_path: POKEMON.SPRITE_PATH + 'small/' +
                data.image_id + '.png',
              large_image_path: POKEMON.SPRITE_PATH + 'large/' +
                data.image_id + '.png',
            }
        ))
        .on('end', () => {
          const insert =
            database.pgp.helpers.insert(imageData, database.imageColumns);
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
  loadImageData,
  loadTypeData,
  loadPokemonTypeData,
};

