'use strict';

module.exports = function patchServer(bus, protocol) {
  var MARKER = bus.MARKER;
  var patch = require('./patch')(MARKER);
  var http = require(protocol);

  function patchedDispatcher(original) {
    return function dispatch(req, res) {
      if (req.__HTTSPY !== MARKER) {
        bus.emit('request', req, res);

        res.on('finish', function() {
          bus.emit('response', req, res);
        });

        req.__HTTSPY = MARKER;
      }

      return original.call(this, req, res);
    };
  }

  patch(
    http.Server.prototype,
    [ 'on', 'addListener' ],
    function(original) {
      return function addListener(type, dispatch) {
        if (type === 'request' && typeof dispatch === 'function') {
          original.call(this, type, patchedDispatcher(dispatch));
        } else {
          original.call(this, type, dispatch);
        }
      };
    }
  )
};
