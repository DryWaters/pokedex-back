const https = require('https');
const fs = require('fs');
const csv = require('csv-parser');
const async = require('async');


let pokemonNames = [];
fs.createReadStream('./data/csv/pokemon.csv')
  .pipe(csv())
  .on('data', (data) => pokemonNames.push(
    {
      pokemon_id: data.pokemon_id,
      name: data.name,
      small_url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/' + data.pokemon_id.padStart(3, '0') + '.png',
      large_url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + data.pokemon_id.padStart(3, '0') + '.png',
      image_id: data.image_id,
    }
  ))
  .on('end', () => {
    async.eachLimit(pokemonNames, 5, function (pokemon, callback) {
      var file = fs.createWriteStream('./public/sprites/pokemon/small/' + pokemon.pokemon_id + '.png');
      var request = https.get(pokemon.small_url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
          file.close(callback());
        });
      }).on('error', (err) => {
        fs.unlink(pokemon.small_url);
        callback();
      });
    });

    async.eachLimit(pokemonNames, 5, function (pokemon, callback) {
      var file = fs.createWriteStream('./public/sprites/pokemon/large/' + pokemon.pokemon_id + '.png');
      var request = https.get(pokemon.large_url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
          file.close(callback());
        });
      }).on('error', (err) => {
        fs.unlink(pokemon.large_url);
        callback();
      })

    }, (err) => {
      console.log(err);
    });
  });