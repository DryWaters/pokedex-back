// File sql.js

const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

// Helper for linking to external query files:
const sql = (file) => {
  const fullPath = path.join(__dirname, file); // generating full path;
  return new QueryFile(fullPath, {minify: true});
};

module.exports = {
  pokemon: {
    dropTable: sql('tables/pokemon/dropTable.sql'),
    createTable: sql('tables/pokemon/createTable.sql'),
    selectAllWithRange: sql('pokemonAll/selectAllWithRange.sql'),
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
};
