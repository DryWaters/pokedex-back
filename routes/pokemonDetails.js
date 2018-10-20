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

  database.db.any(sql.pokemonDetail.selectAllFormsAndEvolutions, pokemonId)
      .then((result) => {
      // Get all unique forms and evolutions for the particular pokemon
        const parsedIds = parseAllFormsAndEvolutions(result);

        // Promise for all keys (mainId, forms, evolutions);
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
            .then((allData) => {
              return parseData(allData);
            })
            .then((finalResult) => {
              return res.status(200).json(finalResult);
            });
      });
});

const parseData = (allData) => {
  const pokemonDetails = {
    forms: [],
    evolutions: {
      1: [],
      2: [],
      3: [],
    },
  };

  // get main pokemon details
  parseMainDetails(pokemonDetails, allData[0]);

  // get evolution1 details
  if (allData[1].length > 0) {
    pokemonDetails.evolutions[1] = parseEvolutionDetails(allData[1]);
  } else {
    pokemonDetails.evolutions[1] = null;
  }

  // get evolution2 details
  if (allData[2].length > 0) {
    pokemonDetails.evolutions[2] = parseEvolutionDetails(allData[2]);
  } else {
    pokemonDetails.evolutions[2] = null;
  }

  // get evolution3 details
  if (allData[3].length > 0) {
    pokemonDetails.evolutions[3] = parseEvolutionDetails(allData[3]);
  } else {
    pokemonDetails.evolutions[3] = null;
  }

  // if have no forms, get form data from main pokemon
  if (allData[4].length === 0) {

  }
  console.log(pokemonDetails);

  // console.log(pokemonDetails);


  // // Evolution 2 (first - Main information : pokemon_id, name, image_id)
  // console.log(allData[2][0][0]);
  // // Evolution 2 (first - type information : Array [ name, slot ])
  // console.log(allData[2][0][1]);

  // // // Evolution 2 (second - Main information : pokemon_id, name, image_id)
  // // console.log(allData[2][1][0]);
  // // // Evolution 2 (second - type information : Array [ name, slot ])
  // // console.log(allData[2][1][1]);

  // // Evolution 3 (first - Main information : pokemon_id, name, image_id)
  // console.log(allData[3][0][0]);
  // // Evolution 3 (first - type information : Array [ name, slot ])
  // console.log(allData[3][0][1]);

  // Forms 1 (weaknesses)
  // console.log(allData[4][0].weaknesses);
  // Forms 1 (first - main information : pokemon_id, name, image_id)
  // console.log(allData[4][0][0]);
  // Forms 1 (second - type information : Array [ name, slot ])
  // console.log(allData[4][0][1]);
  // Forms 1 (third - abilities [ { name, is_hidden } ]
  // console.log(allData[4][0][2]);
  // console.log(allData[4][0][3]);
};

// main species data (pokemon_id, pokemon_name, p_desc, species, hp, attack, defense, special_attack, special_defense, speed, image_id)
// console.log(data[0][0]);
// main species types ([ name: , slot])
// console.log(allData[1]);
// main species ability 1 ([ name: is_hidden ])
// console.log(allData[2]);
const parseMainDetails = (pokemonDetails, data) => {
  pokemonDetails.id = data[0][0].pokemon_id;
  pokemonDetails.name = data[0][0].pokemon_name;
  pokemonDetails.description = data[0][0].p_desc;
  pokemonDetails.species = data[0][0].species;
};

// // Evolution (first - Main information : pokemon_id, name, image_id)
// console.log(data[0][0]);
// // Evolution (first - type information : Array [ name, slot ])
// console.log(data[0][1]);
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
  return evolutionDetails;
};

const processTypes = (typeData) => {
  const types = [];

  if (typeData.length === 1) {
    types.push(typeData[0].name);
  } else if (typeData[0].slot === 1) {
    types.push(typeData[0].name);
    types.push(typeData[1].name);
  } else {
    types.push(typeData[1].name);
    types.push(typeData[0].name);
  }
  return types;
};

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

const getEvolutionDetails = (pokemonId) => {
  return Promise.all([getEvolutionData(pokemonId), getTypes(pokemonId)])
      .then((results) => {
        return results;
      });
};

const getEvolutionData = (pokemonId) => {
  return database.db.any(sql.pokemonDetail.selectEvolutions, pokemonId);
};

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
  // if does not have any additional forms, add the weaknesses to main form
  if (types.length === 1) {
    type1 = types[0].type_id;
    type2 = 0;
  } else {
    if (types[0].slot === 1) {
      type1 = types[0].type_id;
      type2 = types[1].type_id;
    } else {
      type1 = types[1].type_id;
      type2 = types[0].type_id;
    }
  }
  return database.db.any(sql.pokemonDetail.selectWeaknesses, [type1, type2])
      .then((weaknesses) => {
        Object.keys(weaknesses[0]).forEach((col) => {
          if (weaknesses[0][col] > 1) {
            weakTypes.push(col);
          }
        });
        return weakTypes;
      });
};

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
