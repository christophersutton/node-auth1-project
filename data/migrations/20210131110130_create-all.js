exports.up = (knex) => {
  return knex.schema
    .createTable('users', tbl => {
      tbl.increments();
      tbl.string('email').notNullable().unique();
      tbl.string('password').notNullable();
    })
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('users')
};
