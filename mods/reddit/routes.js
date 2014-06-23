'use strict';

var controller = require('./controller');

module.exports = function(router) {
  let GET = router.GET;

  GET('/r/{subId}', controller.subreddit);
};
