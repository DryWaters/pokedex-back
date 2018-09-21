const db = require('./db');
const fs = require('fs');
var csv = require('csv-parser')


const rebuildData = () => {

  db.none(`DROP TABLE IF EXISTS public.images`)
    .then(() => {
      return db.none('DROP TABLE IF EXISTS public.pokemon')
    })
    .then(() => {
      return db.none('CREATE TABLE public.images (image_id integer PRIMARY KEY, image_path character varying(255))')
    })
    .then(() => {
      return db.none('CREATE TABLE public.pokemon (pokemon_id integer PRIMARY KEY, name character varying(50), image_id integer UNIQUE)');
    })
    .then(() => {
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
          console.log('Done reading pokemone data');
          db.tx(trans => {
            const queries = pokemonData.map(row => {
              return trans.none('INSERT INTO pokemon(pokemon_id, name, image_id) VALUES($1, $2, $3)', [row.pokemon_id, row.name, row.image_id]);
            });
            return trans.batch(queries);
          })
        });
    })
    .then(() => {
      let imageData = [];
      fs.createReadStream('./data/csv/images.csv')
        .pipe(csv())
        .on('data', data => imageData.push(
          {
            image_id: data.image_id
          }
        ))
        .on('end', () => {
          db.tx(trans => {
            const queries = imageData.map(row => {
              return trans.none('INSERT INTO images(image_id, image_path) VALUES($1, $2)', [row.image_id, '/sprites/pokemon/' + row.image_id + '.png']);
            });
            return trans.batch(queries);
          })
        });
    })
    .catch(err => {
      console.log('Error dropping table with error ' + err)
    });
}

module.exports = {
  rebuildData: rebuildData
}