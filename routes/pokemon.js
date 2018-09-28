const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');

/* GET array of Pokemon from id and range
with endpoint of the base /pokemon
ex. /pokemon?id=1&range=20
Expected id is from 1 - 806
Expected range (ID + RANGE - 1) lies within 1 - 806
example to get one pokemon
/pokemon?id=20&range=1
example to get 20 pokemon
/pokemon?id=500&range=20 */
router.get('/', (req, res, next) => {
  const startingId = parseInt(req.query.id);
  const range = parseInt(req.query.range);
  if (
    startingId < 1 ||
    startingId > POKEMON.NUMBER_OF_POKEMON ||
    startingId + range - 1 > POKEMON.NUMBER_OF_POKEMON ||
    isNaN(startingId) ||
    isNaN(range)
  ) {
    return res.status(404)
        .json({
          'error': 'Invalid id or range',
          'expected params': {
            'id': '1-' + POKEMON.NUMBER_OF_POKEMON,
            'range': '(id + range - 1) < ' + POKEMON.NUMBER_OF_POKEMON,
          },
        });
  }

  // Within range, get data from DB and return parsed results
  database.db.any(
      'select pokemon.pokemon_id as id, pokemon.name, types.name as' +
    ' types_name, image_path from pokemon INNER JOIN images ON' +
    ' images.image_id = pokemon.pokemon_id INNER JOIN pokemon_types' +
    ' ON pokemon_types.pokemon_id = pokemon.pokemon_id INNER JOIN types' +
    ' ON types.type_id = pokemon_types.type_id where pokemon.pokemon_id ' +
    ' >= $1 and pokemon.pokemon_id <= $2', [startingId, startingId + range - 1])
      .then((result) => {
        return res.status(200).json(parsePokemonResults(result));
      })
      .catch((error) => {
        console.error('Unable to process request with error: ' + error);
      });
});

const parsePokemonResults = (result) => {
  const lookup = {};
  const pokemon = [];
  result.forEach((row) => {
    if (!lookup.hasOwnProperty(row.id)) {
      lookup[row.id] = pokemon.length;
      pokemon.push({
        id: row.id,
        name: row.name,
        types: [row.types_name],
        image_path: {
          small: row.image_path,
          large: row.image_path,
        },
      });
    } else {
      pokemon[lookup[row.id]].types.push(row.types_name);
    }
  });
  return {pokemon};
};

module.exports = router;
