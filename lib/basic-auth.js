'use strict';

var Bluebird = require('bluebird');

var middleware = require('./middleware');

function getAuth(req) {
  var authHeader = req.headers.authorization, m;
  if (authHeader && (m = authHeader.match(/^basic (.+)$/i))) {
    var auth = new Buffer(m[1], 'base64').toString();
    var sepIdx = auth.indexOf(':');
    if (sepIdx !== -1) {
      return {
        name: auth.slice(0, sepIdx),
        pass: auth.slice(sepIdx + 1)
      };
    }
  }
}

module.exports = function basicAuth(validate) {
  var realm = 'Protected';

  function authFailed() {
    return {
      statusCode: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm=' + JSON.stringify(realm)
      },
      body: 'Unauthorized'
    };
  }

  return middleware(function(req, params, next) {
    var user = getAuth(req);
    if (user && validate(user)) {
      return Bluebird.try(validate, user)
        .then(function(valid) {
          if (valid) {
            return next();
          }
          return authFailed();
        })
    } else {
      return authFailed();
    }
  });
};
