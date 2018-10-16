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
  'evol_id',
  'hp',
  'attack',
  'defense',
  'special_attack',
  'special_defense',
  'speed',
], {table: 'pokemon'});

const typeColumns = new pgp.helpers.ColumnSet([
  'type_id',
  'name',
], {table: 'types'});

const evolutionColumns = new pgp.helpers.ColumnSet([
  'evolution_id',
  'evolve_1',
  'evolve_2',
  'evolve_3',
], {table: 'evolutions'});

const pokemonTypeColumns = new pgp.helpers.ColumnSet([
  'pokemon_id',
  'type_id',
  'slot',
], {table: 'pokemon_types'});

const pokemonDescColumns = new pgp.helpers.ColumnSet([
  'pokemon_id',
  'p_desc',
], {table: 'pokemon_desc'});

module.exports = {
  db,
  pgp,
  pokemonColumns,
  typeColumns,
  pokemonTypeColumns,
  pokemonDescColumns,
  evolutionColumns,
};
