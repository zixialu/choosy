
exports.seed = function(knex, Promise) {

  function deletePollChoicesVotes() {
    return knex('poll_choices_votes').del()
  };

  function deleteVotes() {
    return knex('votes').del()
  };

  function deletePollChoices() {
    return knex('poll_choices').del()
  };

  function deletePolls() {
    return knex('polls').del()
  };

  function deletePollers() {
    return knex('pollers').del()
  };

  function insertPollers() {
    return knex('pollers').insert([
      {email: 'umair.abdulq@gmail.com'},
      {email: 'ricky.r.varghese@gmail.com'}
    ]).returning('*');
  };

  function insertPolls(pollers) {
    return knex('polls').insert([
      {poller_id: pollers[0].id, prompt: 'What should I eat for lunch today?', public_id: '1234'},
      {poller_id: pollers[1].id, prompt: 'What movie should I watch this weekend?', public_id: '5678'}
    ]).returning('*');
  };

  function insertPollChoices(polls) {
    return knex('poll_choices').insert([
      {poll_id: polls[0].id, title: 'Pizza', description: 'Pepperoni and cheese'},
      {poll_id: polls[0].id, title: 'Sandwich', description: 'Tuna salad'},
      {poll_id: polls[0].id, title: 'Salad', description: 'Greek salad'},
      {poll_id: polls[1].id, title: 'Roma', description: 'It is on Netflix'},
      {poll_id: polls[1].id, title: 'Home Alone', description: 'A classic'},
      {poll_id: polls[1].id, title: 'The Favourite', description: 'Oscar buzz!'}
    ]).returning('*');
  };

  function insertVotes(polls) {
    return knex('votes').insert([
      {poll_id: polls[0].id}, //1
      {poll_id: polls[0].id}, //2
      {poll_id: polls[0].id}, //3
      {poll_id: polls[1].id}, //4
      {poll_id: polls[1].id}, //5
      {poll_id: polls[1].id} //6
    ]).returning('*');
  };

  function insertPollChoicesVotes(choices, votes) {
    return knex('poll_choices_votes').insert([
      {vote_id: votes[0].id, poll_choice_id: choices[0].id, rank: 3},
      {vote_id: votes[0].id, poll_choice_id: choices[1].id, rank: 2},
      {vote_id: votes[0].id, poll_choice_id: choices[2].id, rank: 1},
      {vote_id: votes[1].id, poll_choice_id: choices[0].id, rank: 1},
      {vote_id: votes[1].id, poll_choice_id: choices[1].id, rank: 2},
      {vote_id: votes[1].id, poll_choice_id: choices[2].id, rank: 3},
      {vote_id: votes[2].id, poll_choice_id: choices[0].id, rank: 2},
      {vote_id: votes[2].id, poll_choice_id: choices[1].id, rank: 3},
      {vote_id: votes[2].id, poll_choice_id: choices[2].id, rank: 1},
      {vote_id: votes[3].id, poll_choice_id: choices[3].id, rank: 3},
      {vote_id: votes[3].id, poll_choice_id: choices[4].id, rank: 2},
      {vote_id: votes[3].id, poll_choice_id: choices[5].id, rank: 1},
      {vote_id: votes[4].id, poll_choice_id: choices[3].id, rank: 1},
      {vote_id: votes[4].id, poll_choice_id: choices[4].id, rank: 2},
      {vote_id: votes[4].id, poll_choice_id: choices[5].id, rank: 3},
      {vote_id: votes[5].id, poll_choice_id: choices[3].id, rank: 2},
      {vote_id: votes[5].id, poll_choice_id: choices[4].id, rank: 3},
      {vote_id: votes[5].id, poll_choice_id: choices[5].id, rank: 1},
    ])
  };


  return deletePollChoicesVotes()
    .then(deleteVotes)
    .then(deletePollChoices)
    .then(deletePolls)
    .then(deletePollers)
    .then(insertPollers)
    .then(pollers => insertPolls(pollers))
    .then(polls =>
      Promise.all([
        insertPollChoices(polls),
        insertVotes(polls)
        ]).then((result) =>
          insertPollChoicesVotes (result[0], result[1])
        )
      )
};
