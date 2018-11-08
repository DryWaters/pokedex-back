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

// Will be used for caching later...
const redisClient = redis.createClient(process.env.REDIS_URL);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.enable('trust proxy'); // enable if using Heroku
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests every 15 minutes
});

app.use(limiter);
app.use('/pokemon', pokemonAll);
app.use('/pokemon/', pokemonDetails);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

module.exports = app;
