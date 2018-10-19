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
              return database.db.any(sql.pokemonDetail.selectMainPokemon, parsedIds[key]);
            }
            case 'forms': {
              return Promise.all(parsedIds[key].map(((formId) => {
                return database.db.any(sql.pokemonDetail.selectForms, formId);
              })));
            }
            case 'evolve_1': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return database.db.any(sql.pokemonDetail.selectEvolutions, evolveId);
              })));
            }
            case 'evolve_2': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return database.db.any(sql.pokemonDetail.selectEvolutions, evolveId);
              })));
            }
            case 'evolve_3': {
              return Promise.all(parsedIds[key].map(((evolveId) => {
                return database.db.any(sql.pokemonDetail.selectEvolutions, evolveId);
              })));
            }
          }
        }))
            .then((formsAndEvolutions) => {
              return getWeaknesses(formsAndEvolutions);
            })
            .then((finalResult) => {
              return res.status(200).json(finalResult);
            });
      });
});

const getWeaknesses = (formsAndEvolutions) => {
  // if does not have any additional forms, add the weaknesses to main form
  if (formsAndEvolutions[4].length === 0) {
    const types = getFormIds(formsAndEvolutions[0]);
    return database.db.any(sql.pokemonDetail.selectWeaknesses, [types.type_1, types.type_2])
        .then((weaknesses) => {
          formsAndEvolutions[0].weaknesses = [];
          Object.keys(weaknesses[0]).forEach((col) => {
            if (weaknesses[0][col] > 1) {
              formsAndEvolutions[0].weaknesses.push(col);
            }
          });
          return processFinalPokemonDetailsNoForms(formsAndEvolutions);
        });
  } else {
    const types = [];
    formsAndEvolutions[4].forEach((form) => {
      types.push(getFormIds(form));
    });
    return Promise.all(types.map((pokemonTypes) => {
      return database.db.any(sql.pokemonDetail.selectWeaknesses, [pokemonTypes.type_1, pokemonTypes.type_2]);
    }))
        .then((weaknesses) => {
          formsAndEvolutions[4].forEach((form, index) => {
            form.weaknesses = [];

            Object.keys(weaknesses[index][0]).forEach((col) => {
              if (weaknesses[index][0][col] > 1) {
                form.weaknesses.push(col);
              }
            });
          });
          return processFinalPokemonDetailsWithForms(formsAndEvolutions);
        });
  }
};

const processFinalPokemonDetailsWithForms = (forms) => {
  let pokemonDetails;

  pokemonDetails = {
    id: forms[0][0].pokemon_id,
    name: forms[0][0].pokemon_name,
    description: forms[0][0].p_desc,
    species: forms[0][0].species,
    forms: [],
    evolutions: forms[1].length > 0 ? processEvolutions(forms) : null,
  };

  // forms[4].forEach((form) => {
  pokemonDetails.forms.push(processPokemonForm(forms[4][0]));
  // });

  return pokemonDetails;
};

const processPokemonForm = (formData) => {
  const form = {
    name: formData.pokemon_name,
    types: [formData.type_name],
    weaknesses: formData.weaknesses,
    abilities: [{
      name: formData.ability_name,
      hidden: formData.is_hidden,
    }],
    stats: {
      'hp': formData.hp,
      'attack': formData.attack,
      'defense': formData.defense,
      'special-attack': formData.special_attack,
      'special-defense': formData.special_defense,
      'speed': formData.speed,
    },
    image_path: `${POKEMON.SPRITE_PATH}large/${formData.image_id}.png`,
  };

  formData.forEach((row, index) => {
    if (index > 0 && !form.types.includes(row.type_name)) {
      form.types.push(row.type_name);
    }

    if (index > 0 && !hasAbility(form.abilities, row.ability_name)) {
      form.abilities.push({name: row.ability_name, hidden: row.is_hidden});
    }
  });
  return form;
};

const processFinalPokemonDetailsNoForms = (forms) => {
  let pokemonDetails;

  pokemonDetails = {
    id: forms[0][0].pokemon_id,
    name: forms[0][0].pokemon_name,
    description: forms[0][0].p_desc,
    species: forms[0][0].species,
    forms: processMainPokemonForm(forms[0]),
    evolutions: forms[1].length > 0 ? processEvolutions(forms) : null,
  };

  return pokemonDetails;
};

const processEvolutions = (formData) => {
  const evolutions = {
    '1': formData[1].length > 0 ? processEvolution(formData[1]) : null,
    '2': formData[2].length > 0 ? processEvolution(formData[2]) : null,
    '3': formData[3].length > 0 ? processEvolution(formData[3]) : null,
  };
  return evolutions;
};

const processEvolution = (evolutionData) => {
  const evolutions = [];
  evolutionData.forEach((row) => {
    addPokemon(evolutions, row);
  });
  sortEvolutions(evolutions);
  return evolutions;
};

// Sort in place array of objects
// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
const sortEvolutions = (evolutions) => {
  evolutions.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
};

const addPokemon = (evolutions, pokemons) => {
  const pokemonEvolution = {
    id: pokemons[0].pokemon_id,
    name: pokemons[0].name,
    types: [pokemons[0].type_name],
    image_path: `${POKEMON.SPRITE_PATH}small/${pokemons[0].image_id}.png`,
  };
  pokemons.forEach((pokemon) => {
    if (!pokemonEvolution.types.includes(pokemon.type_name)) {
      pokemonEvolution.types.push(pokemon.type_name);
    }
  });
  evolutions.push(pokemonEvolution);
};

const processMainPokemonForm = (formData) => {
  const form = {
    name: formData[0].pokemon_name,
    types: [formData[0].type_name],
    weaknesses: formData.weaknesses,
    abilities: [{
      name: formData[0].ability_name,
      hidden: formData[0].is_hidden,
    }],
    stats: {
      'hp': formData[0].hp,
      'attack': formData[0].attack,
      'defense': formData[0].defense,
      'special-attack': formData[0].special_attack,
      'special-defense': formData[0].special_defense,
      'speed': formData[0].speed,
    },
    image_path: `${POKEMON.SPRITE_PATH}large/${formData[0].image_id}.png`,
  };

  formData.forEach((row, index) => {
    if (index > 0 && !form.types.includes(row.type_name)) {
      form.types.push(row.type_name);
    }

    if (index > 0 && !hasAbility(form.abilities, row.ability_name)) {
      form.abilities.push({name: row.ability_name, hidden: row.is_hidden});
    }
  });
  return form;
};

const hasAbility = (abilities, abilName) => {
  for (let abil of abilities) {
    if (abil.name == abilName) {
      return true;
    }
  }
  return false;
};

const getFormIds = (forms) => {
  const types = {
    type_1: 0,
    type_2: 0,
  };
  forms.forEach((row) => {
    if (row.slot === 1 && types.type_1 === 0) {
      types.type_1 = row.type_id;
    } else if (row.slot === 2 && types.type_2 === 0) {
      types.type_2 = row.type_id;
    }
  });
  return types;
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
