require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const utils = require('./database/utils');
const pokemonAll = require('./routes/pokemonAll');
const pokemonDetails = require('./routes/pokemonDetails');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const favicon = require('serve-favicon');
const cors = require('cors');
const app = express();

// if in production, enable caching and limiting.
if (process.env.NODE_ENV === 'production') {

  // will be used later for caching...
  const client = redis.createClient(process.env.REDIS_URL);

  app.enable('trust proxy'); // enable if using Heroku
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests every 15 minutes
  });

  app.use(limiter);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/pokemon', pokemonAll);
app.use('/pokemon/', pokemonDetails);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
    .then(() => {
      console.log('done setting up');
    });
}

module.exports = app;
