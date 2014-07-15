'use strict';

var controller = require('./controller');

exports.routes = function(router) {
  let GET = router.GET;

  GET('/r/{subId}', controller.subreddit);
};
