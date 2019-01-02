'use strict';

const uuidv4 = require('uuid/v4');
const express = require('express');
const router = express.Router();
const AES = require('crypto-js/aes');
const api_key = 'f404e6957acba7811ed9226324134cfb-49a2671e-d19101fe';
const domain = 'sandboxe68219f726034186a6ff2f5cbe3fdc95.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const MailComposer = require('nodemailer/lib/mail-composer')

module.exports = knex => {
  // GET poll creation page
  router.get('/', (req, res) => {
    // TODO: Change the file path when it's made
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

    Promise.resolve(insertPoller())
    .then(result => {
      const pollerId = parseInt(result[0]);
      insertPoll(pollerId)
      .then(pollId => {
        insertPollChoices(parseInt(pollId))
        .then(() => {
          // Using pollId, return encrypted pollId
          const encryptedId = AES.encrypt(
            pollId.toString(),
            process.env.AES_SECRET_KEY
          );
          res.status(201).send(encodeURIComponent(encryptedId));
          .then(() => {
            let data = {
              from: 'Choosy <umair.abdulq@gmail.com>',
              to: `${input.email}`,
              subject: 'Your Choosy Poll!',
              html: `
              <h1>Your new Choosy poll has been created!</h1>
              <p><a href="http://localhost:8080/manage/${encryptedId}">Click here</a> to track your poll results</p>
              <p><a href="http://localhost:8080/vote/${publicId}">Share this link</a> to ask your friends, family and/or colleagues to help you be Choosy.</p>
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
          });
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
