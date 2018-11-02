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
types=1,2
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
  if (!validSearch(req.query)) {
    return res.status(404)
        .json({
          'error': 'Invalid search',
          'valid search queries': {
            'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
            'range': `(id + range - 1) < ${POKEMON.NUMBER_OF_POKEMON}`,
            'name': 'Not empty',
            'types': '1-18, 1-18',
            'ability': 'Not empty',
          },
        });
  }

  // Have a valid search, build query from search queries
  const searchQuery = buildQuery(req.query);

  return database.db.any(searchQuery)
      .then((result) => {
        return parseIds(result);
      })
      .then((ids) => {
        return database.db.any(sql.pokemonAll.selectAllWithRange, {ids});
      })
      .then((result) => res.status(200).json(parsePokemonResults(result)))
      .catch((error) => {
        console.error(`'Error when searching for pokemon: ${error}`);
        return res.status(404)
            .json({
              'error': 'Invalid search',
              'valid search queries': {
                'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
                'range': `(id + range - 1) < ${POKEMON.NUMBER_OF_POKEMON}`,
                'name': 'Not empty',
                'types': '1-18, 1-18',
                'ability': 'Not empty',
              },
            });
      })
  ;
});

const parseIds = (ids) => {
  return ids.map((id) => {
    return id.pokemon_id;
  });
};

const buildQuery = (query) => {
  const queryParams = {
    select: ['SELECT p.pokemon_id'],
    tables: ['pokemon p'],
    joins: [],
    where: [],
    order: ['ORDER BY p.pokemon_id'],
  };

  const queryBuilder = {
    id: () => buildIdAndRange(queryParams, query),
    name: () => buildPokemonName(queryParams, query),
    types: () => buildPokemonTypes(queryParams, query),
    ability: () => buildPokemonAbilities(queryParams, query),
  };

  Object.keys(query).forEach((param) => {
    if (param !== 'range') {
      queryBuilder[param]();
    }
  });

  return constructQuery(queryParams);
};

const constructQuery = (queryParams) => {
  let query = queryParams.select + ' FROM ';
  query += queryParams.tables.join(', ');

  query += queryParams.joins.map((clause, index) => {
    return ` JOIN ${clause}`;
  }).join('');

  query += queryParams.where.map((clause, index) => {
    if (index === 0) {
      return ` WHERE ${clause}`;
    } else {
      return ` AND ${clause}`;
    }
  }).join('');

  query += ' ' + queryParams.order + ';';
  return query;
};

const buildIdAndRange = (queryParams, {id, range}) => {
  queryParams.where.push(`p.pokemon_id >= ${id}`);
  queryParams.where.push('p.pokemon_id <= ' +
    (Number.parseInt(id) + Number.parseInt(range)));
};

const buildPokemonName = (queryParams, {name}) => {
  queryParams.where.push(
      `LOWER(p.name) LIKE '%${name.toLowerCase()}%'`);
};

const buildPokemonTypes = (queryParams, {types}) => {
  let typeWhere = '';
  types.split(',').forEach((type, index) => {
    if (index !== 0) {
      typeWhere += ' AND ';
    }

    queryParams.joins.push(
        `pokemon_types pt${index} ON p.pokemon_id = pt${index}.pokemon_id`);

    typeWhere += `pt${index}.type_id = ${type}`;
  });
  queryParams.where.push(`(${typeWhere})`);
};

const buildPokemonAbilities = (queryParams, {ability}) => {
  queryParams.where.push(`LOWER(a.name) LIKE '%${ability.toLowerCase()}%'`);
  queryParams.joins.push(`pokemon_abils pa ON p.pokemon_id = pa.pokemon_id`);
  queryParams.joins.push(`abilities a ON pa.ability_id = a.abil_id`);
};

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

// Validates the search queries
const validSearch = (queries) => {
  let keys = Object.keys(queries);

  // no search terms found...bad search
  if (keys.length === 0) {
    return false;
  }

  // Object containing all valid queries
  // and function assigned to validate it
  const validQuery = {
    id: () => isValidIdAndRange(queries),
    range: () => isValidIdAndRange(queries),
    types: () => isValidTypes(queries.types),
    ability: () => checkAbility(queries.ability),
    name: () => checkName(queries.name),
  };

  // If key does not exist in valid query object
  // or validation function returns false
  // short circuit and return false
  for (let query of keys) {
    if (!validQuery.hasOwnProperty(query) ||
      !validQuery[query]()) {
      return false;
    }
  };

  return true;
};

// Verifies the id and range is a number and
// between the valid number 1 - 807
const isValidIdAndRange = ({id, range}) => {
  const pokemonId = Number.parseInt(id);
  const numberOfPokemon = Number.parseInt(range);
  return !(
    numberOfPokemon < 1 ||
    pokemonId < 1 ||
    pokemonId > POKEMON.NUMBER_OF_POKEMON ||
    (pokemonId + numberOfPokemon - 1) > POKEMON.NUMBER_OF_POKEMON ||
    isNaN(pokemonId) ||
    isNaN(numberOfPokemon)
  );
};

// Verifies the type is a number and
// between 1 and 18
const isValidTypes = (types) => {
  for (let type of types.split(',')) {
    if (isNaN(type) || type < 1 || type > POKEMON.NUMBER_OF_TYPES) {
      return false;
    }
  };

  return true;
};

// Simple verification that the ability name is
// not empty
const checkAbility = (ability) => {
  return ability.length > 0;
};

// Simple verification that the pokemon name is
// not empty
const checkName = (name) => {
  return name.length > 0;
};

module.exports = router;
