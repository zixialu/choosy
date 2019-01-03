'use strict';

const express = require('express');
const router = express.Router();
const AES = require('crypto-js/aes');

// TODO: Move this into .env
const api_key = 'f404e6957acba7811ed9226324134cfb-49a2671e-d19101fe';
const domain = 'sandboxe68219f726034186a6ff2f5cbe3fdc95.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
const MailComposer = require('nodemailer/lib/mail-composer');

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
              // TODO: Resolve, maybe redirect to another page
              console.log('Submitted vote!');
              res.status(201).send('Thanks for voting!');

              // TODO: Do we need to send an email for EVERY SINGLE vote?
              findEmail(pollerId).then(results => {
                //TODO: figure out how to get encrypted ID (ask Zixia)
                const encryptedId = AES.encrypt(
                  pollId.toString(),
                  process.env.AES_SECRET_KEY
                );

                console.log('these are the results', results);
                let email = results[0].email;
                let data = {
                  from: 'Choosy <umair.abdulq@gmail.com>',
                  to: `${email}`,
                  subject: 'Choosy - New Vote!',
                  html: `
                    <h1>You have received a new vote on your Choosy poll!</h1>
                    <p><a href="https://chooosy.herokuapp.com/result/${encryptedId}">Click here</a> to see the latest poll results.</p>
                    `
                };
                let mail = new MailComposer(data);

                mail.compile().build((err, message) => {
                  var dataToSend = {
                    to: email,
                    message: message.toString('ascii')
                  };
                  mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                    if (sendError) {
                      console.log(sendError);
                      return;
                    }
                  });
                });
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
