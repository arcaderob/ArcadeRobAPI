const knex = require('knex')

const connection = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : '123456',
      database : 'postgres'
    }
  });

  module.exports = connection;