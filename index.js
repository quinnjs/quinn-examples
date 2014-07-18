'use strict';

require('node-jsx').install({
  extension: '.jsx',
  harmony: true
});

var route = require('quinn-router').route;
var firstHandler = require('quinn').firstHandler;

var middleware = require('./lib/middleware');

var requestLogger = middleware(function requestLogger(req, params, inner) {
  console.log('[REQ] %s %s', req.method, req.url);
  var resP = inner(req, params);

  resP.then(
    function(res) {
      if (res === undefined) {
        console.log('[%s] %s %s', 404, req.method, req.url);
      } else {
        console.log('[%s] %s %s', res.statusCode, req.method, req.url);
      }
    },
    function(err) {
      console.log('[ERR] %s %s\n  %s', req.method, req.url, err.message);
    }
  );

  return resP;
});

var mods = [
  'basic-auth',
  'reddit'
].map(function(modName) {
  return require('./mods/' + modName);
});

var routes = [
  require('./conf/routes')
]
.concat(mods.map(function(mod) { return mod.routes; }))
.map(route);

module.exports = requestLogger(
  firstHandler.apply(null, routes)
);
