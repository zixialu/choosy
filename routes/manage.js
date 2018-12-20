'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // Manage created poll
  router.get('/manage/:id', (req, res) => {});

  // POST edit poll
  router.post('/manage/:id', (req, res) => {});

  // DELETE poll
  router.delete('/manage/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/manage', (req, res) => {});

  return router;
};
