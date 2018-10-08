const pgp = require('pg-promise')();
let db;

/* Change database connection based on either using local
 environment or using Heroku PostGres DB
 Heroku autocreates the DATABASE_URL environment
 variable when it runs */
if (process.env.LOCAL && process.env.LOCAL === 'TRUE') {
  connectionDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
  db = pgp(connectionDetails);
} else {
  db = pgp(process.env.DATABASE_URL + '?ssl=true');
}

const pokemonColumns = new pgp.helpers.ColumnSet([
  'pokemon_id',
  'name',
  'species_id',
  'image_id',
  'description',
], {table: 'pokemon'});

const typeColumns = new pgp.helpers.ColumnSet([
  'type_id',
  'name',
], {table: 'types'});

const pokemonTypeColumns = new pgp.helpers.ColumnSet([
  'pokemon_type_id',
  'type_id',
  'slot',
], {table: 'pokemon_types'});

module.exports = {
  db,
  pgp,
  pokemonColumns,
  typeColumns,
  pokemonTypeColumns,
};
