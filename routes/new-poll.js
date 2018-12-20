'use strict';

const uuidv4 = require('uuid/v4');

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {
    // TODO: Change the file path when it's made
    res.render('index');
  });

  // POST create new poll
  router.post('/', (req, res) => {
    // TODO: Generate/pull all poll parameters out from the request as follows:
    // TODO: Refactor db interfacing logic out to a data-helpers function

    // Poller
    const pollerEmail = req.body.email;
    /*
     * TODO: Lookup pollers by email to see if pollers already exists, and use
     * its id if it does; insert a new poller otherwise.
     * Also update email column in pollers table to be indexed to facilitate
     * fast frequent searching
     */
    // Insert new poller
    knex('pollers')
      .insert({
        email: pollerEmail
      })
      .returning('*')
      .then(poller => {
        // Poll
        const prompt = req.body.prompt;
        const createDate = Date();
        // TODO: Stretch: set a close date if applicable
        const closeDate = null;
        const publicId = uuidv4();

        // Insert new poll
        knex('polls')
          .insert({
            poller_id: poller.id,
            prompt,
            create_date: createDate,
            close_date: closeDate,
            public_id: publicId
          })
          .returning('*');
      })
      .then(poll => {
        // Poll choices
        // TODO: Implement this based on how choices are structured in the form
        req.body.pollChoices.forEach(choice => {
          const { title, description } = choice;

          // Insert new poll choice
          knex('poll_choices').insert({
            poll_id: poll.id,
            title,
            description
          });
        });
      })
      .catch(err => {
        // TODO: Catch errors
      });
  });

  return router;
};
