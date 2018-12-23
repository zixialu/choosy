'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  let pollData;
  let choicesData = [];

  //Manages initial GET request to /vote/:id
  // TODO: This uses ejs right now, decide whether to do it like this or use jquery instead
  router.get('/:id', (req, res) => {
    res.render('vote');
  });

  //Manages AJAX GET request for data once document is ready
  router.get('/api/:id', (req, res) => {
    let publicId = req.params.id;

    findPoll(publicId).then(poll => {
      Promise.all([getPrompt(poll), findPollChoices(poll)]).then(result => {
        const prompt = result[0];
        const pollChoices = result[1];

        res.json({ prompt, pollChoices });
      });
    });
  });

  // PUT new vote
  router.put('/:id', (req, res) => {
    // TODO: Pull all vote parameters out from request body
    // Vote
    const pollId = req.params.pollId;
    const voteDate = Date();

    // Insert new vote
    knex('votes')
      .insert({
        poll_id: pollId,
        vote_date: voteDate
      })
      .returning('*')
      .then(vote => {
        // Poll choices/votes join table
        // TODO: Insert each choice rank into poll_choices_votes
        req.body.pollChoices.forEach(choice => {
          const { choiceId, rank } = choice;
          knex('poll_choices_votes').insert({
            vote_id: vote.id,
            poll_choice_id: choiceId,
            rank
          });
        });
      });
  });

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.render('index');
  });

  return router;

  function findPoll(publicId) {
    return knex
      .first('*')
      .from('polls')
      .where('public_id', publicId);
  }

  function getPrompt(poll) {
    return poll.prompt;
  }

  function findPollChoices(poll) {
    return knex
      .select('*')
      .from('poll_choices')
      .where('poll_id', poll.id);
  }
};
