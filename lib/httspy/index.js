'use strict';

var events = require('events');
var util = require('util');

var patchServer = require('./server');

var httSpy = module.exports = new events.EventEmitter();

function patchClient(bus, protcol) {}

httSpy.start = function() {
  patchServer(httSpy, 'http');
  patchServer(httSpy, 'https');

  patchClient(httSpy, 'http');
  patchClient(httSpy, 'https');

  return httSpy;
};
