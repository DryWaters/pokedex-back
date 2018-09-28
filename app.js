require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const utils = require('./database/utils');
const pokemon = require('./routes/pokemon');
const app = express();

const favicon = require('serve-favicon');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/pokemon', pokemon);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

module.exports = app;
