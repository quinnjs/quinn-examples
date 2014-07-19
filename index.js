'use strict';

require('node-jsx').install({
  extension: '.jsx',
  harmony: true
});

var route = require('quinn-router').route;

var initMods = require('./lib/mods');
var httSpy = require('./lib/httspy');

httSpy.start();

httSpy.on('request', function(req, res) {
  console.log('[REQ] %s %s', req.method, req.url);
});

httSpy.on('response', function(req, res) {
  console.log('[%s] %s %s', res.statusCode, req.method, req.url);
});

var mods = initMods({
  'basic-auth': require('./mods/basic-auth'),
  'reddit': require('./mods/reddit')
});

module.exports = route(mods.routes);
