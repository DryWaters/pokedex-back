var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const pgp = require('pg-promise')();
const db = pgp('');
db.any('SELECT * FROM test', [true])
  .then(function(data) {
    console.log('Able to connect to PostGres DB with SQL query ');
    console.log('SELECT * FROM test');
    console.log(data);
  }).catch(function(error) {
    console.log('ERROR getting connection with error ' + error);
  })

module.exports = app;
