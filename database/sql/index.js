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
    dropTable: sql('pokemon/dropTable.sql'),
    createTable: sql('pokemon/createTable.sql'),
    selectAllWithRange: sql('pokemon/selectAllWithRange.sql'),
  },
  pokemonTypes: {
    dropTable: sql('pokemonTypes/dropTable.sql'),
    createTable: sql('pokemonTypes/createTable.sql'),
  },
  types: {
    dropTable: sql('types/dropTable.sql'),
    createTable: sql('types/createTable.sql'),
  },
  pokemonDesc: {
    dropTable: sql('pokemonDesc/dropTable.sql'),
    createTable: sql('pokemonDesc/createTable.sql'),
  },
  evolutions: {
    dropTable: sql('evolutions/dropTable.sql'),
    createTable: sql('evolutions/createTable.sql'),
  },
  abilities: {
    dropTable: sql('abilities/dropTable.sql'),
    createTable: sql('abilities/createTable.sql'),
  },
  species: {
    dropTable: sql('species/dropTable.sql'),
    createTable: sql('species/createTable.sql'),
  },
  damageStats: {
    dropTable: sql('damageStats/dropTable.sql'),
    createTable: sql('damageStats/createTable.sql'),
  },
};
