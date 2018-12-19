'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET Ppoll creation page
  router.get('/', (req, res) => {});

  // POST create new poll
  router.post('/', (req, res) => {});

  // Manage created poll
  router.get('/manage/:id', (req, res) => {});

  // POST edit poll
  router.post('/manage/:id', (req, res) => {});

  // DELETE poll
  router.delete('/manage/:id', (req, res) => {});

  // GET voting page
  router.post('/vote/:id', (req, res) => {});

  // PUT new vote
  router.put('/vote/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/manage', (req, res) => {});

  // Redirect to '/'
  router.get('/vote', (req, res) => {});

  return router;
};
