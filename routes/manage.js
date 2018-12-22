'use strict';

const express = require('express');
const router = express.Router();

module.exports = knex => {
  let pollData;
  let choicesData = [];
  let votesData = [];
  let rankData = {};
  let pollId;

  // Manages initial GET request to /manage/:id
  router.get('/:id', (req, res) => {
    res.render('manage')
  });

  //Manages AJAX GET request for data once document is ready
  router.get('/api/:id', (req, res) => {
    console.log("params id", req.params.id)
    pollId = req.params.id;



    findPolls(pollId)
    .then(polls => {
      pollData = polls
      console.log(pollData)
    })

    Promise.all([findPollChoices(pollId), findVotes(pollId)])
    .then(result => {
      rankData = findRanks(result[0])
      choicesData = result[0]
      votesData = result[1]
    })
    .then(result => {
      console.log("this is the final ranking output", rankData)
    })

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
    //     //   rankData = result
    //   })
    //   .then(console.log({pollData, choicesData, votesData}))
    // })


    // console.log(Promise.all([findPolls(pollId), findPollChoices(pollId), findVotes(pollId)]))
    // .then(result => findRanks(result[1]))
    // .then(res.send({pollData, choicesData, votesData, rankData}))
  //: add next steps after data collected from DB
  });

  // // POST edit poll
  // router.post('/:id', (req, res) => {});

  // // DELETE poll
  // router.delete('/:id', (req, res) => {});

  // Redirect to '/'
  router.get('/', (req, res) => {
    res.render('index')
  });

  return router;

  function findPolls(pollId) {
    return knex
      .first('*')
      .from('polls')
      .where('id', pollId)
  }

  function findPollChoices(pollId) {
    return knex
      .select('*')
      .from('poll_choices')
      .where('poll_id', pollId)
      // .returning('*')
  }

  function findVotes(pollId) {
    return knex
      .select('*')
      .from('votes')
      .where('poll_id', pollId)
      // .returning('*')
  }


  function findRanks(pollChoices) {
    // let rank = {}
    console.log("choices data function input", pollChoices)
    for (let x = 0; x < pollChoices.length; x++) {
      return knex
        .sum('rank')
        .from('poll_choices_votes')
        .where('poll_choice_id', pollChoices[x].id)
        .then(result => {
          return parseInt(result[0].sum);
        })
      rankData[pollChoices[x].id] = testVar  // .returning('*')
    }

    console.log('rankData', rankData);
    // console.log("this is the rank outside the for loop", rank)
    // return rank;
  }

    // pollChoices.foreEach(choice => {
    //   return knex
    //     .sum('rank')
    //     .from('poll_choices_votes')
    //     .where('poll_choice_id', choice.id)
    //     .then(result => {
    //       rankData[choice] = result;
    //     })  // .returning('*')
    // });
  // }
}
