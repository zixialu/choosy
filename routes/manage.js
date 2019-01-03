'use strict';

const express = require('express');
const router = express.Router();

var CryptoJS = require('crypto-js');

module.exports = knex => {
  let pollData;
  let choicesData = [];
  let votesData = [];
  let pollId;
  let publicId;

  // Manages initial GET request to /result/:id
  router.get('/:encryptedId', (req, res) => {
    res.render('manage');
  });

  // Manages AJAX GET request for data once document is ready
  router.get('/api/:encryptedId', (req, res) => {
    // Decrypt id
    var bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(req.params.encryptedId),
      process.env.AES_SECRET_KEY
    );
    const id = bytes.toString(CryptoJS.enc.Utf8);
    console.log(
      'unescaped id is ' + decodeURIComponent(req.params.encryptedId)
    );

    const findRanks = function(pollChoices) {
      console.log('choices data function input', pollChoices);
      // Create an array of knex promises
      return pollChoices.map(choice => {
        return knex
          .sum('rank')
          .from('poll_choices_votes')
          .where('poll_choice_id', choice.id);
      });
    };

    const findPoll = function(pollId) {
      return knex
        .first('*')
        .from('polls')
        .where('id', pollId);
    };

    const findPollChoices = function(pollId) {
      return knex
        .select('*')
        .from('poll_choices')
        .where('poll_id', pollId);
    };

    const findVotes = function(pollId) {
      return knex
        .select('*')
        .from('votes')
        .where('poll_id', pollId);
    };

    // TODO: Review and refactor this maybe
    const parseData = function(poll, choices, ranks) {
      let parsedPrompt = poll.prompt;
      let parsedChoices = [];
      let parsedDescriptions = [];

      let parsedPublicId = poll.public_id;

      choices.forEach(choice => {
        parsedChoices.push(choice.title);
        parsedDescriptions.push(choice.description);
      });

      let parsedRanks = [];

      ranks.forEach(rank => {
        parsedRanks.push(parseInt(rank[0].sum));
      });
      return {
        parsedPrompt,
        parsedChoices,
        parsedDescriptions,
        parsedRanks,
        parsedPublicId
      };
    };

    console.log('params id', id);
    pollId = id;

    // FIXME: The Promise.all should be chained to findPoll as the res.json
    // depends on findPoll's result
    findPoll(pollId)
      .then(poll => {
        pollData = poll;
        console.log('this is the poll data', pollData);
      })
      .catch(err => {
        // Assume id is bad and return a 404
        // TODO: Handle different errors differently
        res.status(404).send();
      });

    Promise.all([findPollChoices(pollId), findVotes(pollId)]).then(results => {
      choicesData = results[0];
      votesData = results[1];
      Promise.all(findRanks(results[0])).then(ranks => {
        res.json(parseData(pollData, choicesData, ranks));
        // .then(result => {
        // })
      });
      // .then(result => {
      // console.log('this is the final ranking output', result);
      // })
    });

    // .then(findRanks(choicesData))
    // .then(result => {
    //   console.log(result)
    // })
    // .then(() => {
    //   Promise.all([findPollChoices(pollId), findVotes(pollId)])
    //   .then(result => {
    //     choicesData = result[0]
    //     votesData = result[1]
    //   })
    //   .then(result => {
    //     findRanks(result[0])
    //     // .then(result => {
    //     //   ranksData = result
    //   })
    //   .then(console.log({pollData, choicesData, votesData}))
    // })

    // console.log(Promise.all([findPoll(pollId), findPollChoices(pollId), findVotes(pollId)]))
    // .then(result => findRanks(result[1]))
    // .then(res.send({pollData, choicesData, votesData, ranksData}))
    //: add next steps after data collected from DB
  });

  // TODO: POST edit poll
  // router.post('/:id', (req, res) => {});

  // TODO: DELETE poll
  // router.delete('/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.redirect('/');
  });

  return router;

  // for (let x = 0; x < pollChoices.length; x++) {
  //   return knex
  //     .sum('rank')
  //     .from('poll_choices_votes')
  //     .where('poll_choice_id', pollChoices[x].id)
  //     .then(result => {
  //       return parseInt(result[0].sum);
  //     });
  // ranksData[pollChoices[x].id] = testVar;

  // console.log('ranksData', ranksData);
  // console.log("this is the rank outside the for loop", rank)
  // return rank;
};

// pollChoices.foreEach(choice => {
//   return knex
//     .sum('rank')
//     .from('poll_choices_votes')
//     .where('poll_choice_id', choice.id)
//     .then(result => {
//       ranksData[choice] = result;
//     })  // .returning('*')
// });
// }
// };
