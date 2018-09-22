const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
// const db = require('../database/db');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    'pokemon': {
      'id': 0,
      'name': 'Testmon',
      'type': ['Ground', 'Sun'],
    },
  });
});

module.exports = router;
