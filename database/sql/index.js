// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

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
  images: {
    dropTable: sql('images/dropTable.sql'),
    createTable: sql('images/createTable.sql'),
  },

  // // external queries for Users:
  // users: {
  //   add: sql('users/create.sql'),
  //   search: sql('users/search.sql'),
  //   report: sql('users/report.sql'),
  // },
  // // external queries for Products:
  // products: {
  //   add: sql('products/add.sql'),
  //   quote: sql('products/quote.sql'),
  //   search: sql('products/search.sql'),
  // },
};
