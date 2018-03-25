const pg = require('../common/pg');
const R = require('ramda');

const grantTypes = ['authorization_code'];

/**
 * Return an error
 * @param {String} msg
 * @returns {Error}
 */
const err = msg => new Error(msg || 'Invalid Error');

/**
 * Get token from DB via barer token
 * @param {String} barerToken
 * @returns {Object} 
 */
const _getTokenFromDbViaBarerToken = barerToken => pg.first()
    .from('oauth_token')
    .where('value', barerToken);

/**
 * Build token response object for Oauth2 module
 * @param {Object} token
 * @returns {Object} 
 */
const _buildTokenResponse = token => ({
    accessToken: token.value,
    clientId: token.clientId,
    expires: token.expires,
    userId: token.userId
});

/**
 * Check if token exists
 * @param {*}
 * @returns {Object}
 */
const _hasToken = R.cond([
    [R.isNil, err('Invalid Access Token')],
    [R.T, _buildTokenResponse]
]);

/**
 * Get client from the DB via ID
 * @param {String} clientId 
 * @param {String} clientSecret
 * @returns {Error|Object} 
 */
const _getClientFromDbViaClientId = (clientId, clientSecret) => pg.first()
    .from('oauth_client')
    .where('id', clientId)
    .then(client => ({
        client,
        clientSecret
    }));

/**
 * Build client response object for Oauth2 module
 * @param {Object} clientData
 * @returns {Object}
 */
const _buildClientResponse = clientData => ({
    clientId: clientData.client.id,
    clientSecret: clientData.client.secret,
    redirectUri: clientData.client.redirect_uri
});

/**
 * Check if client object exists
 * @param {Object} clientData
 * @returns {Boolean} 
 */
const _hasClientData = clientData => R.compose(R.isNil, R.prop('client'))(clientData);

/**
 * Check if client secret object exists
 * @param {Object} clientData
 * @returns {Boolean}
 */
const _hasClientData = clientData => R.compose(R.isNil, R.prop('clientSecret'))(clientData);

/**
 * Check if secrets match
 * @param {Object} clientData
 * @returns {Boolean}
 */
const _isSecretMatch = clientData => R.equals(R.prop('clientSecret', clientData),
    R.path(['client', 'secret'], clientData));

/**
 * Check if client exists and valid
 * @param {Object}
 * @returns {Error|Object}
 */
const _hasClient = R.cond([
    [_hasClientData, err('Invalid Client')],
    [_hasClientSecret, err('Invalid Client')],
    [_isSecretMatch, err('Invalid Client')],
    [R.T, _buildClientResponse]
]);

/**
 * Get access token for Oauth2 module
 */
const getAccessToken = R.compose(_hasToken, _getTokenFromDbViaBarerToken);

/**
 * Get client for Oauth2 module
 */
const getClient = R.compose(_hasClient, _getClientFromDbViaClientId);

/**
 * 
 * @param {String} clientId 
 * @param {String} grantType
 * @returns {Boolean}
 */
const grantTypeAllowed = (clientId, grantType) => R.contains(grantType, grantTypes);