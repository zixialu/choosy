exports.up = function(knex, Promise) {
  return Promise.all([
    dropAllTables()
      .then(createPollers)
      .then(createPolls)
      .then(createPollChoices)
      .then(createVotes)
      .then(createPollChoicesVotes)
  ]);

  function dropAllTables() {
    return knex.schema
      .dropTableIfExists('users')
      .then(() => {
        knex.schema.dropTableIfExists('pull_choices_votes');
      })
      .then(() => {
        knex.schema.dropTableIfExists('votes');
      })
      .then(() => {
        knex.schema.dropTableIfExists('poll_choices');
      })
      .then(() => {
        knex.schema.dropTableIfExists('polls');
      })
      .then(() => {
        knex.schema.dropTableIfExists('pollers');
      });
  }

  function createPollers() {
    return knex.schema.createTable('pollers', function(table) {
      table.increments('id');
      table.string('email');
    });
  }

  function createPolls() {
    return knex.schema.createTable('polls', function(table) {
      table.increments('id');
      table.integer('poller_id');
      table.foreign('poller_id').references('pollers.id');
      table.string('prompt');
      table.datetime('create_date');
      table.datetime('close_date');
      table.string('public_id').notNullable();
    });
  }

  function createPollChoices() {
    return knex.schema.createTable('poll_choices', function(table) {
      table.increments('id');
      table.integer('poll_id');
      table.foreign('poll_id').references('polls.id');
      table.string('title');
      table.string('description');
    });
  }

  function createVotes() {
    return knex.schema.createTable('votes', function(table) {
      table.increments('id');
      table.integer('poll_id');
      table.foreign('poll_id').references('polls.id');
      table.datetime('vote_date');
    });
  }

  function createPollChoicesVotes() {
    return knex.schema.createTable('poll_choices_votes', function(table) {
      // This is the lazy way of making a composite primary foreign key setup
      table.increments('id');
      table.integer('vote_id');
      table.foreign('vote_id').references('votes.id');
      table.integer('poll_choice_id');
      table.foreign('poll_choice_id').references('poll_choices.id');
      table.integer('rank');
    });
  }
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('poll_choices_votes'),
    knex.schema.dropTableIfExists('votes'),
    knex.schema.dropTableIfExists('poll_choices'),
    knex.schema.dropTableIfExists('polls'),
    knex.schema.dropTableIfExists('pollers')
  ]);
};
