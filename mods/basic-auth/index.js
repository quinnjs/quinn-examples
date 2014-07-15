'use strict';

var Bluebird = require('bluebird');

var runRequestHandler = require('quinn').runRequestHandler;
function middleware(outer) {
  return function (inner) {
    return function(req, params) {
      return outer(req, params, function(patchedReq, patchedParams) {
        return runRequestHandler(
          inner,
          patchedReq || req,
          patchedParams || params);
      });
    }
  }
}

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

var basicAuth = function(validate) {
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

var authenticated = basicAuth(function(user) {
  return user.name === 'root' && user.pass === 's3cr3t';
});

exports.routes = function(router) {
  let GET = router.GET;

  GET('/basic-auth', authenticated(function() {
    return 'ok';
  }));
};
