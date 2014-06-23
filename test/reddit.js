'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');

var pinky = require('pinky-test');
var swear = pinky.swear;

var handler = require('../');

function quickRequest(pathname, expectedCode) {
  var server = null;

  return new Bluebird(function(resolve, reject) {
    var http = require('http');
    var quinn = require('quinn');

    server = http.createServer(quinn(handler));

    server.listen(function() {
      var addr = this.address();
      http.get('http://localhost:' + addr.port + pathname, function(res) {
        if (expectedCode !== undefined && expectedCode !== res.statusCode) {
          reject(new Error(
            'Expected status code ' + expectedCode +
            ', got ' + res.statusCode));
        }
        var body = '';
        res.on('error', reject);
        res.on('data', function(chunk) { body += chunk.toString('utf8'); });
        res.on('end', function() {
          res.body = body;
          resolve(res);
        });
      }).on('error', reject);
    });
  }).finally(function() {
    if (server !== null)
      try { server.close(); } catch (err) {}
  });
}

pinky('reddit', [
  swear('/r/javascript', function() {
    return quickRequest('/r/javascript')
      .then(_.property('body'))
      .then(function(body) {
        return swear([
          swear.include('<html', body),
          swear.include('<h5>JavaScript</h5>', body)
        ]);
      });
  })
]);
