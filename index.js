'use strict';

require('node-jsx').install({
  extension: '.jsx',
  harmony: true
});

var route = require('quinn-router').route;
var firstHandler = require('quinn').firstHandler;

var runRequestHandler = require('quinn').runRequestHandler;
function use(outer) {
  return function (inner) {
    function normalizedInner(req, params) {
      return runRequestHandler(inner, req, params);
    }

    return function(req, params) {
      return outer(req, params, normalizedInner);
    }
  }
}

function requestLogger(req, params, inner) {
  console.log('[REQ] %s %s', req.method, req.url);
  var resP = inner(req, params);

  resP.then(
    function(res) {
      console.log('[%s] %s %s', res.statusCode, req.method, req.url);
    },
    function(err) {
      console.log('[ERR] %s %s\n  %s', req.method, req.url, err.message);
    }
  );

  return resP;
};

module.exports = use(requestLogger)(
  firstHandler(
    route(require('./conf/routes')),
    route(require('./mods/reddit/routes'))
  )
);
