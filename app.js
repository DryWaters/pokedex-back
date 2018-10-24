require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const utils = require('./database/utils');
const pokemonAll = require('./routes/pokemonAll');
const pokemonDetails = require('./routes/pokemonDetails');
const app = express();

const favicon = require('serve-favicon');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/pokemon', pokemonAll);
app.use('/pokemon', pokemonDetails);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

module.exports = app;
