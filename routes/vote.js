'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  // GET voting page
  // TODO: This uses ejs right now, decide whether to do it like this or use jquery instead
  router.post('/:id', (req, res) => {
    // TODO: Fill up template vars with poll data and choices data
    const pollId = req.params.id;

    // Get the poll from db
    const poll = knex('polls')
      .first()
      .where({ id: pollId });

    const choices = knex('poll_choices')
      .select()
      .where({ poll_id: pollId });

    const templateVars = {
      poll,
      choices
    };
    // TODO: Change this path once it's created
    res.render('vote', templateVars);
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
    res.redirect('/');
  });

  return router;
};
