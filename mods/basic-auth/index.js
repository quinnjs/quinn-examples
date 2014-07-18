'use strict';

var basicAuth = require('../../lib/basic-auth');

var authenticated = basicAuth(function(user) {
  return user.name === 'root' && user.pass === 's3cr3t';
});

exports.routes = function(router) {
  let GET = router.GET;

  GET('/basic-auth', authenticated(function() {
    return 'ok';
  }));
};
