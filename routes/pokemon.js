const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');
const sql = require('../database/sql');

/* GET array of Pokemon from id and range
with endpoint of the base /pokemon
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
    range < 1 ||
    startingId < 1 ||
    startingId > 806 ||
    startingId + range - 1 > 806 ||
    isNaN(startingId) ||
    isNaN(range)
  ) {
    return res.status(404)
        .json({
          'error': 'Invalid id or range',
          'expected params': {
            'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
            'range': `(id + range - 1) < ${POKEMON.NUMBER_OF_POKEMON}`,
          },
        });
  }

  // Within range, get data from DB and return parsed results
  database.db.any(sql.pokemon.selectAllWithRange,
      [startingId, startingId + range - 1])
      .then((result) => {
        return res.status(200).json(parsePokemonResults(result));
      })
      .catch((error) => {
        console.error(`Unable to process request with error: ${error}`);
      });
});

// Remove duplicate rows for pokemon that have multiple types
// per pokemon
const parsePokemonResults = (result) => {
  const pokemon = [];
  result.forEach((row, index) => {
    // if pokemon already exists in return array, just append type
    if (index > 0 && result[index - 1].id === result[index].id) {
      pokemon[pokemon.length - 1].types.push(row.types_name);
    } else { // else add new pokemon to return
      pokemon.push({
        id: row.id,
        name: row.name,
        types: [row.types_name],
        image_path: {
          small: `${POKEMON.SPRITE_PATH}small/${row.image_id}.png`,
          large: `${POKEMON.SPRITE_PATH}large/${row.image_id}.png`,
        },
      });
    }
  });

  // return array appended to the object key "pokemon"
  return {pokemon};
};

module.exports = router;
