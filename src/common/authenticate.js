const OAuth2Server = require('oauth2-server');

const oauth = new OAuth2Server({
    model: require('../models/oauthModel'),
    grants: ['authorization_code'],
    debug: true
});

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;