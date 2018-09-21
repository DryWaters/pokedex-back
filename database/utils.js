const db = require('./db');
const fs = require('fs');
var csv = require('csv-parser')


const rebuildData = () => {
  clearDatabase()
    .then(() => createTables())
    .then(() => loadPokemonData())
    .then(() => loadImageData())
    .then(() => loadTypeData())
    .then(() => loadPokemonTypeData())
    .catch(err => {
      console.log('Error creating database error ' + err)
    });
}

const clearDatabase = () => {
  return db.none('DROP TABLE IF EXISTS public.images')
    .then(() => db.none('DROP TABLE IF EXISTS public.types'))
    .then(() => db.none('DROP TABLE IF EXISTS public.pokemon_types'))
    .then(() => db.none('DROP TABLE IF EXISTS public.pokemon'))
}

const createTables = () => {
  return db.none('CREATE TABLE public.pokemon_types (pokemon_id INTEGER, type_id INTEGER, slot INTEGER, CONSTRAINT pokemon_types_pkey PRIMARY KEY (pokemon_id, slot))')
    .then(() => db.none('CREATE TABLE public.types (type_id INTEGER PRIMARY KEY, name CHARACTER VARYING(50))'))
    .then(() => db.none('CREATE TABLE public.pokemon (pokemon_id INTEGER PRIMARY KEY, name CHARACTER VARYING(50), image_id INTEGER UNIQUE)'))
    .then(() => db.none('CREATE TABLE public.images (image_id INTEGER PRIMARY KEY, image_path CHARACTER VARYING(255))'))
}

const loadPokemonData = () => {
  return new Promise((resolve, reject) => {
    let pokemonData = [];
    fs.createReadStream('./data/csv/pokemon.csv')
      .pipe(csv())
      .on('data', data => pokemonData.push(
        {
          pokemon_id: data.pokemon_id,
          name: data.name,
          image_id: data.image_id
        }
      ))
      .on('end', () => {
        db.task(trans => {
          const queries = pokemonData.map(row => {
            return trans.none('INSERT INTO public.pokemon(pokemon_id, name, image_id) VALUES($1, $2, $3)', [row.pokemon_id, row.name, row.image_id]);
          });
          return trans.batch(queries);
        });
        resolve();
      });
  });
}

const loadImageData = () => {
  return new Promise((resolve, reject) => {
    let imageData = [];
    fs.createReadStream('./data/csv/images.csv')
      .pipe(csv())
      .on('data', data => imageData.push(
        {
          image_id: data.image_id
        }
      ))
      .on('end', () => {
        db.task(trans => {
          const queries = imageData.map(row => {
            return trans.none('INSERT INTO images(image_id, image_path) VALUES($1, $2)', [row.image_id, '/sprites/pokemon/' + row.image_id + '.png']);
          });
          return trans.batch(queries);
        });
        resolve();
      });
  });
}

const loadTypeData = () => {
  return new Promise((resolve, reject) => {
    let typeData = [];
    fs.createReadStream('./data/csv/types.csv')
      .pipe(csv())
      .on('data', data => typeData.push(
        {
          type_id: data.type_id,
          name: data.name
        }
      ))
      .on('end', () => {
        db.task(trans => {
          const queries = typeData.map(row => {
            return trans.none('INSERT INTO types(type_id, name) VALUES($1, $2)', [row.type_id, row.name]);
          });
          return trans.batch(queries);
        })
        resolve();
      });
  });
}

const loadPokemonTypeData = () => {
  return new Promise((resolve, reject) => {
    let pokemonTypeData = [];
    fs.createReadStream('./data/csv/pokemon_types.csv')
      .pipe(csv())
      .on('data', data => pokemonTypeData.push(
        {
          pokemon_id: data.pokemon_id,
          type_id: data.type_id,
          slot: data.slot
        }
      ))
      .on('end', () => {
        db.task(trans => {
          const queries = pokemonTypeData.map(row => {
            return trans.none('INSERT INTO pokemon_types(pokemon_id, type_id, slot) VALUES($1, $2, $3)', [row.pokemon_id, row.type_id, row.slot]);
          });
          return trans.batch(queries);
        })
        resolve();
      });
  });
}

module.exports = {
  rebuildData,
  clearDatabase,
  createTables,
  loadPokemonData,
  loadImageData,
  loadTypeData,
  loadPokemonTypeData
}