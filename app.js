require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const utils = require('./database/utils');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

module.exports = app;
