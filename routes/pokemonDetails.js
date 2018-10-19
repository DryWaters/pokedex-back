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
              return database.db.any(sql.pokemonDetail.selectForms, parsedIds[key]);
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
            .then((promiseResult) => {
              // console.log('Promise result 0 is ');
              // console.log(promiseResult[0]);
              // console.log('Promise result 1 is ');
              // console.log(promiseResult[1]);
              // console.log('Promise result 2 is ');
              // console.log(promiseResult[2]);
              // console.log('Promise result 3 is ');
              // console.log(promiseResult[3]);
              // console.log('Promise result 4 is ');
              // console.log(promiseResult[4]);
              return getWeaknesses(promiseResult);
            })
            .then((finalResult) => {
              // console.log(finalResult);

              return res.status(200).end('done');
            });
      });
});

const getWeaknesses = (forms) => {
  // if does not have any additional forms, add the weaknesses to main form
  new Promise((resolve, reject) => {
    if (forms[4].length === 0) {
      const types = getFormIds(forms[0]);
      console.log(types);
    } else {
      const types = [];
      forms[4].forEach((form) => {
        types.push(getFormIds(form));
      });
      console.log(types);
    }
    resolve();
  });
};

const getFormIds = (forms) => {
  const types = {
    type_1: 0,
    type_2: 0,
  };
  forms.forEach((row) => {
    if (row.slot !== null) {
      if (row.slot === 1 && types.type_1 === 0) {
        types.type_1 = row.type_id;
      } else {
        if (types.type_2 === 0) {
          types.type_2 = row.type_id;
        }
      }
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
