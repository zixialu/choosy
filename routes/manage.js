'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  let pollData;
  let choicesData = [];
  let votesData = [];
  let rankData = [];

  // Manages initial GET request to /manage/:id
  router.get('/:id', (req, res) => {
    let pollId = req.params.id;
    res.render('manage', pollId)
  });

  //Manages AJAX GET request for data once document is ready
  router.get('/api/:id', (req, res) => {
    let pollId = req.params.id;
    Promise.all([findPolls(pollId), findPollChoices(pollId), findVotes(pollId)])
    .then(result => findRanks(result[1]))
  //: add next steps after data collected from DB
  });

  // // POST edit poll
  // router.post('/:id', (req, res) => {});

  // // DELETE poll
  // router.delete('/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.render('index');
  });

  return router;

  function findPolls(pollId) {
    pollData = knex
      .first('*')
      .from('polls')
      .where('id', pollId);
    return pollData;
  }

  function findPollChoices(pollId) {
    choicesData = knex
      .select('*')
      .from('poll_choices')
      .where('poll_id', pollId);
    return choicesData;
  }

  function findVotes(pollId) {
    votesData = knex
      .select('*')
      .from('votes')
      .where('poll_id', pollId);
    return votesData;
  }

  function findRanks(pollChoices) {
    pollChoices.forEach(choice => {
      rankData.push(
        knex
          .select('*')
          .from('poll_choices_votes')
          .where('poll_choice_id', choice.id)
      );
    });
  }
};
