'use strict';

const express = require('express');
const router = express.Router();
const AES = require('crypto-js/aes');

const mailgunHelpers = require('../utils/mailgun-helpers');

module.exports = knex => {
  let pollData;
  let choicesData = [];

  // Thank you for voting
  router.get('/done', (req, res) => {
    res.render('thanks');
  });

  //Manages initial GET request to /poll/:id
  router.get('/:id', (req, res) => {
    res.render('vote');
  });

  //Manages AJAX GET request for data once document is ready
  router.get('/api/:id', (req, res) => {
    let publicId = req.params.id;

    findPoll(publicId)
      .then(poll => {
        Promise.all([getPrompt(poll), findPollChoices(poll)]).then(result => {
          const prompt = result[0];
          const pollChoices = result[1];

          res.json({ prompt, pollChoices });
        });
      })
      .catch(err => {
        // Assume id is bad and return a 404
        // TODO: Handle different errors differently
        res.status(404).send();
      });
  });

  // PUT new vote
  router.put('/:id', (req, res) => {
    // Vote
    const publicId = req.params.id;
    let voteId;
    // Get poll id from public id
    Promise.all([findPoll(publicId)])
      // Create and return new vote
      .then(results => {
        const pollId = results[0].id;
        const pollerId = results[0].poller_id;
        insertVote(pollId)
          // Insert new pollChoicesVotes
          .then(vote => {
            voteId = vote[0].id;

            // Poll choices/votes join table
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
              console.log('Submitted vote!');
              res.status(201).send('Thanks for voting!');

              // FIXME: Do we really need to send an email for EVERY vote?
              findEmail(pollerId).then(results => {
                const encryptedId = AES.encrypt(
                  pollId.toString(),
                  process.env.AES_SECRET_KEY
                );

                console.log('these are the results', results);
                let email = results[0].email;
                mailgunHelpers.sendNewVoteEmail(
                  email,
                  encodeURIComponent(encryptedId)
                );
              });
            });
          });
      });
  });

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.redirect('/');
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

  function findEmail(id) {
    return knex
      .select('*')
      .from('pollers')
      .where('id', id);
  }
};
