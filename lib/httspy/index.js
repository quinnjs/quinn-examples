'use strict';

var events = require('events');
var util = require('util');

var patchServer = require('./server');

function patchClient(bus, protcol) {}

function HTTSpy() {
  if (!this instanceof HTTSpy) {
    return new HTTSpy();
  }
  events.EventEmitter.apply(this);

  this.MARKER = {};
}
util.inherits(HTTSpy, events.EventEmitter);

HTTSpy.prototype.start = function() {
  patchServer(this, 'http');
  patchServer(this, 'https');

  patchClient(this, 'http');
  patchClient(this, 'https');

  return this;
};

module.exports = HTTSpy;
