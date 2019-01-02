'use strict';

const express = require('express');
const router = express.Router();
const api_key = 'f404e6957acba7811ed9226324134cfb-49a2671e-d19101fe';
const domain = 'sandboxe68219f726034186a6ff2f5cbe3fdc95.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const MailComposer = require('nodemailer/lib/mail-composer')

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
        const pollerId = results[0].poller_id;
        insertVote(pollId)
          // Insert new pollChoicesVotes
          .then(vote => {
            //FIXME: vote ID not getting saved to poll_choices_votes
            voteId = vote[0].id;
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
              Promise.all(promises)
              .then(results => {
              // TODO: Resolve, maybe redirect to another page
                console.log('Submitted vote!');
                res.status(201).send('Thanks for voting!');
                findEmail(pollerId)
                .then(results => {
                  //TODO: figure out how to get encrypted ID (ask Zixia)
                  console.log('these are the results', results)
                  let email = results[0].email;
                  let data = {
                    from: 'Choosy <umair.abdulq@gmail.com>',
                    to: `${email}`,
                    subject: 'Choosy - New Vote!',
                    html: `
                    <h1>You have received a new vote on your Choosy poll!</h1>
                    <p><a href="http://localhost:8080/manage/${encryptedId}">Click here</a> to see the latest poll results.</p>
                    `
                  }
                  let mail = new MailComposer(data);

                  mail.compile().build((err, message) => {
                    var dataToSend = {
                      to: `${input.email}`
                      message: message.toString('ascii')
                    };
                    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                      if (sendError) {
                        console.log(sendError);
                        return;
                      }
                    });
                  });
                })
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

  function findEmail(id) {
    return knex
      .select('*')
      .from('pollers')
      .where('id', id)
  }
};
