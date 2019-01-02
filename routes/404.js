'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  router.get('/', (req, res) => {
    res.render('error-404');
  });

  return router;
};
