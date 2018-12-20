'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  let pollData;
  let choicesData = [];
  let votesData = [];
  let rankData = [];

  // Manage created poll
  router.get('/:id', (req, res) => {
    let publicId = req.params.id;
    findPolls(publicId)
    .then(poll =>
        Promise.all([
          findPollChoices(poll),
          findVotes(poll)
          ]).then((result) =>
            findRanks(result[0])
          )
        )
  });

  // // POST edit poll
  // router.post('/manage/:id', (req, res) => {});

  // // DELETE poll
  // router.delete('/manage/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/manage', (req, res) => {});

  return router;

function findPolls(publicId) {
    pollData = knex.first('*').from('polls').where('public_id', publicId);
    return pollData
  }

  function findPollChoices(poll) {
    choicesData = knex.select('*').from('poll_choices').where('poll_id', poll.id);
    return choicesData
  }

  function findVotes(poll) {
    votesData = knex.select('*').from('votes').where('poll_id', poll.id);
    return votesData
  }

  function findRanks(pollChoices) {
    pollChoices.forEach(choice => {
      rankData.push(knex.select('*').from('poll_choices_votes').where('poll_choice_id', choice.id);
    })
  }
};


