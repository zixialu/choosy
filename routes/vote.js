'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET voting page
  router.post('/vote/:id', (req, res) => {});

  // PUT new vote
  router.put('/vote/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/vote', (req, res) => {});

  return router;
};
