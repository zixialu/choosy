'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {});

  // POST create new poll
  router.post('/', (req, res) => {});

  return router;
};
