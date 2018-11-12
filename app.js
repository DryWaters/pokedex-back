require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const favicon = require('serve-favicon');
const cors = require('cors');
const path = require('path');

const pokemonAll = require('./routes/pokemonAll');
const pokemonDetails = require('./routes/pokemonDetails');
const utils = require('./database/utils');
const database = require('./database/db');
const redisClient = require('./database/redis');
const app = express();

app.enable('trust proxy'); // enable because using Heroku
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests every 15 minutes
  handler: (req, res) => {
    const timeTillReset = Math.round(
        (req.rateLimit.resetTime - new Date()) / 1000);
    return res.status(429)
        .json({
          'error': 'Too many requests.  Please ' +
            'try again in ' + timeTillReset + ' seconds.'});
  },
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/pokemon', limiter);
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
  if (redisClient) {
    redisClient.disconnect();
  }
  process.exit(1);
};

process.on('SIGINT', closeDBConnections);
process.on('SIGTERM', closeDBConnections);

module.exports = app;
