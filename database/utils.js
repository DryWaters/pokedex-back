const database = require('./db');
const fs = require('fs');
const csv = require('csv-parser');

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
  return database.db.none('CREATE TABLE public.pokemon_types (pokemon_id ' +
    ' INTEGER, type_id INTEGER, slot INTEGER, CONSTRAINT pokemon_types_pkey ' +
    ' PRIMARY KEY (pokemon_id, slot))')
      .then(() => database.db.none('CREATE TABLE public.types (type_id ' +
      ' INTEGER PRIMARY KEY, name CHARACTER VARYING(50))'))
      .then(() => database.db.none('CREATE TABLE public.pokemon ' +
      ' (pokemon_id INTEGER PRIMARY KEY, name CHARACTER VARYING(50), ' +
      ' image_id INTEGER UNIQUE)'))
      .then(() => database.db.none('CREATE TABLE public.images (image_id ' +
      ' INTEGER PRIMARY KEY, image_path CHARACTER VARYING(255))'));
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
          insertPokemonDataIntoDB(pokemonData)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

const insertPokemonDataIntoDB = (pokemonData) => {
  return database.db.task((trans) => {
    const queries = pokemonData.map((row) => {
      return trans.none('INSERT INTO public.pokemon(pokemon_id, ' +
        'name, image_id) VALUES($1, $2, $3)', [row.pokemon_id,
        row.name, row.image_id]);
    });
    return trans.batch(queries);
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
            }
        ))
        .on('end', () => {
          insertImageDataIntoDB(imageData)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

const insertImageDataIntoDB = (imageData) => {
  return database.db.task((trans) => {
    const queries = imageData.map((row) => {
      return trans.none('INSERT INTO images(image_id, image_path) ' +
      'VALUES($1, $2)', [row.image_id, '/sprites/pokemon/' +
        row.image_id + '.png']);
    });
    return trans.batch(queries);
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
          insertTypeDataIntoDB(typeData)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

const insertTypeDataIntoDB = (typeData) => {
  return database.db.task((trans) => {
    const queries = typeData.map((row) => {
      return trans.none('INSERT INTO types(type_id, name) ' +
      'VALUES($1, $2)', [row.type_id, row.name]);
    });
    return trans.batch(queries);
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
          insertPokemonTypeDataIntoDB(pokemonTypeData)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                'load data into DB with error: ' + err);
                reject();
              });
        });
  });
};

const insertPokemonTypeDataIntoDB = (pokemonTypeData) => {
  return database.db.task((trans) => {
    const queries = pokemonTypeData.map((row) => {
      return trans.none('INSERT INTO pokemon_types(pokemon_id, ' +
      'type_id, slot) VALUES($1, $2, $3)', [row.pokemon_id,
        row.type_id, row.slot]);
    });
    return trans.batch(queries);
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

