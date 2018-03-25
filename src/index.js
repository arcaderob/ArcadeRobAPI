const restify = require('restify');
const server = restify.createServer();
const routesV1 = require('./routesV1');

routesV1.addRoutes(server);

server.listen(8080, () => console.log('%s listening at %s', server.name, server.url));