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
    const publicId = req.params.id;
    let voteId;
    // Get poll id from public id
    Promise.all([findPoll(publicId)])
      // Create and return new vote
      .then(results => {
        const pollId = results[0].id;
        console.log('results', results)
        insertVote(pollId)
          // Insert new pollChoicesVotes
          .then(vote => {
            //FIXME: vote ID not getting saved to poll_choices_votes
            console.log('vote', vote)
            voteId = vote[0].id;
            console.log('vote id', voteId)
            // Poll choices/votes join table
            // TODO: Insert each choice rank into poll_choices_votes
            const promises = JSON.parse(req.body.pollChoices).map(choice => {
              const { choiceId, rank } = choice;
              return knex('poll_choices_votes')
                .insert({
                  vote_id: voteId,
                  poll_choice_id: choiceId,
                  rank
                })
                .returning('*');
            });
            // .then(() => {
              Promise.all(promises).then(results => {
              // TODO: Resolve, maybe redirect to another page
              console.log('Submitted vote!');
              res.status(201).send('Thanks for voting!');
            // });
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

  function insertVote(pollId) {
    const voteDate = Date();
    return knex('votes')
      .insert({
        poll_id: pollId,
        vote_date: null
      })
      .returning('*');
  }
};
