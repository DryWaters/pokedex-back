require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const favicon = require('serve-favicon');
const cors = require('cors');

const pokemonAll = require('./routes/pokemonAll');
const pokemonDetails = require('./routes/pokemonDetails');
const utils = require('./database/utils');
const database = require('./database/db');
const redis = require('./database/redis');
const app = express();

app.enable('trust proxy'); // enable if using Heroku
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests every 15 minutes
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/pokemon/:id', limiter);
app.use('/pokemon', pokemonAll);
app.use('/pokemon', pokemonDetails);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

// close database connections on exit
const closeDBConnections = () => {
  if (database) {
    database.pgp.end();
  }
  if (redis) {
    redis.quit();
  }
  process.exit(1);
};

process.on('SIGINT', closeDBConnections);
process.on('SIGTERM', closeDBConnections);

module.exports = app;
