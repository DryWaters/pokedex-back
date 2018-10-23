const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const database = require('../database/db');
const POKEMON = require('../constants/pokemonConstants');
const sql = require('../database/sql');

/* GET details on a specific pokemon
with endpoint of the base /pokemon/:id
Expected id is from 1 - 807

example to get details on 1st pokemon
/pokemon/1
example to get details on 20nd pokemon
/pokemon/20 */
router.get('/:id', (req, res, next) => {
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

  // valid pokemon ID, get detailed data
  database.db.any(sql.pokemonDetail.selectAllFormsAndEvolutions, pokemonId)
      .then((result) => {
        // Get all unique forms and evolutions for the particular pokemon
        const parsedIds = parseAllFormsAndEvolutions(result);

        // Create promises for all keys (mainId, forms, evolutions x3);
        Promise.all(Object.keys(parsedIds).map((key) => {
          switch (key) {
            case 'mainId': {
              return getMainPokemonDetails(parsedIds[key]);
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
            .catch((err) => {
              console.log('Unable to get pokemon data, oops');
              return res.status(404).json({
                'errorCode': 404,
                'error': 'Unable to get pokemon details data!',
                'errorMessage': err,
              });
            });
      });
});

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

// Process each form from given data
const parseFormDetails = (formsData) => {
  const forms = [];
  // console.log(formsData[0]);
  formsData.forEach((form) => {
    // console.log(form[0][0]);
    forms.push({
      id: form[0][0].pokemon_id,
      name: form[0][0].pokemon_name,
      types: processTypes(form[1]),
      weaknesses: form.weaknesses,
      abilities: processAbilities(form[2]),
      stats: {
        'hp': form[0][0].hp,
        'attack': form[0][0].attack,
        'defense': form[0][0].defense,
        'special-attack': form[0][0].special_attack,
        'special-defense': form[0][0].special_defense,
        'speed': form[0][0].speed,
      },
      image_path: `${POKEMON.SPRITE_PATH}large/${form[0][0].image_id}.png`,
    });
  });

  // Sort the final forms by ID to ensure order, then remove key
  // 'id' as it is not needed
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  forms.sort((a, b) => (a.id > b.id) ? 1 :
    ((b.id > a.id) ? -1 : 0));

  forms.forEach((form) => {
    delete form['id'];
  });

  return forms;
};

/* Parse the main pokemon information, data is expected to be in the format
below.

console.log(data[0][0]);
    main species data (pokemon_id, pokemon_name, p_desc, species, hp, attack,
    defense, special_attack, special_defense, speed, image_id) */
const parseMainDetails = (data) => {
  const mainDetails = {};
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

/* Parse the evolution data, data is expected to be in the format
below.

console.log(data[0][0]);
    Evolution (first - Main information : pokemon_id, name, image_id)
console.log(data[0][1]);
    Evolution (first - type information : Array [ name, slot ]) */
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

// Sorts the types by slot, then pushes just the name
// onto a types array that is assigned to form, or evolution data
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
// sorted by slot id
// The returned array is used on Forms data
const processAbilities = (abilityData) => {
  const abilities = [];

  // Sort the abilities by slot to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  abilityData.sort((a, b) => (a.slot > b.slot) ? 1 :
    ((b.slot > a.slot) ? -1 : 0));

  abilityData.forEach((ability) => {
    abilities.push({
      name: ability.name,
      hidden: ability.is_hidden,
    });
  });

  return abilities;
};

/* Fetch form details needed from database.
Pulls in forms, types, abilities, and
typeIds (Used by Weakenesses)
After data is pulled in, weaknesses are
calculated by using the type ids */
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

const getFormData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectForms, pokemonId);
};

/* Fetch evolution details needed from database.
Pulls in evolution data and types */
const getEvolutionDetails = (pokemonId) => {
  return Promise.all([getEvolutionData(pokemonId), getTypes(pokemonId)])
      .then((results) => {
        return results;
      });
};

const getEvolutionData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectEvolutions, pokemonId);
};

/* Fetch main pokemon details needed from database.
Pulls in main data, types, abilities, and
type ids (used for weakness calculations)

After data is pulled in, weaknesses are
calculated by using the type ids
*/
const getMainPokemonDetails = (pokemonId) => {
  let mainPokemonDetails = {};
  return Promise.all([getMainData(pokemonId), getTypes(pokemonId),
    getAbilities(pokemonId), getTypeIds(pokemonId)])
      .then((results) => {
        mainPokemonDetails = results;
        return getWeaknesses(results[3]);
      })
      .then((weaknesses) => {
        mainPokemonDetails.weaknesses = weaknesses;
        return mainPokemonDetails;
      });
};

const getMainData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectMainPokemon, pokemonId);
};

const getTypes = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectTypeNames, pokemonId);
};

const getAbilities = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectAbilities, pokemonId);
};

const getTypeIds = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectTypeIds, pokemonId);
};

const getWeaknesses = (types) => {
  let type1;
  let type2;
  const weakTypes = [];

  // Sort the types by slot to ensure order
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  types.sort((a, b) => (a.slot > b.slot) ? 1 :
    ((b.slot > a.slot) ? -1 : 0));

  // if does not have any additional forms, add type 0
  // (does not exit, needed for query)
  if (types.length === 1) {
    type1 = types[0].type_id;
    type2 = 0;
  } else {
    type1 = types[0].type_id;
    type2 = types[1].type_id;
  }
  return database.db.any(sql.pokemonDetail.selectWeaknesses, [type1, type2])
      .then((weaknesses) => {
        Object.keys(weaknesses[0]).forEach((col) => {
          if (weaknesses[0][col] > 1) {
            weakTypes.push({type: col, multiplier: weaknesses[0][col]});
          }
        });
        return weakTypes;
      });
};

// Fetches the unique pokemon IDs for main pokemon, its forms, and evolutions
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
