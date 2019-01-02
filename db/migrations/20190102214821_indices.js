
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('pollers', function(table) {
      table.index('email')
     }),
    knex.schema.alterTable('polls', function(table) {
      table.index('public_id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('pollers', function(table) {
      table.dropIndex('email')
     }),
    knex.schema.alterTable('polls', function(table) {
      table.dropIndex('public_id')
    })
  ])
};
