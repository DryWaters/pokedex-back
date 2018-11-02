const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');
const sql = require('../database/sql');

/* GET array of Pokemon from a search
with endpoint of the base /pokemon

Example of valid Search Params are:
id=1&range=20
name=bulb
type=1,2
ability=over

example to get one pokemon
/pokemon?id=20&range=1
example to get 20 pokemon
/pokemon?id=500&range=20
example to get range of pokemon with the name containing 'char'
/pokemon?id=20&range=50&name=char
example to get a range of pokemon from 10-20 with name containing 'bulb'
and normal and fire type and has ability containing 'over'
/pokemon?id=10&range=20&name=bulb&types=1,10&ability=over
*/

router.get('/', (req, res) => {
  // console.log(validSearch(req.query));
  if (!validSearch(req.query)) {
    return res.status(404)
        .json({
          'error': 'Invalid id or range',
          'expected params': {
            'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
            'range': `(id + range - 1) < ${POKEMON.NUMBER_OF_POKEMON}`,
          },
        });
  }

  const startingId = Number.parseInt(req.query.id);
  const range = Number.parseInt(req.query.range);
  const ids = [];
  for (let i = startingId; i < startingId + range; i++) {
    ids.push(i);
  }


  // Take given array of IDs and return the ids, names, and types
  database.db.any(sql.pokemonAll.selectAllWithRange, {ids})
      .then((result) => res.status(200).json(parsePokemonResults(result)))
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
        image_path: `${POKEMON.SPRITE_PATH}large/${row.image_id}.png`,
      });
    }
  });

  // return array appended to the object key "pokemon"
  return {pokemon};
};

const validSearch = (queries) => {
  const validQuery = {
    id: () => isValidIdAndRange(queries),
    range: () => isValidIdAndRange(queries),
    types: () => isValidTypes(queries.types),
    // ability: checkAbility(queries.ability),
    // name: checkName(queries.name)
  };

  for (let query of Object.keys(queries)) {
    if (!validQuery.hasOwnProperty(query) ||
      !validQuery[query]()) {
      return false;
    }
  };

  return true;
};

const isValidIdAndRange = ({id, range}) => {
  const pokemonId = Number.parseInt(id);
  const numberOfPokemon = Number.parseInt(range);
  return (
    numberOfPokemon >= 1 &&
    pokemonId >= 1 &&
    pokemonId <= POKEMON.NUMBER_OF_POKEMON &&
    (pokemonId + numberOfPokemon - 1) <= POKEMON.NUMBER_OF_POKEMON &&
    !isNaN(pokemonId) &&
    !isNaN(numberOfPokemon)
  );
};

const isValidTypes = (types) => {
  for (let type of types.split(',')) {
    if (isNaN(type) || type < 1 || type > POKEMON.NUMBER_OF_TYPES) {
      return false;
    }
  };

  return true;
};

module.exports = router;
