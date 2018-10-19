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
  if ( isNaN(pokemonId) || pokemonId < 1 ||
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
        // Promise.all(Object.keys(result).map((key) => {
        //   return database.db.any()
        // })
        console.log(parseAllFormsAndEvolutions(result));

        // return res.status(200)
        //     .json({
        //       'noError': 'Valid id',
        //       'expected id': {
        //         'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
        //       },
        //     });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404)
            .json({
              'error': 'Invalid id',
              'expected id': {
                'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
              },
            });
      }
      );
});

const parseAllFormsAndEvolutions = (resultSet) => {
  const pokemonIds = {
    mainId: 0,
    forms: [],
    evolve_1: [],
    evolve_2: [],
    evolve_3: [],
  };

  resultSet.forEach((row, index) => {
    if (index === 0) {
      pokemonIds.mainId = row.pokemon_id;
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
