const database = require('./db');
const fs = require('fs');
const csv = require('csv-parser');
const sql = require('./sql');

/* Rebuilds entire pokemon database tables and inserts all data
 Uses promise chaining to complete each async task one after one another
 TODO:  Allow dynamic creation of definition from an object or array. */
const rebuildData = () => {
  return clearDatabase()
      .then(() => createTables())
      .then(() => loadPokemonData())
      .then(() => loadTypeData())
      .then(() => loadPokemonTypeData())
      .then(() => loadPokemonDescData())
      .then(() => loadEvolutionData())
      .then(() => loadAbilitiesData())
      .then(() => loadSpeciesData())
      .then(() => loadDamageData())
      .then(() => loadPokemonAbilitiesData())
      .catch((err) => console.log('Error creating database ' +
  'with error: ' + err));
};

// Drops all tables if they exist
const clearDatabase = () => {
  return database.db.none(sql.types.dropTable)
      .then(() => database.db.none(sql.pokemonTypes.dropTable))
      .then(() => database.db.none(sql.pokemon.dropTable))
      .then(() => database.db.none(sql.pokemonDesc.dropTable))
      .then(() => database.db.none(sql.evolutions.dropTable))
      .then(() => database.db.none(sql.species.dropTable))
      .then(() => database.db.none(sql.damageStats.dropTable))
      .then(() => database.db.none(sql.pokemonAbils.dropTable))
      .then(() => database.db.none(sql.abilities.dropTable));
};

// Create all tables and primary keys
const createTables = () => {
  return database.db.none(sql.pokemonTypes.createTable)
      .then(() => database.db.none(sql.types.createTable))
      .then(() => database.db.none(sql.pokemon.createTable))
      .then(() => database.db.none(sql.pokemonDesc.createTable))
      .then(() => database.db.none(sql.evolutions.createTable))
      .then(() => database.db.none(sql.species.createTable))
      .then(() => database.db.none(sql.damageStats.createTable))
      .then(() => database.db.none(sql.pokemonAbils.createTable))
      .then(() => database.db.none(sql.abilities.createTable));
};

/* Loads all pokemon data from CSV file expected to be in location is
./data/csv/pokemon.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array.
*/
const loadPokemonData = () => {
  return new Promise((resolve, reject) => {
    let pokemonData = [];
    fs.createReadStream('./data/csv/pokemon.csv')
        .pipe(csv())
        .on('data', (data) => pokemonData.push(
            {
              pokemon_id: data.pokemon_id,
              name: data.name,
              species_id: data.species_id,
              image_id: data.image_id,
              evol_id: data.evol_id,
              hp: data.hp,
              attack: data.attack,
              defense: data.defense,
              special_attack: data.special_attack,
              special_defense: data.special_defense,
              speed: data.speed,
            }
        ))
        .on('end', () => {
          const insert =
            database.pgp.helpers.insert(pokemonData, database.pokemonColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                 'load data into DB with error: ' + err);
                reject('At pokemon data');
              });
        });
  });
};

/* Loads all type definition data from CSV file expected to be in location is
./data/csv/types.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array. */
const loadTypeData = () => {
  return new Promise((resolve, reject) => {
    let typeData = [];
    fs.createReadStream('./data/csv/types.csv')
        .pipe(csv())
        .on('data', (data) => typeData.push(
            {
              type_id: data.type_id,
              name: data.name,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(typeData, database.typeColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At type data');
              });
        });
  });
};

/* Loads all pokemon types data from CSV file expected to be in location is
./data/csv/pokemon_types.csv.  It uses NPM package csv-parser. Data is inserted
into one large batch after all data has been added to an array. */
const loadPokemonTypeData = () => {
  return new Promise((resolve, reject) => {
    let pokemonTypeData = [];
    fs.createReadStream('./data/csv/pokemon_types.csv')
        .pipe(csv())
        .on('data', (data) => pokemonTypeData.push(
            {
              pokemon_id: data.pokemon_id,
              type_id: data.type_id,
              slot: data.slot,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(pokemonTypeData,
              database.pokemonTypeColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At pokemon type data');
              });
        });
  });
};

/* Loads all pokemon description data from CSV file expected to be in
location ./data/csv/pokemon_desc.csv.  It uses NPM package csv-parser.
Data is inserted into one large batch after all data has been added to an array.
*/
const loadPokemonDescData = () => {
  return new Promise((resolve, reject) => {
    let pokemonDescData = [];
    fs.createReadStream('./data/csv/pokemon_desc.csv')
        .pipe(csv({separator: '`'}))
        .on('data', (data) => pokemonDescData.push(
            {
              pokemon_id: data.pokemon_id,
              p_desc: data.p_desc,
            }
        ))
        .on('end', () => {
          const insert =
            database.pgp.helpers.insert(pokemonDescData,
                database.pokemonDescColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                 'load data into DB with error: ' + err);
                reject('At pokemon desc data');
              });
        });
  });
};

/* Loads all evolution definition data from CSV file expected to
 be in location is ./data/csv/evolutions.csv.  It uses NPM package
 csv-parser. Data is inserted into one large batch after all
 data has been added to an array. */
const loadEvolutionData = () => {
  return new Promise((resolve, reject) => {
    let evolutionData = [];
    fs.createReadStream('./data/csv/evolutions.csv')
        .pipe(csv())
        .on('data', (data) => evolutionData.push(
            {
              evolution_id: data.evolution_id,
              evolve_1: data.evolve_1,
              evolve_2: data.evolve_2 || null,
              evolve_3: data.evolve_3 || null,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(evolutionData, database.evolutionColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At evolution data');
              });
        });
  });
};

/* Loads all abilities definition data from CSV file expected
to be in location is ./data/csv/abilities.csv.  It uses NPM
package csv-parser. Data is inserted into one large batch after
all data has been added to an array. */
const loadAbilitiesData = () => {
  return new Promise((resolve, reject) => {
    let abilitiesData = [];
    fs.createReadStream('./data/csv/abilities.csv')
        .pipe(csv({separator: '`'}))
        .on('data', (data) => abilitiesData.push(
            {
              abil_id: data.abil_id,
              name: data.name,
              short_effect: data.short_effect,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(abilitiesData, database.abilitiesColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At abilities data');
              });
        });
  });
};

/* Loads all species  data from CSV file expected
to be in location is ./data/csv/species.csv.  It uses NPM
package csv-parser. Data is inserted into one large batch after
all data has been added to an array. */
const loadSpeciesData = () => {
  return new Promise((resolve, reject) => {
    let speciesData = [];
    fs.createReadStream('./data/csv/species.csv')
        .pipe(csv())
        .on('data', (data) => speciesData.push(
            {
              pokemon_id: data.pokemon_id,
              species: data.species,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(speciesData, database.speciesColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At species data');
              });
        });
  });
};

/* Loads all pokemon abils data from CSV file expected
to be in location is ./data/csv/pokemon_abilities.csv.  It uses NPM
package csv-parser. Data is inserted into one large batch after
all data has been added to an array. */
const loadPokemonAbilitiesData = () => {
  return new Promise((resolve, reject) => {
    let pokemonAbilsData = [];
    fs.createReadStream('./data/csv/pokemon_abilities.csv')
        .pipe(csv())
        .on('data', (data) => pokemonAbilsData.push(
            {
              pokemon_id: data.pokemon_id,
              ability_id: data.ability_id,
              is_hidden: data.is_hidden,
              slot: data.slot,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(pokemonAbilsData,
              database.pokemonAbilsColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At pokemon abilities data');
              });
        });
  });
};

/* Loads all damage data from CSV file expected
to be in location is ./data/csv/damage_stats.csv.  It uses NPM
package csv-parser. Data is inserted into one large batch after
all data has been added to an array. */
const loadDamageData = () => {
  return new Promise((resolve, reject) => {
    let damageData = [];
    fs.createReadStream('./data/csv/damage_stats.csv')
        .pipe(csv())
        .on('data', (data) => damageData.push(
            {
              type_1: data.type_1,
              type_2: data.type_2,
              normal: data.normal || null,
              fire: data.fire || null,
              water: data.water || null,
              electric: data.electric || null,
              grass: data.grass || null,
              ice: data.ice || null,
              fighting: data.fighting || null,
              poison: data.poison || null,
              ground: data.ground || null,
              flying: data.flying || null,
              psychic: data.psychic || null,
              bug: data.bug || null,
              rock: data.rock || null,
              ghost: data.ghost || null,
              dragon: data.dragon || null,
              dark: data.dark || null,
              steel: data.steel || null,
              fairy: data.fairy || null,
            }
        ))
        .on('end', () => {
          const insert =
          database.pgp.helpers.insert(damageData, database.damageColumns);
          database.db.none(insert)
              .then(() => resolve())
              .catch((err) => {
                console.log('Unable to ' +
                  'load data into DB with error: ' + err);
                reject('At damage data');
              });
        });
  });
};

// Exports all functions so they can be tested, only function needed
// by main application is the rebuildData() that calls all other functions
module.exports = {
  rebuildData,
  clearDatabase,
  createTables,
  loadPokemonData,
  loadTypeData,
  loadPokemonTypeData,
  loadPokemonDescData,
  loadEvolutionData,
  loadAbilitiesData,
  loadSpeciesData,
  loadDamageData,
  loadPokemonAbilitiesData,
};

