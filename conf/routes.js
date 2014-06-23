'use strict';

module.exports = function(router) {
  let GET = router.GET;

  GET('/', function() {
    return 'ok';
  });
};
