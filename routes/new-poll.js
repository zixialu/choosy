'use strict';

const uuidv4 = require('uuid/v4');
const express = require('express');
const router = express.Router();
const AES = require('crypto-js/aes');

const mailgunHelpers = require('../utils/mailgun-helpers');

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {
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

    Promise.resolve(insertPoller()).then(result => {
      const pollerId = parseInt(result[0]);
      insertPoll(pollerId).then(pollId => {
        insertPollChoices(parseInt(pollId)).then(() => {
          // Using pollId, return encrypted pollId
          const encryptedId = AES.encrypt(
            pollId.toString(),
            process.env.AES_SECRET_KEY
          );
          res.status(201).send(encodeURIComponent(encryptedId));
          mailgunHelpers.sendNewPollEmail(
            input.email,
            encodeURIComponent(encryptedId),
            publicId
          );
        });
      });
    });

    function insertPoller() {
      return knex('pollers')
        .returning('id')
        .insert({ email: input.email });
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
  });

  return router;
};
