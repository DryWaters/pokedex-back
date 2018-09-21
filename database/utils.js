const db = require('./db');

const rebuildData = () => {
  db.any('SELECT * FROM test', [true])
  .then(function(data) {
    console.log('Able to connect to PostGres DB with SQL query ');
    console.log('SELECT * FROM test');
    console.log(data);
  }).catch(function(error) {
    console.log('ERROR getting connection with error ' + error);
  });
}

module.exports = {
  rebuildData: rebuildData
}