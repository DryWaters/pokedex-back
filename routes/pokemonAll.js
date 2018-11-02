/**
 * @fileoverview Router endpoint that searchs all Pokemon based
 * on the search criteria.
 */

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');
const sql = require('../database/sql');

/**
 * GET array of Pokemon from a search
 * with endpoint with base /pokemon
 *
 * Valid Search Params are:
 * id=(1-807)&range=(1-807)
 * name=(Not empty)
 * types=(1-18),[1-18] (2nd type is optional)
 * ability=(Not empty)
 *
 * @example
 * Get one pokemon
 * /pokemon?id=20&range=1
 * @example
 * Get 20 pokemon from 500-520
 * /pokemon?id=500&range=20
 * @example
 * Get range of pokemon with the name containing 'char'
 * /pokemon?id=20&range=50&name=char
 * @example
 * Get a range of pokemon from 10-20 with name containing 'bulb'
 * and normal and fire type and has ability containing 'over'
 * /pokemon?id=10&range=20&name=bulb&types=1,10&ability=over
 * */
router.get('/', (req, res) => {
  // Checks if valid search query
  // returns 404 if any fail
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

  // Get a list of Pokemon IDs that match search query
  return database.db.any(searchQuery)
      .then((result) => {
        return parseIds(result);
      })
      // If have some valid IDs => get their ID, name, and types
      .then((ids) => {
        if (ids.length !== 0) {
          return database.db.any(sql.pokemonAll.selectAllWithRange, {ids});
        }
      })
      // return parsed results
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
      });
});

/**
 * Strips off the Pokemon IDs from the query
 * @param {Object} ids Query return ex. { pokemon_id: 1 }
 * @return {Number[]} Array of Pokemon IDs
 */
const parseIds = (ids) => {
  return ids.map((id) => {
    return id.pokemon_id;
  });
};

/**
 * Takes all query params, and builds a SQL query that will pull the
 * requested data the user is looking for.
 *
 * hasRangeSearch attribute is to know if should append default range
 * search of 1 - 807 (as to not search alternate forms)
 *
 * *NOTE*
 * query params have already been validated.
 *
 * Common query parts are
 * 'SELECT p.pokemon_id FROM pokemon p ORDER BY p.pokemon_id'
 *
 * @param {Object} query Query params from search ex. { name: 'bulb', type=1,2 }
 * @return {String} constructoQuery() Final constructed query
 */
const buildQuery = (query) => {
  // Object that contains Strings that represent
  // query pieces.
  const queryParams = {
    select: ['SELECT p.pokemon_id'],
    tables: ['pokemon p'],
    joins: [],
    where: [],
    order: ['ORDER BY p.pokemon_id'],
    hasRangeSearch: false,
  };

  // Call builder function for each search param
  const queryBuilder = {
    id: () => buildIdAndRange(queryParams, query),
    name: () => buildPokemonName(queryParams, query),
    types: () => buildPokemonTypes(queryParams, query),
    ability: () => buildPokemonAbilities(queryParams, query),
  };

  // skips over 'range' because already built with
  // id key (ID and RANGE are required to be together)
  Object.keys(query).forEach((param) => {
    if (param !== 'range') {
      queryBuilder[param]();
    }
  });

  // Return the final constructed String that contains the build
  // SQL Select query
  return constructQuery(queryParams);
};

/**
 * Function that builds the SQL statement based on the needed
 * tables, joins, and where clauses
 *
 * @param {Object} queryParams Contains needed tables, where, joins for query
 * @return {String} constructed SQL Select statement
 */
const constructQuery = (queryParams) => {
  let query = queryParams.select + ' FROM ';

  // Attach which tables are needed
  query += queryParams.tables.join(', ');

  // Attach which JOINs are needed
  query += queryParams.joins.map((clause) => {
    return ` JOIN ${clause}`;
  }).join('');

  // Attach which WHERE clauses are needed
  query += queryParams.where.map((clause, index) => {
    if (index === 0) {
      return ` WHERE ${clause}`;
    } else {
      return ` AND ${clause}`;
    }
  }).join('');

  // if user has not supplied a range, then attach
  // default range of 1-807
  if (!queryParams.hasRangeSearch) {
    query += ' AND p.pokemon_id >= 1 AND p.pokemon_id <= ' +
      POKEMON.NUMBER_OF_POKEMON;
  }

  // Append the ORDER BY
  query += ' ' + queryParams.order + ';';

  return query;
};

/**
 * 1. Attaches the needed range for the search by range
 * 2. Sets the flag that there is a user initiated range search
 * to not attach the default range of 1-807
 *
 * @param {Object} queryParams Contains all needed tabls, where, joins
 * @param {String} id deconstructes id { id: '1', range: '20'}
 * @param {String} range deconstructs range { id: '1', range: '20'}
 */
const buildIdAndRange = (queryParams, {id, range}) => {
  queryParams.where.push(`p.pokemon_id >= ${id}`);
  queryParams.where.push('p.pokemon_id <= ' +
    (Number.parseInt(id) + Number.parseInt(range) - 1));
  queryParams.hasRangeSearch = true;
};

/**
 * Attaches the needed LIKE statement for the search by name
 * Converts both the table data and searched term to lowercase to avoid
 * case sensitivity.
 *
 * @param {Object} queryParams Contains all needed tabls, where, joins
 * @param {String} name deconstructs name { name: 'bulb' }
 */
const buildPokemonName = (queryParams, {name}) => {
  queryParams.where.push(
      `LOWER(p.name) LIKE '%${name.toLowerCase()}%'`);
};

/**
 * Attaches the needed where statement for the search by type
 * If there are multiple type searches then they are all combined into
 * one WHERE statement.
 *
 * @example
 * For single type search
 * (pt.type_id = 1)
 * For multiple type searches
 * (pt.type_id = 1 AND pt.type_id = 2)
 *
 * @param {Object} queryParams Contains all needed tabls, where, joins
 * @param {String} types deconstructs types.  Ex. { types: '1,2' }
 */
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

/**
 * Attaches the needed LIKE statement for the search by ability name
 * Converts both the table data and searched term to lowercase to avoid
 * case sensitivity.
 *
 * @param {Object} queryParams Contains all needed tabls, where, joins
 * @param {String} ability deconstructs ability { ability: 'over' }
 */
const buildPokemonAbilities = (queryParams, {ability}) => {
  queryParams.where.push(`LOWER(a.name) LIKE '%${ability.toLowerCase()}%'`);
  queryParams.joins.push(`pokemon_abils pa ON p.pokemon_id = pa.pokemon_id`);
  queryParams.joins.push(`abilities a ON pa.ability_id = a.abil_id`);
};


/**
 * Removes duplicate rows for Pokemon that have multiple types
 * per pokemon
 *
 * @example
 * Bulbasaur
 * [
 *  { id: 1, name: 'Bulbasaur', image_id: 1, types_name: 'grass' },
 *  { id: 1, name: 'Bulbasaur', image_id: 1, types_name: 'poison' },
 * ]
 *
 * @param {Object[]} result Contains each row of returned data
 * @return {Object} Returns the parsed Pokemon data
 */
const parsePokemonResults = (result) => {
  const pokemon = [];

  // If have no returned search results, just return empty array []
  if (!result) {
    return {pokemon};
  }

  // Take each row and check if final Pokemon result already contains
  // Pokemon data.
  // If not => Append Pokemon to final array
  // If does => Append Type data to that Pokemon
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

  // return parsed array appended to the object key "pokemon"
  return {pokemon};
};

/**
 * Validates each search term before processing search
 *
 * @param {Object} queries All search terms from Express endpoint
 * @return {Boolean} True => Valid, False => At least one term fails check
 */
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


/**
 * Verifies Id and Range fall into valid Pokemon range
 * 1 - 807
 * @param {String} id Starting Pokemon ID
 * @param {String} range Number of Pokemon to return
 * @return {Boolean} True => Valid/ False => Invalid search
 */
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

/**
 * Verifies Types fall into valid Type Range 1 - 18
 * Query is a single String that must be split
 * @example
 * types=1,2
 *
 * @param {String} types Comma seperated String of types
 * @return {Boolean} True => Valid/ False => Invalid search
 */
const isValidTypes = (types) => {
  for (let type of types.split(',')) {
    if (isNaN(type) || type < 1 || type > POKEMON.NUMBER_OF_TYPES) {
      return false;
    }
  };

  return true;
};

/**
 * Verifies that ability name is not empty.
 *
 * @param {String} ability Search term for ability
 * @return {Boolean} True => Valid/ False => Invalid search
 */
const checkAbility = (ability) => {
  return ability.length > 0;
};

/**
 * Verifies that name is not empty.
 *
 * @param {String} name Search term for name
 * @return {Boolean} True => Valid/ False => Invalid search
 */
const checkName = (name) => {
  return name.length > 0;
};

module.exports = router;
