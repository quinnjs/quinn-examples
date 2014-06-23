'use strict';

require('node-jsx').install({
  extension: '.jsx',
  harmony: true
});

var route = require('quinn-router').route;
var firstHandler = require('quinn').firstHandler;

module.exports = firstHandler(
  route(require('./conf/routes')),
  route(require('./mods/reddit/routes'))
);
