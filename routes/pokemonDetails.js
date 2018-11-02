/**
 * @fileoverview Router endpoint that searchs for details about
 * a specific Pokemon id
 */

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');
const sql = require('../database/sql');


/**
 * GET details on a specific Pokemon
 * with endpoint with base /pokemon
 *
 * The details are fetched with individual Promises for each detail
 * ex. MainDetails, Forms, Evolutions
 * then combined into a single returned object
 *
 * Valid Id Params are:
 * /(1-807)
 *
 * @example
 * Get details on Bulbasaur
 * /pokemon/1
 * */
router.get('/:id', (req, res) => {
  const pokemonId = parseInt(req.params.id);
  if (isNaN(pokemonId) || pokemonId < 1 ||
    pokemonId > POKEMON.NUMBER_OF_POKEMON
  ) {
    return res.status(404)
        .json({
          'error': 'Invalid id',
          'expected id': {
            'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
          },
        });
  }

  // Have a valid pokemon ID, get detailed data
  database.db.any(sql.pokemonDetail.selectAllFormsAndEvolutions, {pokemonId})
      .then((result) => {
      // Get all unique forms and evolutions for the particular pokemon
        const parsedIds = parseAllFormsAndEvolutions(result);

        // Create promises for all keys (mainId, forms, evolutions x3);
        Promise.all(Object.keys(parsedIds).map((key) => {
          switch (key) {
            case 'mainId': {
              return getMainPokemonDetails(parsedIds[key][0]);
            }
            case 'forms': {
              return Promise.all(parsedIds[key].map(((formId) => {
                return getFormDetails(formId);
              })));
            }
            case 'evolve_1': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return getEvolutionDetails(evolveId);
              })));
            }
            case 'evolve_2': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return getEvolutionDetails(evolveId);
              })));
            }
            case 'evolve_3': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return getEvolutionDetails(evolveId);
              })));
            }
          }
        }))
            // Done getting data, now parse the data to expected return
            .then((allData) => {
              return parseData(allData);
            })
            // All good!  Return results!
            .then((finalResult) => {
              return res.status(200).json(finalResult);
            })
            // failed when trying to get individual
            // details either main id, forms, or evolutions
            .catch((err) => {
              console.error('Unable to get pokemon data, oops with error: '
            + err);
              return res.status(404).json({
                'errorCode': 404,
                'error': 'Unable to get pokemon details data!',
                'errorMessage': err,
              });
            });
      })
      // failed when trying to get main id, forms, and evolutions ids.
      .catch((err) => {
        console.error('Unable to get pokemon data, oops with error: '
        + err);
        return res.status(404).json({
          'errorCode': 404,
          'error': 'Unable to get pokemon details data!',
          'errorMessage': err,
        });
      });
});

/**
 * Parses all the Promise data that is returned from each part of the
 * Pokemon detail. Promise.all returns each individual promise into
 * an array.
 *
 * If a Pokemon does not contain an evolution or forms, then the array will
 * be [] for that location
 *
 * If a Pokemon does not contain alternate forms, then their main form
 * is used to build the { forms: [] } key
 *
 * @example
 * allData[0] = Promise result with main details (id, name, stats, etc...)
 * allData[1] = Promise result with 1st evolution (id, name, image_id)
 * allData[2] = Promise result with 2nd evolution (id, name, image_id)
 * allData[3] = Promise result with 3rd evolution (id, name, image_id)
 * allData[4] = Promise result with alternate forms (id, name, stats, etc...)
 *
 * @param {Object[]} allData Combined data from all promise returns
 * @return {Object} expected parsed Pokemon details data
 */
const parseData = (allData) => {
  // get main pokemon details
  const pokemonDetails = parseMainDetails(allData[0]);

  // get evolution_1 details, if available
  if (allData[1].length > 0) {
    pokemonDetails.evolutions[1] = parseEvolutionDetails(allData[1]);
  } else {
    pokemonDetails.evolutions[1] = null;
  }

  // get evolution2 details, if available
  if (allData[2].length > 0) {
    pokemonDetails.evolutions[2] = parseEvolutionDetails(allData[2]);
  } else {
    pokemonDetails.evolutions[2] = null;
  }

  // get evolution3 details, if available
  if (allData[3].length > 0) {
    pokemonDetails.evolutions[3] = parseEvolutionDetails(allData[3]);
  } else {
    pokemonDetails.evolutions[3] = null;
  }

  // if have no forms, get only form data from main pokemon information
  if (allData[4].length === 0) {
    pokemonDetails.forms = parseFormDetails([allData[0]]);
  } else {
    pokemonDetails.forms = parseFormDetails(allData[4]);
  }

  return pokemonDetails;
};

/**
 * Parses the forms data for each Pokemon.  If a Pokemon does not contain
 * alternate forms, then this data is parsed from their "Main" form.
 *
 * A Pokemon can have multiple forms, therefore formsData is an array of
 * ATLEAST a length of 1.
 *
 * Forms do not need Pokemon Id, but Id is captured to ensure order of forms
 *
 * @example
 * formsData[0-range][0][0] = Main details (id, name, image_id)
 * formsData[0-range][1] = Array of Objects containing type data (type_id, slot)
 * formsData[0-range][2] = Array of Objects containing abilities data
 *                (name, short_effect, slot, is_hidden)
 * formsData[0-range].weaknesses = Array of Objects containing weaknesses data
 *                        (type, multiplier )
 *
 * @param {Object[]} formsData Alternate forms data
 * @return {Object[]} expected parsed forms key
 */
const parseFormDetails = (formsData) => {
  const forms = [];
  formsData.forEach((form) => {
    forms.push({
      id: form[0][0].pokemon_id,
      name: form[0][0].pokemon_name,
      types: processTypes(form[1]),
      weaknesses: form.weaknesses,
      abilities: processAbilities(form[2]),
      stats: processStats(form[0][0]),
      image_path: `${POKEMON.SPRITE_PATH}large/${form[0][0].image_id}.png`,
    });
  });

  // Sort the final forms by ID to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  forms.sort((a, b) => (a.id > b.id) ? 1 :
    ((b.id > a.id) ? -1 : 0));

  // Alternate forms does not need an ID, so delete
  // It is only used for sorting to ensure order.
  forms.forEach((form) => {
    delete form['id'];
  });

  return forms;
};

/**
 * Processes data to ensure that the stats always returned in
 * the same order, used for stat graph
 *
 * hp, attack, defense, special-attack, special-defense
 *
 * @param {Object} data Contains all stats
 * @return {Object} parsed stats
 */
const processStats = (data) => {
  const stats = {
    'hp': data.hp,
    'attack': data.attack,
    'defense': data.defense,
    'special-attack': data.special_attack,
    'special-defense': data.special_defense,
    'speed': data.speed,
  };

  return stats;
};

/**
 * 1. Attaches the next, and previous key
 * 2. Also parses the main data for each Pokemon.
 * 3. Makes placeholder keys for evolutions and forms that
 *    will be added later.
 *
 * Previous and Next data can be null if on ends of Pokemon list
 * @example
 * /pokemon/1 would return null for previous because
 * Pokemon #0 does not exist.
 * It attaches the last Pokemon information to wrap the
 * list around itself
 *
 * 807 < - > 1
 *
 * @example
 * data[0][0] = Contains main details
 *    (pokemon_id, pokemon_name, p_desc, species, hp, attack, defense,
 *    special_attack, special_defense, speed, image_id)
 * data[4] = Previous pokemon data (id, name)
 * data[5] = Next pokemon data (id, name)
 *
 * @param {Object[]} data Main data
 * @return {Object[]} expected parsed main object
 */
const parseMainDetails = (data) => {
  const mainDetails = {};

  // If has a previous pokemon
  // data[4] == previous
  if (data[4].length !== 0) {
    mainDetails.previous = {
      id: data[4][0].pokemon_id,
      name: data[4][0].pokemon_name,
    };
  } else {
    mainDetails.previous = {
      id: 807,
      name: 'Zeraora',
    };
  }

  // If has a next pokemon
  // data[5] == next
  if (data[5].length !== 0) {
    mainDetails.next = {
      id: data[5][0].pokemon_id,
      name: data[5][0].pokemon_name,
    };
  } else {
    mainDetails.next = {
      id: 1,
      name: 'Bulbasaur',
    };
  }
  mainDetails.id = data[0][0].pokemon_id;
  mainDetails.name = data[0][0].pokemon_name;
  mainDetails.description = data[0][0].p_desc;
  mainDetails.species = data[0][0].species;
  mainDetails.forms = [];
  mainDetails.evolutions = {
    1: [],
    2: [],
    3: [],
  };
  return mainDetails;
};

/**
 * Parses the evolution data.  Each evolution step for a Pokemon
 * can have multiple ids.
 *
 * @example
 * data[0-range][0][0] = Contains main evolution details
 *    (id, name, image_path)
 * data[0-range][1] = Type data for specific Pokemon ID
 *                    ex. { name: 'fire', slot: 1 }
 *
 * @param {Object[]} data Evolution 1 - 3 data
 * @return {Object[]} expected parsed evolution object
 */
const parseEvolutionDetails = (data) => {
  const evolutionDetails = [];

  data.forEach((evolution) => {
    evolutionDetails.push({
      id: evolution[0][0].pokemon_id,
      name: evolution[0][0].name,
      types: processTypes(evolution[1]),
      image_path: `${POKEMON.SPRITE_PATH}small/${evolution[0][0].image_id}.png`,
    });
  });

  // Sort the final evolutions by ID to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  evolutionDetails.sort((a, b) => (a.id > b.id) ? 1 :
    ((b.id > a.id) ? -1 : 0));

  return evolutionDetails;
};

/**
 * Sorts the types by slot to ensure order, then pushes the name
 * onto the parsed type data.  'slot' is only used for order.
 *
 * @param {Object[]} typeData type data, ex. { name: 'fire', slot: 1 }
 * @return {String[]} expected array list of type names
 */
const processTypes = (typeData) => {
  const types = [];

  // Sort the types by slot to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  typeData.sort((a, b) => (a.slot > b.slot) ? 1 :
    ((b.slot > a.slot) ? -1 : 0));

  typeData.forEach((type) => {
    types.push(type.name);
  });

  return types;
};

// Sorts the abilites by slot, then pushes the name and if
// ability is hidden onto ability array.  Order is ensured by
// sorting by slot id
// The returned array is used on Forms data

/**
 * Sorts the abilities by slot to ensure order, then pushes the name,
 * short effect description, and if it is hidden.
 *
 * 'slot' is only used for sorting
 *
 * @param {Object[]} abilityData type data
 *  ex. { name: 'Overgrowth', slot: 1, is_hidden: false, short_effect: 'blah' }
 * @return {Object[]} expected list of abilities { name, description, hidden }
 */
const processAbilities = (abilityData) => {
  const abilities = [];

  // Sort the abilities by slot to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  abilityData.sort((a, b) => (a.slot > b.slot) ? 1 :
    ((b.slot > a.slot) ? -1 : 0));

  abilityData.forEach((ability) => {
    abilities.push({
      name: ability.name,
      description: ability.short_effect,
      hidden: ability.is_hidden,
    });
  });

  return abilities;
};

/**
 * Fetches the form details needed by using sub-queries
 * Pulls in forms, types, abilities, and typeIds (used for weaknesses)
 *
 * After all data is pulled in, weaknesses are calculated by using
 * the returned type ids.
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object} aggregated data needed for Pokemon forms
 */
const getFormDetails = (pokemonId) => {
  let formDetails = {};
  return Promise.all([getFormData(pokemonId), getTypes(pokemonId),
    getAbilities(pokemonId), getTypeIds(pokemonId)])
      .then((results) => {
        formDetails = results;
        return getWeaknesses(results[3]);
      })
      .then((weaknesses) => {
        formDetails.weaknesses = weaknesses;
        return formDetails;
      });
};

/**
 * Pulls form information including:
 * pokemon_id, p.name AS pokemon_name, p.hp, p.attack, p.defense,
 * p.special_attack, p.special_defense, p.speed, p.image_id
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getFormData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectForms, {pokemonId});
};

/**
 * Fetches the evolution details needed by using sub-queries
 * Pulls in evolution data and types
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object} aggregated data needed for Pokemon evolution
 */
const getEvolutionDetails = (pokemonId) => {
  return Promise.all([getEvolutionData(pokemonId), getTypes(pokemonId)])
      .then((results) => {
        return results;
      });
};

/**
 * Pulls evolution information including:
 * p.pokemon_id, p.name, p.image_id
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getEvolutionData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectEvolutions, {pokemonId});
};

/**
 * Fetches the main details needed by using sub-queries
 * Pulls in main data, types, abilities, type ids (for weaknesses),
 * and navigation results (previous, next)
 *
 * After all data is pulled in, weaknesses are calculated by using
 * the returned type ids.
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object} aggregated data needed for Pokemon main details
 */
const getMainPokemonDetails = (pokemonId) => {
  let mainPokemonDetails = {};

  return Promise.all([getMainData(pokemonId), getTypes(pokemonId),
    getAbilities(pokemonId), getTypeIds(pokemonId),
    getNavigation(pokemonId - 1), getNavigation(pokemonId + 1)])
      .then((results) => {
        mainPokemonDetails = results;
        return getWeaknesses(results[3]);
      })
      .then((weaknesses) => {
        mainPokemonDetails.weaknesses = weaknesses;
        return mainPokemonDetails;
      });
};

/**
 * Pulls main information including:
 * p.pokemon_id, p.name AS pokemon_name, d.p_desc, s.species,
 * p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed,
 * p.image_id
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getMainData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectMainPokemon, {pokemonId});
};

/**
 * Pulls type information including:
 * name, slot
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getTypes = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectTypeNames, {pokemonId});
};

/**
 * Pulls abilities information including:
 * name, short_effect, slot, is_hidden
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getAbilities = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectAbilities, {pokemonId});
};

/**
 * Pulls type_ids information used to calculate weaknesses, including:
 * type_id, slot
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getTypeIds = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectTypeIds, {pokemonId});
};

/**
 * Pulls navigation information (just id and name from id), including:
 * p.pokemon_id, p.name AS pokemon_name
 *
 * @param {Number} pokemonId Pokemon ID to gather data for
 * @return {Object[]} query result for a Pokemon
 */
const getNavigation = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectNavigation, {pokemonId});
};


/**
 * Pulls weakness information including:
 * normal,fire,water,electric,grass,ice,fighting,poison,
 * ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy
 *
 * @param {Object[]} types List of type ids
 * @return {Object[]} parsed weaknesses that includes name and multiplier
 */
const getWeaknesses = (types) => {
  let type1;
  let type2;
  const weakTypes = [];

  // Sort the types by slot to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  types.sort((a, b) => (a.slot > b.slot) ? 1 :
    ((b.slot > a.slot) ? -1 : 0));

  // if does not have two types, add type 0 for type_2
  // (needed for query)
  if (types.length === 1) {
    type1 = types[0].type_id;
    type2 = 0;
  } else {
    type1 = types[0].type_id;
    type2 = types[1].type_id;
  }
  return database.db.any(sql.pokemonDetail.selectWeaknesses, {type1, type2})
      .then((weaknesses) => {
        Object.keys(weaknesses[0]).forEach((col) => {
          if (weaknesses[0][col] > 1) {
            weakTypes.push({type: col, multiplier: weaknesses[0][col]});
          }
        });
        return weakTypes;
      });
};

/**
 * Creates an object that contains all unique ids for all facets of
 * the Pokemon including:
 * their main id, evolution ids, alternate form ids
 *
 * @param {Object[]} resultSet All specie id matches
 *  includes alternate and evolutions
 * @return {Object[]} Pokemon ID object with unique ids
 */
const parseAllFormsAndEvolutions = (resultSet) => {
  const pokemonIds = {
    mainId: [],
    evolve_1: [],
    evolve_2: [],
    evolve_3: [],
    forms: [],
  };

  resultSet.forEach((row, index) => {
    if (index === 0) {
      pokemonIds.mainId.push(row.pokemon_id);
    }

    if (row.evolve_1 !== null && !pokemonIds.evolve_1.includes(row.evolve_1)) {
      pokemonIds.evolve_1.push(row.evolve_1);
    }

    if (row.evolve_2 !== null && !pokemonIds.evolve_2.includes(row.evolve_2)) {
      pokemonIds.evolve_2.push(row.evolve_2);
    }

    if (row.evolve_3 !== null && !pokemonIds.evolve_3.includes(row.evolve_3)) {
      pokemonIds.evolve_3.push(row.evolve_3);
    }

    if (row.pokemon_id > POKEMON.NUMBER_OF_POKEMON &&
      !pokemonIds.forms.includes(row.pokemon_id)) {
      pokemonIds.forms.push(row.pokemon_id);
    }
  });
  return pokemonIds;
};

module.exports = router;
