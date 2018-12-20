'use strict';

const uuidv4 = require('uuid/v4');

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {});

  // POST create new poll
  router.post('/', (req, res) => {
    // TODO: Generate/pull all poll parameters out from the request as follows:
    // Poller
    const pollerEmail = req.body.email;

    // Poll
    const prompt = req.body.prompt;
    const createDate = Date();
    // TODO: Stretch: set a close date if applicable
    const closeDate = null;
    const publicId = uuidv4();

    /*
     * FIXME: Refactor pollers table in db to be primary keyed by email, so we
     * don't have to do a lookup to find matching id or have multiple bogus entries
     */
    // TODO: Insert new poller, then poll, then choices
    // TODO: Refactor helper functions out to a data-helpers file
  });

  return router;
};
