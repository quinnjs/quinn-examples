'use strict';

var path = require('path');
var fs = require('fs');
var respond = require('quinn-respond');

function servePage(req, params) {
  var pageId = params.pageId;

  var filename = path.join(__dirname, pageId + '.html');

  return fs.createReadStream(filename)
    .pipe(respond.html());
}

exports.routes = function(router) {
  router.GET('/file/{pageId}', servePage);
};
