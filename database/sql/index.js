/**
 * @fileoverview SQL QueryFile helper that loads all
 * external SQL files and exports them as objects
 */

const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

/**
 * Helper function to create a QueryFile object from a given
 * path and SQL file location.
 * More examples of QueryFiles are at:
 * https://github.com/vitaly-t/pg-promise-demo/blob/master/JavaScript/db/sql/index.js
 * @param {String} file The filename that contains the sql
 * @return {Object} QueryFile that PGPromise uses to run queries
 */
const sql = (file) => {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, {minify: true});
};

module.exports = {
  pokemon: {
    dropTable: sql('tables/pokemon/dropTable.sql'),
    createTable: sql('tables/pokemon/createTable.sql'),
  },
  pokemonTypes: {
    dropTable: sql('tables/pokemonTypes/dropTable.sql'),
    createTable: sql('tables/pokemonTypes/createTable.sql'),
  },
  types: {
    dropTable: sql('tables/types/dropTable.sql'),
    createTable: sql('tables/types/createTable.sql'),
  },
  pokemonDesc: {
    dropTable: sql('tables/pokemonDesc/dropTable.sql'),
    createTable: sql('tables/pokemonDesc/createTable.sql'),
  },
  evolutions: {
    dropTable: sql('tables/evolutions/dropTable.sql'),
    createTable: sql('tables/evolutions/createTable.sql'),
  },
  abilities: {
    dropTable: sql('tables/abilities/dropTable.sql'),
    createTable: sql('tables/abilities/createTable.sql'),
  },
  species: {
    dropTable: sql('tables/species/dropTable.sql'),
    createTable: sql('tables/species/createTable.sql'),
  },
  damageStats: {
    dropTable: sql('tables/damageStats/dropTable.sql'),
    createTable: sql('tables/damageStats/createTable.sql'),
  },
  pokemonAbils: {
    dropTable: sql('tables/pokemonAbils/dropTable.sql'),
    createTable: sql('tables/pokemonAbils/createTable.sql'),
  },
  pokemonAll: {
    selectAllWithRange: sql('pokemonAll/selectAllWithRange.sql'),
  },
  pokemonDetail: {
    selectAllFormsAndEvolutions:
      sql('pokemonDetail/selectAllFormsAndEvolutions.sql'),
    selectEvolutions: sql('pokemonDetail/selectEvolutions.sql'),
    selectMainPokemon: sql('pokemonDetail/selectMainPokemon.sql'),
    selectForms: sql('pokemonDetail/selectForms.sql'),
    selectWeaknesses: sql('pokemonDetail/selectWeaknesses.sql'),
    selectTypeIds: sql('pokemonDetail/selectTypeIds.sql'),
    selectTypeNames: sql('pokemonDetail/selectTypeNames.sql'),
    selectAbilities: sql('pokemonDetail/selectAbilities.sql'),
    selectNavigation: sql('pokemonDetail/selectNavigation.sql'),
  },
};
