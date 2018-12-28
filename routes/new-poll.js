'use strict';

const uuidv4 = require('uuid/v4');

const express = require('express');
const router = express.Router();

var AES = require('crypto-js/aes');

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {
    // TODO: Change the file path when it's made
    res.render('index');
  });

  // POST create new poll
  router.post('/', (req, res) => {
    //creates variable to hold the object sent from submit button
    let input = req.body;
    let keys = Object.keys(input);
    let publicId = uuidv4();
    let pollChoices = [];
    let pollId;

    Promise.all([insertPoller()]).then(result => {
      console.log('first promise', result);
      const pollerId = parseInt(result[0][0]);
      insertPoll(pollerId).then(pollId => {
        insertPollChoices(parseInt(pollId)).then(res.send(pollId));
      });
    });

    // TODO: Using pollId, redirect to manage page

    function insertPoller() {
      return knex('pollers')
        .returning('id')
        .insert({ email: req.body.email });
    }

    function insertPoll(pollerId) {
      return knex('polls')
        .insert({
          poller_id: pollerId,
          prompt: input.prompt,
          public_id: publicId
        })
        .returning('id');
    }

    function insertPollChoices(id) {
      return knex('poll_choices').insert(parseChoices(id));
      pollId = id;
    }

    function parseChoices(id) {
      for (let counter = 2; counter < keys.length; counter += 2) {
        pollChoices.push({
          poll_id: id,
          title: input[keys[counter]],
          description: input[keys[counter + 1]]
        });
      }
      return pollChoices;
    }
    // knex('pollers')
    // .insert({email: input.email})
    // .returning('id')
    // .then(id => )

    // console.log("body of request", req.body);

    // TODO: Generate/pull all poll parameters out from the request as follows:
    // TODO: Refactor db interfacing logic out to a data-helpers function

    // Poller
    // const pollerEmail = req.body.email;
    // /*
    //  * TODO: Lookup pollers by email to see if pollers already exists, and use
    //  * its id if it does; insert a new poller otherwise.
    //  * Also update email column in pollers table to be indexed to facilitate
    //  * fast frequent searching
    //  */
    // // Insert new poller
    // knex('pollers')
    //   .insert({
    //     email: pollerEmail
    //   })
    //   .returning('*')
    //   .then(poller => {
    //     // Poll
    //     const prompt = req.body.prompt;
    //     const createDate = Date();
    //     // TODO: Stretch: set a close date if applicable
    //     const closeDate = null;
    //     const publicId = uuidv4();

    //     // Insert new poll
    //     knex('polls')
    //       .insert({
    //         poller_id: poller.id,
    //         prompt,
    //         create_date: createDate,
    //         close_date: closeDate,
    //         public_id: publicId
    //       })
    //       .returning('*');
    //   })
    //   .then(poll => {
    //     // Poll choices
    //     // TODO: Implement this based on how choices are structured in the form
    //     req.body.pollChoices.forEach(choice => {
    //       const { title, description } = choice;

    //       // Insert new poll choice
    //       knex('poll_choices').insert({
    //         poll_id: poll.id,
    //         title,
    //         description
    //       });
    //     });
    //   })
    //   .catch(err => {
    //     // TODO: Catch errors
    //   });
  });

  return router;
};
