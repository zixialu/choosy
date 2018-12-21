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
    let publicId = req.params.id;
    res.render('manage', publicId)
  });

  //Manages AJAX GET request for data once document is ready
  router.get('/api/:id', (req, res) => {
    let publicId = req.params.id;
    findPolls(publicId).then(poll =>
      Promise.all([findPollChoices(poll), findVotes(poll)]).then(result =>
        findRanks(result[0])
      )
    );
  //: add next steps after data collected from DB
  });

  // // POST edit poll
  // router.post('/:id', (req, res) => {});

  // // DELETE poll
  // router.delete('/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.redirect('/');
  });

  return router;

  function findPolls(publicId) {
    pollData = knex
      .first('*')
      .from('polls')
      .where('public_id', publicId);
    return pollData;
  }

  function findPollChoices(poll) {
    choicesData = knex
      .select('*')
      .from('poll_choices')
      .where('poll_id', poll.id);
    return choicesData;
  }

  function findVotes(poll) {
    votesData = knex
      .select('*')
      .from('votes')
      .where('poll_id', poll.id);
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
