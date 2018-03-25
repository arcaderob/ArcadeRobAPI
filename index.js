const restify = require('restify');
const server = restify.createServer();
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : '123456',
      database : 'postgres'
    }
  });

const respond = (req, res, next) => {
    res.send('Running-' + new Date().getTime());
};

server.get('/test', respond);
server.head('/test', respond);

server.listen(8080, () => console.log('%s listening at %s', server.name, server.url));